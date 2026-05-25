/**
 * Saves enquiry form data — tries Google Sheets, Supabase, or Web3Forms (first configured wins).
 */
window.MRVFormStorage = (function () {
  function getConfig() {
    return window.MRV_CONFIG || {};
  }

  function normalizePhone(phone) {
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits;
  }

  function buildWhatsAppUrl(payload) {
    const { whatsappNumber } = getConfig();
    const num = whatsappNumber || '919047658889';
    const text = [
      'Hello MRV Institute,',
      '',
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      `Course: ${payload.course}`,
      payload.message ? `Message: ${payload.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  }

  function isGoogleConfigured() {
    const url = getConfig().googleSheetEndpoint || '';
    return url.length > 20 && !url.includes('YOUR_SCRIPT_ID');
  }

  function isWeb3Configured() {
    const key = getConfig().web3formsAccessKey || '';
    return key.length > 8 && !key.includes('YOUR_ACCESS_KEY');
  }

  function isSupabaseConfigured() {
    const { supabaseUrl, supabaseAnonKey } = getConfig();
    return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co'));
  }

  function isConfigured() {
    return isGoogleConfigured() || isWeb3Configured() || isSupabaseConfigured();
  }

  function getStorageMethod() {
    if (isGoogleConfigured()) return 'google';
    if (isSupabaseConfigured()) return 'supabase';
    if (isWeb3Configured()) return 'web3forms';
    return null;
  }

  async function submitGoogle(payload) {
    const endpoint = getConfig().googleSheetEndpoint;
    const body = {
      name: payload.name,
      phone: payload.phone,
      course: payload.course,
      message: payload.message || '',
      source: 'website',
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString(),
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: response.ok };
    }

    if (data.ok === false) {
      return { ok: false, error: data.error || 'Google Sheet save failed' };
    }
    return { ok: true, method: 'google' };
  }

  async function submitWeb3(payload) {
    const accessKey = getConfig().web3formsAccessKey;
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `MRV Enquiry: ${payload.course}`,
        from_name: payload.name,
        phone: payload.phone,
        course: payload.course,
        message: payload.message || '(none)',
        page: window.location.href,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return { ok: false, error: data.message || 'Web3Forms save failed' };
    }
    return { ok: true, method: 'web3forms' };
  }

  async function submitSupabase(payload) {
    const { supabaseUrl, supabaseAnonKey } = getConfig();
    const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/enquiries`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        course: payload.course,
        message: payload.message || null,
        source: 'website',
        page_url: window.location.href,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { ok: false, error: err || 'Database save failed' };
    }
    return { ok: true, method: 'supabase' };
  }

  async function submit(payload) {
    if (!isConfigured()) {
      return {
        ok: false,
        error: 'storage_not_configured',
      };
    }

    const method = getStorageMethod();
    try {
      if (method === 'google') return await submitGoogle(payload);
      if (method === 'supabase') return await submitSupabase(payload);
      if (method === 'web3forms') return await submitWeb3(payload);
    } catch (err) {
      return { ok: false, error: err.message || 'Network error' };
    }

    return { ok: false, error: 'Unknown storage error' };
  }

  function getSetupHint() {
    if (isConfigured()) return '';
    return 'Add a storage key in js/config.js — fastest: Web3Forms (2 min). See setup/QUICK_STORAGE_SETUP.md';
  }

  return {
    isConfigured,
    isGoogleConfigured,
    isWeb3Configured,
    isSupabaseConfigured,
    getStorageMethod,
    getSetupHint,
    submit,
    buildWhatsAppUrl,
    normalizePhone,
  };
})();
