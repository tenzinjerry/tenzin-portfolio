Portfolio CMS V8 — project editing workspaces

Deploy all website files to the existing GitHub repository root. No SQL changes required.
Preserves the existing Supabase project table, authentication, public project pages, and project uploads.

New project editor sections: Overview, Methodology, Results, Media, Documents.
Save local draft / Restore draft: local browser only, not a server-side draft or publishing workflow.
Publish project: existing Save entry implementation, writes to Supabase when authenticated.
Delete: existing confirmation is retained.
Export JSON backup before deployment.

Limitations: one main image and one PDF URL per project; not yet a multi-image gallery.
The project editor does not yet support server-side draft/review workflow.
Verify Admin login, existing records, and publishing after deployment.
