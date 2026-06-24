# Cloudflare Pages Deployment & Custom Domain Setup Guide

This document outlines how to set up continuous deployment from GitHub to Cloudflare Pages and configure `happyfun.zone` as the custom domain.

---

## 🚀 1. Continuous Deployment Setup

Cloudflare Pages connects directly to your GitHub repository to rebuild and deploy your application every time you commit code.

1. **Log in to Cloudflare**: Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. **Navigate to Pages**: Click **Workers & Pages** -> **Pages** in the left sidebar.
3. **Connect Repository**:
   * Click **Create a project** -> select **Connect to Git**.
   * Click **Connect GitHub** and log in to authorize Cloudflare.
   * Choose your repository: **`JimEOler/happyfun-zone`**.
   * Click **Begin setup**.
4. **Configure Build Settings**:
   * **Project name**: `happyfun-zone` (or custom name)
   * **Production branch**: `main`
   * **Framework preset**: Select **Vite** (this automatically fills in the build parameters).
   * *If configuring manually:*
     * **Build command**: `npm run build`
     * **Build output directory**: `dist`
     * **Root directory**: `/`
5. **Configure Environment Variables (Optional)**:
   * Under **Environment variables (advanced)**, click **Add variable** if your code requires keys (e.g., `GEMINI_API_KEY`).
6. **Save and Deploy**: Click **Save and Deploy**. Cloudflare will run the initial build.

---

## 🌐 2. Custom Domain Configuration (`happyfun.zone`)

Once the initial deployment completes successfully, point your custom domain to the deployed Cloudflare Pages application.

1. In your project dashboard on Cloudflare Pages, go to the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter your domain: **`happyfun.zone`** (or `www.happyfun.zone`) and click **Continue**.
4. **Configure DNS Records**:
   * **If managed by Cloudflare**: Cloudflare will automatically offer to set up the CNAME records. Click **Activate domain** (or **Set up domain**).
   * **If managed externally (e.g., GoDaddy, Namecheap)**: Add a CNAME record at your domain registrar pointing to your Pages subdomain:
     * **Type**: `CNAME`
     * **Name/Host**: `@`
     * **Target/Value**: `happyfun-zone.pages.dev`
     * **TTL**: `Auto`
5. **SSL Certificate**: Cloudflare will automatically provision a free SSL certificate. Once the status updates to **Active**, the website will be live at [https://happyfun.zone](https://happyfun.zone).

---

## ⚡ 3. Automatic Updates

Every time you run the following commands locally:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
Cloudflare Pages will automatically detect the new commit on GitHub, rebuild the React application, and update the live site at `happyfun.zone` within seconds.
