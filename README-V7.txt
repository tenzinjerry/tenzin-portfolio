TENZIN PORTFOLIO V7 — SECTIONED CMS

Based on the working V6 files.

Install: upload the website files (not the .sql file) to the root of the existing GitHub repository, replacing matching files. Do not delete Supabase tables or uploaded media.

Admin: https://tenzin-portfolio.pages.dev/admin.html
Public: https://tenzin-portfolio.pages.dev/

No new SQL is required if V6 site-content SQL has already been run successfully.

CMS tabs: Homepage, Research, Experience, Education, Projects, Contact. Each text section has its own editable fields and publishes only that section. Projects use the existing Supabase project editor, including image/PDF upload and backup.

Security: existing Supabase authentication and RLS remain authoritative. The Admin URL is not private by itself. Only authenticated users in portfolio_admins may publish.

Limitations: headings and static layout elements without data-content-key are still code-defined. Adding arbitrary new site sections, galleries, or changing page layout requires a future schema and UI upgrade.

Test after deploy: sign in, publish one homepage text change, verify public site; edit an existing project without deleting it; sign out and ensure editing controls disappear.
