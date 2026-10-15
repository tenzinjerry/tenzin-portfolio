import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
const fields=document.getElementById('sectionFields'),panel=document.getElementById('sectionEditor'),status=document.getElementById('sectionStatus');
const editable=[...document.querySelectorAll('[data-content-key]')];
const names={hero_title:'Homepage headline',hero_intro:'Homepage introduction',research_title:'Research heading',research_description:'Research description',experience_role:'RICBL job title',contact_title:'Contact heading',contact_intro:'Contact introduction'};
const sectionOf=k=>k.startsWith('hero_')||k.startsWith('focus_')?'homepage':k.startsWith('research_')?'research':k.startsWith('experience_')?'experience':k.startsWith('education_')?'education':k.startsWith('contact_')?'contact':'homepage';
const sections=['homepage','research','experience','education','contact'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db;
async function update(){
 if(!db)return;
 const {data:{user}}=await db.auth.getUser();let allowed=false;
 if(user){const {data}=await db.from('portfolio_admins').select('user_id').eq('user_id',user.id).maybeSingle();allowed=!!data;}
 panel.style.display=allowed?'block':'none';document.dispatchEvent(new CustomEvent('cms-auth',{detail:{allowed}}));
 if(!allowed)return;
 const {data,error}=await db.from('portfolio_site_content').select('key,value');
 if(error){status.textContent='Content could not load: '+error.message;return;}
 const saved=new Map((data||[]).map(x=>[x.key,x.value]));
 fields.innerHTML=sections.map(section=>`<div class="cms-group" data-section="${section}"><h3>${section[0].toUpperCase()+section.slice(1)}</h3><p class="cms-help">Edit these fields, then select Publish changes.</p>${editable.filter(n=>sectionOf(n.dataset.contentKey)===section).map(n=>{const key=n.dataset.contentKey,label=names[key]||key.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()),val=saved.get(key)??n.textContent.trim();return `<label for="field-${esc(key)}">${esc(label)}</label><textarea id="field-${esc(key)}" data-edit-field="${esc(key)}" rows="3">${esc(val)}</textarea>`}).join('')}</div>`).join('');
 status.textContent='Ready to edit. Select Publish changes when finished.';document.dispatchEvent(new Event('cms-fields-ready'));
}
if(SUPABASE_URL&&SUPABASE_ANON_KEY){
 try{
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
  db.auth.onAuthStateChange(()=>setTimeout(update,100));
  document.getElementById('saveSections').onclick=async()=>{
   const button=document.getElementById('saveSections');button.disabled=true;status.textContent='Publishing…';
   try{const group=document.querySelector('.cms-group.active');if(!group)throw Error('Choose a content section');
    const values=[...group.querySelectorAll('[data-edit-field]')].map(n=>({key:n.dataset.editField,value:n.value.trim()}));
    const {error}=await db.from('portfolio_site_content').upsert(values,{onConflict:'key'});if(error)throw error;
    status.textContent='Published successfully. Refresh the public portfolio to see changes.';
   }catch(e){status.textContent='Could not publish: '+e.message;}finally{button.disabled=false;}
  };await update();
 }catch(e){status.textContent='Content editor unavailable: '+e.message;}
}
