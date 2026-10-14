/* Version 3: shareable project pages; existing Supabase editor remains unchanged. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const slug=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const secure=u=>typeof u==='string'&&/^https:\/\//i.test(u);
 const page=document.createElement('section');page.id='liveProjectPage';page.className='live-page wrap';page.setAttribute('aria-live','polite');document.querySelector('main').after(page);
 const style=document.createElement('style');style.textContent=`body.project-route main,body.project-route footer{display:none}body.project-route .live-page{display:block}.live-page{display:none;padding-top:44px;padding-bottom:100px;min-height:85vh}.live-back{display:inline-block;margin-bottom:32px;color:#7ce0bf;text-decoration:none;font-weight:700}.live-layout{max-width:930px;margin:auto}.live-meta{color:#7bd9b7;text-transform:uppercase;font-size:12px;font-weight:800;letter-spacing:.15em}.live-page h1{font-size:clamp(34px,5.5vw,64px);margin:16px 0 22px}.live-intro{font-size:18px}.live-figure{margin:32px 0}.live-figure img{display:block;width:100%;max-height:580px;object-fit:contain;background:#fff;border-radius:14px}.live-figure figcaption{font-size:13px;color:#9cb1bf;margin-top:10px}.live-section{border-top:1px solid #304350;padding:25px 0}.live-section p{white-space:pre-wrap;overflow-wrap:anywhere}.live-links{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}.live-card-link{display:inline-flex;margin-top:auto;align-self:flex-start}.live-error{padding:60px 0}.project-card .project-open{display:none}.project-card .live-card-link{margin-top:auto}.live-page a:focus-visible{outline:3px solid #65dcb7;outline-offset:4px}`;document.head.append(style);
 function urlFor(p){return '/projects/'+slug(p.title)}
 function route(){
  const match=location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  if(!match){document.body.classList.remove('project-route');page.innerHTML='';return}
  document.body.classList.add('project-route');
  const p=projects.find(x=>slug(x.title)===match[1]);
  if(!p){page.innerHTML='<div class="live-layout live-error"><a class="live-back" href="/">← Back to portfolio</a><h1>Project not found</h1><p>Check the project URL or return to the portfolio.</p></div>';return}
  document.title=p.title+' | Tenzin — Engineering & Research';
  const section=(title,value)=>value?`<section class="live-section"><h2>${title}</h2><p>${esc(value)}</p></section>`:'';
  const hero=secure(p.image_url)?`<figure class="live-figure"><a href="${esc(p.image_url)}" target="_blank" rel="noopener noreferrer" title="Open full-size research image"><img src="${esc(p.image_url)}" alt="Research or project illustration: ${esc(p.title)}"></a><figcaption>Click the image to open the full-resolution figure in a new tab.</figcaption></figure>`:'';
  page.innerHTML=`<div class="live-layout"><a class="live-back" href="/">← All projects</a><div class="live-meta">${esc(p.category)} · ${esc(p.year)}</div><h1>${esc(p.title)}</h1>${p.summary?`<p class="live-intro">${esc(p.summary)}</p>`:''}${hero}${section('Project overview',p.description)}${section('Methods & responsibilities',p.methods)}${section('Results & deliverables',p.outcomes)}<section class="live-section"><h2>Project resources</h2><div class="live-links">${secure(p.document_url)?`<a class="btn" href="${esc(p.document_url)}" target="_blank" rel="noopener noreferrer">View supporting PDF ↗</a>`:''}${secure(p.link)?`<a class="btn secondary" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">External resource ↗</a>`:''}${!secure(p.document_url)&&!secure(p.link)?'<p>Supporting documents will be added as they become available.</p>':''}</div></section><a class="live-back" href="/">← Return to portfolio</a></div>`;
  window.scrollTo(0,0);
 }
 const previousRender=render;
 render=function(){previousRender();const shown=projects.filter(p=>filter==='All'||p.category===filter);document.querySelectorAll('#projectGrid article').forEach((card,i)=>{const p=shown[i];if(!p)return;const link=document.createElement('a');link.href=urlFor(p);link.className='btn secondary live-card-link';link.textContent='View project →';card.append(link)});route()};
 document.querySelector('#projectGrid').addEventListener('click',e=>{const a=e.target.closest('a.live-card-link');if(!a)return;e.preventDefault();e.stopImmediatePropagation();history.pushState({},'',a.href);route()},true);
 document.addEventListener('click',e=>{const a=e.target.closest('a.live-back');if(!a)return;e.preventDefault();history.pushState({},'',a.href);document.title='Tenzin | Engineering & Research';route();window.scrollTo(0,0)});
 window.addEventListener('popstate',()=>{if(!location.pathname.startsWith('/projects/'))document.title='Tenzin | Engineering & Research';route()});
 document.querySelectorAll('header a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{if(!document.body.classList.contains('project-route'))return;e.preventDefault();history.pushState({},'','/'+a.getAttribute('href'));route();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})}));
 render();
})();
