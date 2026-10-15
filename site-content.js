import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
 try {
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
  const {data,error}=await db.from('portfolio_site_content').select('key,value');
  if(error) throw error;
  for(const item of data||[]){const node=[...document.querySelectorAll('[data-content-key]')].find(n=>n.dataset.contentKey===item.key);if(node)node.textContent=item.value;}
 }catch(e){console.warn('Site text unavailable; showing original published content.',e.message)}
}
