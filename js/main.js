(function () {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const tabButtons = document.querySelectorAll('.course-tabs__btn');
  const courseSearch = document.getElementById('courseSearch');
  const enquiryForm = document.getElementById('enquiryForm');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const panels = {
    ncvtc: document.getElementById('tab-ncvtc'),
    aiu: document.getElementById('tab-aiu'),
    fashion: document.getElementById('tab-fashion'),
  };

  function switchTab(tab) {
    tabButtons.forEach((b) => {
      const active = b.dataset.tab === tab;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active);
    });

    Object.entries(panels).forEach(([key, panel]) => {
      if (!panel) return;
      const active = key === tab;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });

    filterCourses();
  }

  function filterCourses() {
    if (!courseSearch) return;
    const q = courseSearch.value.trim().toLowerCase();
    const activePanel = document.querySelector('.course-panel.active');
    if (!activePanel) return;

    const rows = activePanel.querySelectorAll('table tbody tr');
    const listItems = activePanel.querySelectorAll('.course-category ul li');
    const categories = activePanel.querySelectorAll('.course-category');

    rows.forEach((row) => {
      const match = !q || row.textContent.toLowerCase().includes(q);
      row.hidden = !match;
    });

    listItems.forEach((li) => {
      const match = !q || li.textContent.toLowerCase().includes(q);
      li.style.display = match ? '' : 'none';
    });

    categories.forEach((cat) => {
      const visibleRows = cat.querySelectorAll('table tbody tr:not([hidden])');
      const visibleItems = [...cat.querySelectorAll('ul li')].filter(
        (li) => li.style.display !== 'none'
      );
      const hasTable = cat.querySelector('table tbody tr');
      const hasList = cat.querySelector('ul li');
      let show = true;
      if (q && hasTable) show = visibleRows.length > 0;
      if (q && hasList && !hasTable) show = visibleItems.length > 0;
      if (q && hasTable && hasList) show = visibleRows.length > 0 || visibleItems.length > 0;
      cat.style.display = show ? '' : 'none';
    });
  }

  function getScrollOffset() {
    const topbar = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h'), 10) || 36;
    const navh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
    return topbar + navh + 16;
  }

  function scrollToEl(el) {
    const top = el.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top, behavior: 'smooth' });
  }

  /* Header scroll shadow */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  /* Mobile nav */
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Course tabs */
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  if (courseSearch) {
    courseSearch.addEventListener('input', filterCourses);
  }

  /* Footer / deep links with data-tab */
  document.querySelectorAll('a[data-tab]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const tab = link.dataset.tab;
      const href = link.getAttribute('href');
      if (!tab || href !== '#courses') return;
      e.preventDefault();
      switchTab(tab);
      const courses = document.getElementById('courses');
      if (courses) scrollToEl(courses);
      navLinks.classList.remove('open');
    });
  });

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.dataset.tab) return;
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToEl(target);
    });
  });

  /* Enquiry form → Google Sheets + optional WhatsApp */
  const formStatus = document.getElementById('formStatus');
  const enqSubmit = document.getElementById('enqSubmit');
  const enqWhatsApp = document.getElementById('enqWhatsApp');
  const formStorageNote = document.getElementById('formStorageNote');
  const storage = window.MRVFormStorage;

  function getFormPayload() {
    const name = document.getElementById('enqName').value.trim();
    let phone = document.getElementById('enqPhone').value.trim();
    const course = document.getElementById('enqCourse').value;
    const message = document.getElementById('enqMessage').value.trim();
    if (storage) phone = storage.normalizePhone(phone);
    return { name, phone, course, message };
  }

  function showFormStatus(type, message) {
    if (!formStatus) return;
    formStatus.hidden = false;
    formStatus.className = `form-status form-status--${type}`;
    formStatus.textContent = message;
  }

  function clearFormStatus() {
    if (!formStatus) return;
    formStatus.hidden = true;
    formStatus.textContent = '';
  }

  function setFormLoading(loading) {
    if (!enqSubmit) return;
    enqSubmit.disabled = loading;
    const label = enqSubmit.querySelector('.btn__label');
    if (label) label.textContent = loading ? 'Submitting…' : 'Submit enquiry';
  }

  if (formStorageNote && storage && !storage.isConfigured()) {
    formStorageNote.hidden = false;
    formStorageNote.innerHTML =
      '<strong>Storage not set up.</strong> Add a Web3Forms key (2 min) or Google Sheet URL in <code>js/config.js</code>. ' +
      '<a href="setup.html">2-minute setup guide →</a>';
    formStorageNote.classList.add('enquiry-form__note--warn');
  } else if (formStorageNote && storage && storage.isConfigured()) {
    formStorageNote.hidden = true;
  }

  function openWhatsAppFromForm() {
    if (!storage) return;
    const payload = getFormPayload();
    if (!payload.name || !payload.phone || !payload.course) {
      enquiryForm.reportValidity();
      return;
    }
    window.open(storage.buildWhatsAppUrl(payload), '_blank', 'noopener');
  }

  if (enqWhatsApp) {
    enqWhatsApp.addEventListener('click', openWhatsAppFromForm);
  }

  if (enquiryForm && storage) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormStatus();

      const payload = getFormPayload();
      if (!payload.name || !payload.phone || !payload.course) {
        enquiryForm.reportValidity();
        return;
      }

      if (payload.phone.length !== 10) {
        showFormStatus('error', 'Please enter a valid 10-digit mobile number.');
        return;
      }

      if (!storage.isConfigured()) {
        showFormStatus(
          'warn',
          'Online storage is not configured yet. Open setup.html, add your Web3Forms key to js/config.js (~2 minutes), then try again. Or use the WhatsApp button below.'
        );
        return;
      }

      setFormLoading(true);
      const result = await storage.submit(payload);
      setFormLoading(false);

      if (result.ok) {
        enquiryForm.reset();
        showFormStatus(
          'success',
          'Thank you! We have received your enquiry and will contact you soon.'
        );
      } else if (result.error === 'storage_not_configured') {
        showFormStatus('warn', storage.getSetupHint());
      } else {
        showFormStatus(
          'error',
          `${result.error || 'Could not send your enquiry.'} Please use WhatsApp or call us directly.`
        );
      }
    });
  }

  /* Gallery lightbox */
  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery__zoom').forEach((btn) => {
    btn.addEventListener('click', () => {
      openLightbox(btn.dataset.src, btn.dataset.caption || '');
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });
})();
