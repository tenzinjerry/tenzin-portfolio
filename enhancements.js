// Portfolio V2: rich project details, concise cards, optional uploads.
(function(){
 const get=id=>document.getElementById(id);
 const escapeHtml=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const validUrl=s=>typeof s==='string'&&/^https:\/\//i.test(s);
 const oldRender=render;
 render=function(){
   oldRender();
   const cards=get('projectGrid').querySelectorAll('article');
   const shown=projects.filter(p=>filter==='All'||p.category===filter);
   cards.forEach((card,i)=>{
     const p=shown[i];if(!p)return;
     card.classList.add('project-card');
     const paragraph=card.querySelector('p');
     if(paragraph)paragraph.textContent=p.summary||p.description;
     if(validUrl(p.image_url)){
       const img=document.createElement('img');img.className='project-image';img.src=p.image_url;img.alt='Project illustration for '+p.title;img.loading='lazy';img.onerror=()=>img.remove();
       card.insertBefore(img,card.firstChild);
     }
     const btn=document.createElement('button');btn.type='button';btn.className='secondary project-open';btn.textContent='View project →';btn.dataset.projectId=p.id;card.append(btn);
   });
 };
 function openProject(p){
   if(!p)return;
   const pieces=[`<div class="eyebrow">${escapeHtml(p.category)} · ${escapeHtml(p.year)}</div>`,`<h2 id="detailTitle">${escapeHtml(p.title)}</h2>`];
   if(validUrl(p.image_url))pieces.push(`<img class="detail-hero" src="${escapeHtml(p.image_url)}" alt="Project illustration" onerror="this.remove()">`);
   pieces.push(`<h3>Overview</h3><p class="detail-section">${escapeHtml(p.description)}</p>`);
   if(p.methods)pieces.push(`<h3>Methods & responsibilities</h3><p class="detail-section">${escapeHtml(p.methods)}</p>`);
   if(p.outcomes)pieces.push(`<h3>Results & deliverables</h3><p class="detail-section">${escapeHtml(p.outcomes)}</p>`);
   if(validUrl(p.document_url))pieces.push(`<p><a target="_blank" rel="noopener noreferrer" href="${escapeHtml(p.document_url)}">View supporting document ↗</a></p>`);
   if(validUrl(p.link))pieces.push(`<p><a target="_blank" rel="noopener noreferrer" href="${escapeHtml(p.link)}">View external resource ↗</a></p>`);
   get('detailContent').innerHTML=pieces.join('');
   get('detailOverlay').classList.add('show');get('detailOverlay').setAttribute('aria-hidden','false');document.body.classList.add('modal-open');get('detailClose').focus();
 }
 function closeProject(){get('detailOverlay').classList.remove('show');get('detailOverlay').setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');}
 get('projectGrid').addEventListener('click',e=>{const btn=e.target.closest('[data-project-id]');if(btn)openProject(projects.find(p=>String(p.id)===btn.dataset.projectId));});
 get('detailClose').onclick=closeProject;
 get('detailOverlay').addEventListener('click',e=>{if(e.target===get('detailOverlay'))closeProject();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProject();});
 const extra=['summary','methods','outcomes','image_url','document_url'];
 const inputIds={summary:'summary',methods:'methods',outcomes:'outcomes',image_url:'imageUrl',document_url:'documentUrl'};
 const originalPersist=persist;
 persist=function(){originalPersist();};
 // Existing save/edit handlers run first. Read extra fields before the original save handler and preserve them on the matching record.
 // Replace original save handler to include extra fields and preserve cloud behaviour.
 get('save').onclick=()=>{
   const title=get('title').value.trim(),description=get('description').value.trim();
   if(!title||!description){alert('Please enter a title and description.');return;}
   for(const id of ['link','imageUrl','documentUrl']){const v=get(id).value.trim();if(v&&!validUrl(v)){alert('Use a valid https:// URL for '+id);return;}}
   const p={id:editing||('p'+Date.now()),title,category:get('category').value,year:get('year').value.trim(),description,link:get('link').value.trim()};
   extra.forEach(k=>p[k]=get(inputIds[k]).value.trim());
   if(editing)projects=projects.map(x=>x.id===editing?p:x);else projects.unshift(p);
   persist();clear();extra.forEach(k=>get(inputIds[k]).value='');get('uploadAsset').value='';get('uploadStatus').textContent='';render();
 };
 get('entries').addEventListener('click',e=>{
   const btn=e.target.closest('[data-edit]');if(!btn)return;
   const p=projects.find(x=>String(x.id)===btn.dataset.edit);if(!p)return;
   extra.forEach(k=>get(inputIds[k]).value=p[k]||'');
 });
 get('resetForm').addEventListener('click',()=>{extra.forEach(k=>get(inputIds[k]).value='');get('uploadAsset').value='';get('uploadStatus').textContent='';});
 get('uploadAssetBtn').onclick=async()=>{
   const file=get('uploadAsset').files[0],status=get('uploadStatus');
   if(!window.portfolioCloud?.upload){status.textContent='Cloud uploads unavailable. Check your Supabase connection.';return;}
   const btn=get('uploadAssetBtn');btn.disabled=true;status.textContent='Uploading…';
   try{const url=await window.portfolioCloud.upload(file);get(file.type==='application/pdf'?'documentUrl':'imageUrl').value=url;status.textContent='Upload complete. Click Save entry to publish this URL.';}
   catch(err){status.textContent='Upload failed: '+err.message;}finally{btn.disabled=false;}
 };
 render();
})();