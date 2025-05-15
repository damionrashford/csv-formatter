# CSV Formatter (React SPA)

A modern, production-ready static React app for formatting CSV files. Deployed automatically to GitHub Pages.

## Features

- Upload, preview, and format CSV files in-browser
- Modular card-based UI (Upload, Format Options, Preview)
- All logic runs client-side (no backend)
- Automated deployment to GitHub Pages via GitHub Actions
- [PapaParse](https://www.papaparse.com/) for CSV parsing

## Getting Started

### Installation

```bash
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

Your app will be available at `http://localhost:5173` (or as shown in your terminal).

## Building for Production

Create a production build:

```bash
npm run build
```

### Test Production Build Locally

To preview the production build locally:

```bash
npx serve dist
```

## Deployment (Automated)

Deployment is fully automated using [GitHub Actions](.github/workflows/gh-pages.yml):

- On every push to `main`, the app is built and deployed to the `gh-pages` branch using [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).
- The app is served as a static site via GitHub Pages.
- All routing uses HashRouter for compatibility with static hosting.

### Live App URL

After setup, your app will be live at:

```
https://damionrashford.github.io/csv-formatter
```

## How It Works

- All code runs in the browser. No server or backend required.
- All navigation uses HashRouter for SPA compatibility on GitHub Pages.
- User settings/history are stored in localStorage.

---

Built with ❤️ using React, React Router, and PapaParse.
