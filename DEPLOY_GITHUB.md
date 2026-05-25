# Deploy to GitHub Pages

## 1. Create the repository on GitHub

1. Sign in with **mrvhealthcareinstitution@gmail.com** (or your GitHub account linked to it).
2. Go to [github.com/new](https://github.com/new).
3. Repository name: **`mrv-institute-website`** (or any name you prefer).
4. Visibility: **Public** (required for free GitHub Pages on personal accounts).
5. Do **not** add README, .gitignore, or license (this project already has them).
6. Click **Create repository**.

## 2. Push this project (one time)

In Terminal, from this folder:

```bash
cd /Users/arunkumarm/Downloads/edu-webstie

git remote add origin https://github.com/YOUR_GITHUB_USERNAME/mrv-institute-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username.

## 3. Enable GitHub Pages

1. On GitHub: repo → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**: choose **GitHub Actions**.
3. After the first push, the workflow **Deploy to GitHub Pages** runs automatically.
4. When it finishes (green check), your site URL appears under Pages, e.g.  
   `https://YOUR_GITHUB_USERNAME.github.io/mrv-institute-website/`

## 4. Updates later

```bash
git add .
git commit -m "Describe your change"
git push
```

Each push redeploys the site within a few minutes.

## Custom domain (optional)

Settings → Pages → **Custom domain** → e.g. `www.mrvinstitute.in` — then add DNS records at your domain provider.

## Form on live site

`js/config.js` includes your Google Sheets web app URL. After deploy, test the enquiry form on the live URL. If submissions fail, redeploy the Apps Script as a **new version** and update the URL in `config.js`.
