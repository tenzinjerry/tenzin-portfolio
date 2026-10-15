import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
const fields=document.getElementById('sectionFields'),panel=document.getElementById('sectionEditor'),status=document.getElementById('sectionStatus');
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const editable=[...document.querySelectorAll('[data-content-key]')];
const names={hero_title:'Homepage headline',hero_intro:'Homepage introduction',research_title:'Research heading',research_description:'Research description',experience_role:'RICBL job title',contact_title:'Contact heading',contact_intro:'Contact introduction'};
if(SUPABASE_URL&&SUPABASE_ANON_KEY){
 try{
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
  const {data:{subscription}}=db.auth.onAuthStateChange(()=>setTimeout(update,50));
  async function update(){
   const {data:{user}}=await db.auth.getUser();
   let allowed=false;
   if(user){const {data}=await db.from('portfolio_admins').select('user_id').eq('user_id',user.id).maybeSingle();allowed=!!data;}
   panel.style.display=allowed?'block':'none';if(!allowed)return;
   const {data,error}=await db.from('portfolio_site_content').select('key,value');
   if(error){status.textContent='Database setup required: '+error.message;return;}
   const saved=new Map((data||[]).map(x=>[x.key,x.value]));
   fields.innerHTML=editable.map(n=>{const key=n.dataset.contentKey;const label=names[key]||key.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());const val=saved.get(key)??n.textContent.trim();return `<label for="field-${escapeHTML(key)}">${escapeHTML(label)}</label><textarea id="field-${escapeHTML(key)}" data-edit-field="${escapeHTML(key)}" rows="3">${escapeHTML(val)}</textarea>`}).join('');
   status.textContent='Ready to edit. Changes appear publicly after publishing.';
  }
  document.getElementById('saveSections').onclick=async()=>{
   const button=document.getElementById('saveSections');button.disabled=true;status.textContent='Publishing…';
   try{
    const values=[...fields.querySelectorAll('[data-edit-field]')].map(n=>({key:n.dataset.editField,value:n.value.trim()}));
    const {error}=await db.from('portfolio_site_content').upsert(values,{onConflict:'key'});if(error)throw error;
    status.textContent='Published successfully. Refresh the public portfolio to see changes.';
   }catch(e){status.textContent='Could not publish: '+e.message;}finally{button.disabled=false;}
  };
  await update();
 }catch(e){status.textContent='Content editor unavailable: '+e.message;}
}
