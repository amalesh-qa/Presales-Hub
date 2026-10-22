# Presales Hub

## Publish to GitHub Pages

1. Open https://github.com/amalesh-qa/Presales-Hub/settings/pages.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Commit and push the deployment configuration to `main`:

	 ```sh
	 git add .github/workflows/deploy-pages.yml vite.config.js README.md
	 git commit -m "Configure GitHub Pages deployment"
	 git push origin main
	 ```

4. Open https://github.com/amalesh-qa/Presales-Hub/actions and wait for
	 **Deploy to GitHub Pages** to finish successfully. Approve the `github-pages`
	 environment deployment if your repository settings require it.
5. Visit https://amalesh-qa.github.io/Presales-Hub/.

Each push to `main` rebuilds and redeploys the app. To redeploy without a new
commit, select the workflow in **Actions**, then **Run workflow**. GitHub Pages
must be available for your repository visibility and GitHub plan.

The workflow uses Node.js 22, installs locked dependencies with `npm ci`, builds
`dist`, and deploys using GitHub's official Pages actions. It passes the Pages
base path to Vite through `VITE_BASE_PATH`, so bundled assets load correctly
from the repository URL. Local development continues to use `/`.

### Local Development and Preview

Use Node.js 22.12 or later in the Node.js 22 release line.

```sh
npm ci
npm run dev
```

To preview the Pages build in PowerShell:

```powershell
$env:VITE_BASE_PATH = '/Presales-Hub/'
npm run build
Remove-Item Env:VITE_BASE_PATH
npm run preview
```

Open the preview server URL with `/Presales-Hub/` appended.

### Hosting Limitations and Security

- Pages serves static files only. The `/api/live-test-sheet/*` simulator and
	`/api/sheet-proxy` in the Vite development server do not exist on Pages.
- Use local CSV uploads or a real Google Sheet accessible directly from the
	browser. Remote sources must allow browser requests (CORS); sources requiring
	the development proxy need a separately hosted backend.
- Login, OTP generation, roles, and user management run in the browser using
	local storage. They are demo functionality, not secure authentication or
	authorization. OTPs are not sent by a server-side email service.
- Browser storage is specific to each browser and origin. Localhost data and
	configuration do not transfer automatically to the deployed site or other
	users' browsers.
- Treat the app and bundled sample data as publicly accessible unless supported
	Pages access controls are explicitly configured. Do not publish confidential
	customer data or secrets. Frontend environment variables and browser-stored
	tokens are not server-side secrets.
- Confidential production use requires a backend with real authentication,
	server-enforced permissions, and secure credential handling.

## Original Template Notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
