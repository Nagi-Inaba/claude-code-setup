---
name: vercel-deploy-claimable
description: Deploy applications and websites to Vercel. Use when the user requests deployment actions such as "Deploy my app", "Deploy this to production", "Create a preview deployment", "Deploy and give me the link", or "Push this live". Returns preview URL and claimable deployment link; no auth required to deploy.
---

# Vercel Deploy (Claimable)

Deploy any project to Vercel instantly. No authentication required. Returns a **Preview URL** (live site) and a **Claim URL** so the user can transfer the deployment to their own Vercel account.

## How It Works

1. Package the project into a tarball (exclude `node_modules` and `.git`)
2. Auto-detect framework from `package.json`
3. Upload to deployment service
4. Return **Preview URL** and **Claim URL**

## Using the Deploy Script

The official deploy script lives in the Vercel agent-skills repo. To use it:

1. **From repo**: Clone [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) and run from the skill directory:
   ```bash
   bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh [path]
   ```

2. **With npx** (if using skills CLI):
   ```bash
   npx skills add vercel-labs/agent-skills
   ```
   Then run the script from the installed skill path (e.g. `scripts/deploy.sh`).

**Arguments:**
- `path` - Directory to deploy, or a `.tgz` file (defaults to current directory)

**Examples:**
```bash
# Deploy current directory
bash scripts/deploy.sh

# Deploy specific project
bash scripts/deploy.sh /path/to/project

# Deploy existing tarball
bash scripts/deploy.sh /path/to/project.tgz
```

## Output

```
Preparing deployment...
Detected framework: nextjs
Creating deployment package...
Deploying...
✓ Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL: https://vercel.com/claim-deployment?code=...
```

The script may also output JSON to stdout for programmatic use (previewUrl, claimUrl, deploymentId, projectId).

## Framework Detection

Auto-detects from `package.json`. Supported frameworks include:
- **React**: Next.js, Gatsby, Create React App, Remix, React Router
- **Vue**: Nuxt, Vitepress, Vuepress, Gridsome
- **Svelte**: SvelteKit, Svelte, Sapper
- **Other**: Astro, Solid Start, Angular, Ember, Preact, Docusaurus, Vite, Parcel
- **Backend**: Express, Hono, Fastify, NestJS, Elysia, h3, Nitro

For static HTML projects (no `package.json`), framework is set to `null`. A single non-index `.html` file may be renamed so it is served at `/`.

## Present Results to User

Always show both URLs:

```
✓ Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL: https://vercel.com/claim-deployment?code=...

View your site at the Preview URL.
To transfer this deployment to your Vercel account, visit the Claim URL.
```

## Troubleshooting

### Network / Egress Error

If deployment fails due to network restrictions, suggest:
1. Allow `*.vercel.com` in the environment’s allowed domains (e.g. in Cursor/Claude capabilities or firewall).
2. Retry the deployment.

### Missing Script

If the deploy script is not available locally, direct the user to install the skill or clone the repo and run the script from there:
- https://github.com/vercel-labs/agent-skills/tree/main/skills/claude.ai/vercel-deploy-claimable
