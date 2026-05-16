# Clutch Launch System — Deploy to GitHub + Vercel

## Step 1 — Initialize & push to GitHub

Run these commands one at a time in the project folder:

```bash
git init
git add .
git commit -m "init: Clutch Launch System v5"
git branch -M main
git remote add origin https://github.com/rtharumanathan/clutchlaunch.git
git push -u origin main
```

> If the repo already exists on GitHub with content, add `--force` to the last push:
> `git push -u origin main --force`

---

## Step 2 — Deploy on Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Find and select `rtharumanathan/clutchlaunch`
4. Vercel will auto-detect Vite — confirm these settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**

That's it. Vercel will give you a live URL on the first deploy and auto-redeploy on every `git push` to `main`.

---

## Local dev

```bash
npm install
npm run dev
```
