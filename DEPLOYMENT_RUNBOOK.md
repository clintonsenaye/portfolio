# Deployment Runbook: From Domain to Live Website

A comprehensive guide to deploying a static website with a custom domain using Cloudflare (DNS) and Netlify (hosting).

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Decisions](#architecture-decisions)
3. [Step 1: Purchase a Domain (Cloudflare)](#step-1-purchase-a-domain-cloudflare)
4. [Step 2: Prepare Your Code (Git)](#step-2-prepare-your-code-git)
5. [Step 3: Push to GitHub](#step-3-push-to-github)
6. [Step 4: Deploy to Netlify](#step-4-deploy-to-netlify)
7. [Step 5: Connect Custom Domain](#step-5-connect-custom-domain)
8. [Step 6: Configure DNS (Cloudflare)](#step-6-configure-dns-cloudflare)
9. [Step 7: Enable HTTPS](#step-7-enable-https)
10. [Troubleshooting](#troubleshooting)
11. [Glossary](#glossary)

---

## Overview

### What We're Building

A deployment pipeline that:
- Hosts your static website for free
- Automatically deploys when you push code to GitHub
- Uses a custom domain (e.g., clintonsenaye.com)
- Secures traffic with HTTPS (SSL certificate)

### The Stack

| Component | Service | Purpose |
|-----------|---------|---------|
| Domain Registrar | Cloudflare | Purchase and manage your domain name |
| DNS | Cloudflare | Translate domain name to server IP |
| Hosting | Netlify | Serve your website files globally |
| Version Control | GitHub | Store code and trigger deployments |
| SSL Certificate | Let's Encrypt (via Netlify) | Encrypt traffic (HTTPS) |

---

## Architecture Decisions

### Why Cloudflare for Domain Registration?

1. **At-cost pricing** — Cloudflare charges exactly what the registry charges. No markup. A `.com` domain costs ~$9-10/year.

2. **Free WHOIS privacy** — Your personal information (name, address, email) is hidden from public WHOIS lookups. Other registrars charge extra for this.

3. **Security-focused** — Cloudflare is a security company. They include DNSSEC, DDoS protection, and other security features by default.

4. **No upselling** — Unlike GoDaddy or Namecheap, Cloudflare doesn't bombard you with add-on offers.

**Alternatives considered:**
- GoDaddy: Aggressive upselling, higher prices
- Namecheap: Good, but Cloudflare is cheaper
- Google Domains: Sold to Squarespace, future uncertain

### Why Netlify for Hosting?

1. **Git-based deployments** — Push to GitHub, site automatically rebuilds and deploys. No manual steps.

2. **Free tier is generous** — Unlimited sites, 100GB bandwidth/month, 100 form submissions/month.

3. **Built-in form handling** — Contact forms work without any backend code. Just add `data-netlify="true"` to your form.

4. **Security headers via config** — You can set HTTP security headers in a `netlify.toml` file.

5. **Instant rollbacks** — If a deployment breaks something, one-click revert to previous version.

6. **Global CDN** — Your site is served from servers worldwide, making it fast for all visitors.

**Alternatives considered:**
- Vercel: Great, but more focused on Next.js. No built-in forms.
- Cloudflare Pages: Good, but no built-in form handling.
- GitHub Pages: Limited features, no form handling, no custom headers.

### Why Separate DNS and Hosting?

You might wonder: "Why not use Cloudflare Pages (hosting) since we're already using Cloudflare for DNS?"

**Reasons for separation:**

1. **Avoid single point of failure** — If Cloudflare has an outage, only your DNS is affected, not your hosting (or vice versa).

2. **Best-of-breed** — Netlify specializes in static site hosting and has features Cloudflare Pages lacks (forms, better build system).

3. **Flexibility** — You can switch hosting providers without changing your domain registrar.

---

## Step 1: Purchase a Domain (Cloudflare)

### What is a Domain?

A domain is your website's address (e.g., `clintonsenaye.com`). Without it, people would need to remember an IP address like `104.21.45.123`.

### How to Purchase

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Create an account (free)
3. Click **Domain Registration** → **Register Domain**
4. Search for your desired domain (e.g., `clintonsenaye.com`)
5. If available, click **Purchase**
6. Complete payment (~$9-10/year for .com)

### Choosing a Domain Name

For a professional portfolio:
- Use your full name: `clintonsenaye.com` ✓
- Stick with `.com` — universally recognized and trusted
- Avoid hyphens, numbers, or clever spellings

### What Happens After Purchase

Cloudflare becomes your **domain registrar** — they manage your ownership of the domain. They also automatically become your **DNS provider** — they'll translate your domain name to IP addresses.

---

## Step 2: Prepare Your Code (Git)

### What is Git?

Git is version control software. It tracks changes to your code over time, lets you revert mistakes, and enables collaboration.

### Why Use Git?

1. **History** — Every change is recorded. You can see what changed, when, and why.
2. **Backup** — Your code lives on GitHub, not just your laptop.
3. **Deployment trigger** — Netlify watches your GitHub repo and deploys when you push.

### Initialize Git in Your Project

```bash
cd /path/to/your/project

# Initialize a new Git repository
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit"
```

### What These Commands Do

| Command | Purpose |
|---------|---------|
| `git init` | Creates a `.git` folder that tracks changes |
| `git add .` | Stages all files for the next commit |
| `git commit -m "..."` | Saves a snapshot of your staged files with a message |

---

## Step 3: Push to GitHub

### What is GitHub?

GitHub is a cloud platform that hosts Git repositories. It's where your code lives online.

### Create a Repository on GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click **+** → **New repository**
3. Fill in:
   - **Name:** `portfolio` (or whatever you prefer)
   - **Description:** `Personal portfolio and blog — DevSecOps & AI Security`
   - **Visibility:** Public (recommended for portfolios)
4. **Do NOT** check "Add README" or ".gitignore" (you already have these)
5. Click **Create repository**

### Why Public?

For a portfolio:
- Recruiters can see your code quality
- Shows transparency and confidence
- Nothing sensitive in a portfolio site

### Connect Local Repo to GitHub

After creating the repo, GitHub shows you commands. Run these:

```bash
# Add GitHub as a remote (replace with your URL)
git remote add origin https://github.com/yourusername/portfolio.git

# Rename branch to 'main' (modern convention)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

### What These Commands Do

| Command | Purpose |
|---------|---------|
| `git remote add origin <url>` | Links your local repo to GitHub |
| `git branch -M main` | Renames your branch to `main` |
| `git push -u origin main` | Uploads your code to GitHub |

The `-u` flag sets up tracking, so future pushes only need `git push`.

---

## Step 4: Deploy to Netlify

### Create a Netlify Account

1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up (you can use your GitHub account)
3. Complete the onboarding questions

### Import Your GitHub Repository

1. Click **Add new site** → **Import an existing project**
2. Choose **GitHub**
3. Authorize Netlify to access your GitHub (select "Only select repositories" and choose your portfolio repo)
4. Select your **portfolio** repository

### Configure Build Settings

Netlify auto-detects Astro projects. Verify these settings:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |

5. Click **Deploy site**

### What Happens During Deployment

1. Netlify clones your repository
2. Runs `npm install` to install dependencies
3. Runs `npm run build` to generate static files
4. Uploads the `dist` folder to their global CDN
5. Assigns a random subdomain (e.g., `relaxed-swan-4f420b.netlify.app`)

### Automatic Future Deployments

From now on, every time you:
```bash
git add .
git commit -m "Update something"
git push
```

Netlify automatically:
1. Detects the push
2. Rebuilds your site
3. Deploys the new version
4. Keeps the old version for rollback if needed

---

## Step 5: Connect Custom Domain

### Add Domain to Netlify

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain: `clintonsenaye.com`
4. Click **Add domain**

### What Netlify Does

Netlify will:
1. Add your domain as the primary domain
2. Automatically add `www.clintonsenaye.com` as an alias
3. Show "Pending DNS verification" until you configure DNS

### Why Both Root and WWW?

- **Root domain:** `clintonsenaye.com`
- **WWW subdomain:** `www.clintonsenaye.com`

Both should work. Netlify redirects `www` to the root domain automatically.

---

## Step 6: Configure DNS (Cloudflare)

### What is DNS?

DNS (Domain Name System) translates human-readable domain names to IP addresses. When someone visits `clintonsenaye.com`, DNS tells their browser where to find your server.

Think of it like a phone book: you look up a name (domain) to find a number (IP address).

### DNS Record Types

| Type | Purpose | Example |
|------|---------|---------|
| **A** | Points domain to an IPv4 address | `192.0.2.1` |
| **AAAA** | Points domain to an IPv6 address | `2001:db8::1` |
| **CNAME** | Points domain to another domain | `example.netlify.app` |

### Why CNAME for Netlify?

We use CNAME records because:
1. Netlify's IP addresses can change
2. CNAME points to Netlify's domain, which they keep updated
3. More reliable than hardcoding an IP address

### Add DNS Records in Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select your domain
3. Click **DNS** → **Records**
4. Add two CNAME records:

**Record 1 (Root Domain):**
| Field | Value |
|-------|-------|
| Type | CNAME |
| Name | `@` (represents root domain) |
| Target | `your-site-name.netlify.app` |
| Proxy status | **DNS only** (gray cloud) |

**Record 2 (WWW Subdomain):**
| Field | Value |
|-------|-------|
| Type | CNAME |
| Name | `www` |
| Target | `your-site-name.netlify.app` |
| Proxy status | **DNS only** (gray cloud) |

### Critical: Proxy Status Must Be "DNS Only"

Cloudflare has two proxy modes:

| Mode | Icon | What it does |
|------|------|--------------|
| **Proxied** | Orange cloud | Traffic goes through Cloudflare's servers |
| **DNS only** | Gray cloud | Traffic goes directly to Netlify |

**You MUST use "DNS only" (gray cloud) because:**

1. Netlify needs to verify domain ownership to issue SSL certificates
2. If proxied, Netlify sees Cloudflare's IP, not verification requests
3. SSL certificate provisioning will fail

**Click the orange cloud to turn it gray before saving.**

### DNS Propagation

After saving, DNS changes propagate globally. This can take:
- **Usually:** 1-5 minutes
- **Sometimes:** Up to 48 hours (rare)

During propagation, some users might see the old DNS, others the new.

---

## Step 7: Enable HTTPS

### What is HTTPS?

HTTPS encrypts traffic between the browser and your server. Without it:
- Data can be intercepted (passwords, form submissions)
- Browsers show "Not Secure" warnings
- Google ranks your site lower

### How SSL Certificates Work

1. A Certificate Authority (CA) verifies you own the domain
2. They issue a certificate (a cryptographic file)
3. Your server uses this certificate to encrypt traffic
4. Browsers see the padlock icon

### Netlify + Let's Encrypt

Netlify automatically:
1. Requests a free certificate from Let's Encrypt
2. Verifies domain ownership via DNS
3. Installs the certificate
4. Renews it before expiration (every 90 days)

You don't have to do anything manually.

### Verify SSL in Netlify

1. Go to **Domain management** → scroll to **HTTPS**
2. Click **Verify DNS configuration**
3. Wait for "DNS verification was successful" ✓
4. Certificate provisioning begins automatically
5. Once complete, you'll see "Your site has HTTPS enabled" ✓

### Provisioning Time

SSL certificate provisioning typically takes:
- **1-10 minutes** after DNS verification
- Sometimes longer for new domains

During this time, visiting `https://yourdomain.com` shows a certificate error. This is normal. Wait for Netlify to finish.

---

## Troubleshooting

### SSL Certificate Won't Provision

**Symptoms:** "Waiting on DNS propagation" for more than 10 minutes

**Solutions:**
1. Verify DNS records are correct in Cloudflare
2. Ensure proxy status is "DNS only" (gray cloud)
3. Click "Retry DNS verification" in Netlify
4. Wait longer — sometimes it takes up to 30 minutes

### Site Shows "Not Secure" After Setup

**Cause:** Browser cached the old certificate error

**Solution:**
1. Clear browser cache
2. Try incognito/private window
3. Try a different browser

### DNS Changes Not Taking Effect

**Cause:** DNS propagation delay

**Solutions:**
1. Wait 5-10 minutes
2. Check propagation status at [dnschecker.org](https://dnschecker.org)
3. Flush local DNS cache:
   - Mac: `sudo dscacheutil -flushcache`
   - Windows: `ipconfig /flushdns`

### Netlify Build Fails

**Check the deploy log for errors:**
1. Go to **Deploys** in Netlify
2. Click the failed deploy
3. Read the error message
4. Common issues:
   - Missing dependencies: Run `npm install` locally first
   - Build command wrong: Should be `npm run build`
   - Publish directory wrong: Should be `dist` for Astro

---

## Glossary

| Term | Definition |
|------|------------|
| **DNS** | Domain Name System — translates domain names to IP addresses |
| **Domain** | Your website's address (e.g., clintonsenaye.com) |
| **Registrar** | Company where you purchase/manage domains (e.g., Cloudflare) |
| **CNAME** | DNS record that points a domain to another domain |
| **A Record** | DNS record that points a domain to an IP address |
| **SSL/TLS** | Encryption protocols that secure web traffic |
| **HTTPS** | HTTP with SSL/TLS encryption (the padlock) |
| **CDN** | Content Delivery Network — servers worldwide that cache your site |
| **Let's Encrypt** | Free Certificate Authority that issues SSL certificates |
| **Propagation** | Time for DNS changes to spread globally |
| **Git** | Version control software for tracking code changes |
| **Repository** | A Git project containing your code and its history |
| **Commit** | A saved snapshot of your code at a point in time |
| **Push** | Upload local commits to a remote repository (GitHub) |
| **Deploy** | Process of making your website live on the internet |
| **Static Site** | Website with pre-built HTML files (no server-side code) |
| **Build** | Process of generating static files from source code |

---

## Quick Reference

### Commands Used

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub
git remote add origin https://github.com/username/repo.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your message"
git push
```

### DNS Records Summary

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | @ | your-site.netlify.app | DNS only |
| CNAME | www | your-site.netlify.app | DNS only |

### Deployment Flow

```
Local Code → Git Commit → Push to GitHub → Netlify Detects → Build → Deploy → Live Site
```

---

## Summary

What we accomplished:

1. **Purchased domain** on Cloudflare (at-cost, secure)
2. **Pushed code** to GitHub (version control, backup)
3. **Deployed** on Netlify (auto-deploys, forms, CDN)
4. **Configured DNS** in Cloudflare (CNAME to Netlify)
5. **Enabled HTTPS** via Let's Encrypt (automatic, free)

Your site is now:
- Live at `https://clintonsenaye.com`
- Automatically deployed on every `git push`
- Secured with HTTPS
- Served globally via CDN
- Protected with security headers

---

*Document created: January 2026*
*Author: Clinton Senaye with Claude*
