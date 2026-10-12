REUSABLE PROXYCHECK PROTECTION FOR STATIC HTML SITES
====================================================

COPY THESE INTO EACH WEBSITE'S public_html:
- vpn-config.php
- vpn-gate.php
- .vpn-cache/ folder

THEN:
1. Put your existing ProxyCheck private API key in vpn-config.php.
   You may use the same key for websites you own; usage is shared across the account/plan.
2. Open the website's existing .htaccess.
3. Add the rules from HTACCESS-RULES.txt near the TOP, before other HTML/extensionless rewrite rules.
4. Do not overwrite unrelated redirects, canonical rules, HTTPS rules, or custom 404 rules.
5. Upload and test:
   - Normal Internet -> site opens.
   - VPN/proxy -> plain 403 Forbidden page.
6. Each site gets its own .vpn-cache directory, reducing repeat API lookups.

DEFAULT BLOCKING:
- VPN
- Proxy
- Tor
- Anonymous networks
- Hosting/datacenter/server networks

SEO:
- The page URL and HTML content do not change.
- Verified Google/Bing crawlers are allowed using reverse + forward DNS validation.
- Blocked visitors receive a plain HTTP 403 Forbidden response with no custom branding/message and noindex/nofollow.

IMPORTANT:
- Never put the private API key in JavaScript or HTML.
- If a site already has a complex .htaccess, merge the rules rather than replacing the whole file.
- If a site's home file is not index.html, change `file=index.html` in the homepage rule.
