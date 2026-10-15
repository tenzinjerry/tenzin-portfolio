(()=>{
const byId=id=>document.getElementById(id);
const tabs=[...document.querySelectorAll('[data-project-section]')];
const panels=[...document.querySelectorAll('[data-project-panel]')];
const fields=['title','category','year','description','summary','methods','outcomes','imageUrl','documentUrl','link'];
const draftKey='tenzin_cms_project_draft_v8';
const status=byId('projectEditStatus');
function show(section){
 tabs.forEach(t=>{const active=t.dataset.projectSection===section;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active))});
 panels.forEach(p=>p.classList.toggle('active',p.dataset.projectPanel===section));
}
tabs.forEach(t=>t.addEventListener('click',()=>show(t.dataset.projectSection)));
show('overview');
byId('saveDraft').addEventListener('click',()=>{
 const data={editing:typeof editing==='undefined'?null:editing,fields:Object.fromEntries(fields.map(id=>[id,byId(id)?.value||'']))};
 try{localStorage.setItem(draftKey,JSON.stringify(data));status.textContent='Draft saved in this browser only. It is not published.'}
 catch{status.textContent='Could not save draft locally.'}
});
const restore=()=>{
 try{
 const data=JSON.parse(localStorage.getItem(draftKey)||'null');
 if(!data)return;
 if(!confirm('Restore the unsent project draft saved in this browser?'))return;
 if(data.editing&&typeof projects!=='undefined'&&!projects.some(p=>p.id===data.editing)){status.textContent='Draft refers to a missing project; not restored.';return}
 editing=data.editing||null;
 fields.forEach(id=>{if(byId(id)&&Object.hasOwn(data.fields,id))byId(id).value=data.fields[id]});
 byId('save').textContent=editing?'Update entry':'Publish project';
 status.textContent='Local draft restored. Review before publishing.';
 show('overview');
 }catch{status.textContent='Saved draft could not be read.'}
};
const restoreButton=document.createElement('button');
restoreButton.type='button';restoreButton.className='secondary';restoreButton.textContent='Restore draft';
restoreButton.addEventListener('click',restore);
byId('saveDraft').after(restoreButton);
byId('entries').addEventListener('click',e=>{
 if(e.target.closest('[data-edit]')){show('overview');status.textContent='Project loaded for editing. Review all sections before publishing.'}
 if(e.target.closest('[data-delete]'))status.textContent='Review the confirmation carefully before deleting a project.';
});
byId('resetForm').addEventListener('click',()=>{show('overview');status.textContent='Editing cancelled. Published content was not changed.'});
byId('save').addEventListener('click',()=>{status.textContent='Publish requested. Check the live project page to confirm the update.';},false);
})();