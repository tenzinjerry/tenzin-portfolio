import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
const $ = id => document.getElementById(id);
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  $('cloudStatus').textContent = 'Offline demonstration · Connect Supabase to enable secure cloud editing.';
} else {
  $('editorBody').classList.add('hidden');
  $('cloudLogin').style.display='block';
  $('cloudStatus').textContent='Connecting to the portfolio database…';
  try {
    const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
    let owner=false;
    async function refreshAuth(){
      const {data:{user}}=await db.auth.getUser();
      owner=!!user && (await db.from('portfolio_admins').select('user_id').eq('user_id',user.id).maybeSingle()).data?.user_id===user.id;
      $('editorBody').classList.toggle('hidden',!owner);
      $('loginBtn').classList.toggle('hidden',owner);
      $('logoutBtn').classList.toggle('hidden',!user);
      $('cloudStatus').textContent=owner?'Signed in as portfolio owner · Published edits are live.':user?'Signed in, but this account has no editing permission.':'Public viewing mode · Owner sign-in required to edit.';
    }
    async function load(){
      const {data,error}=await db.from('portfolio_projects').select('*').eq('published',true).order('sort_order',{ascending:true}).order('created_at',{ascending:false});
      if(error)throw error;
      projects=data.map(p=>({id:p.id,title:p.title,category:p.category,year:p.year,description:p.description,link:p.link,summary:p.summary,methods:p.methods,outcomes:p.outcomes,image_url:p.image_url,document_url:p.document_url}));render();
    }
    window.portfolioCloud={isOwner:()=>owner,save:async list=>{
      if(!owner)throw Error('Owner authentication required');
      const {data:{user}}=await db.auth.getUser();
      if(!user)throw Error('Session expired');
      const {data:existing,error:readError}=await db.from('portfolio_projects').select('id');if(readError)throw readError;
      const current=new Set(list.map(x=>x.id));
      const removed=existing.filter(x=>!current.has(x.id)).map(x=>x.id);
      if(removed.length){const {error}=await db.from('portfolio_projects').delete().in('id',removed);if(error)throw error;}
      for(const [i,p] of list.entries()){
        const record={title:p.title,category:p.category,year:p.year,description:p.description,link:p.link||null,sort_order:i,published:true,summary:p.summary||null,methods:p.methods||null,outcomes:p.outcomes||null,image_url:p.image_url||null,document_url:p.document_url||null};
        const isUuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.id);
        const query=isUuid?db.from('portfolio_projects').upsert({...record,id:p.id}):db.from('portfolio_projects').insert(record).select('id').single();
        const {data,error}=await query;if(error)throw error;
        if(!isUuid&&data)p.id=data.id;
      }
      await load();
      $('cloudStatus').textContent='Saved successfully · Live on the public site.';
    }};
    window.portfolioCloud.upload=async(file)=>{
      if(!owner)throw Error('Owner authentication required');
      if(!file)throw Error('Choose a file first');
      const allowed=['image/jpeg','image/png','image/webp','application/pdf'];
      if(!allowed.includes(file.type))throw Error('Only JPG, PNG, WebP or PDF files are allowed');
      if(file.size>8*1024*1024)throw Error('File exceeds the 8 MB limit');
      const ext=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','application/pdf':'pdf'})[file.type];
      const path=crypto.randomUUID()+'.'+ext;
      const {error}=await db.storage.from('portfolio-media').upload(path,file,{contentType:file.type,upsert:false});
      if(error)throw error;
      return db.storage.from('portfolio-media').getPublicUrl(path).data.publicUrl;
    };
    $('loginBtn').onclick=async()=>{const {error}=await db.auth.signInWithPassword({email:$('adminEmail').value.trim(),password:$('adminPassword').value});if(error){alert(error.message);return} $('adminPassword').value='';await refreshAuth();};
    $('logoutBtn').onclick=async()=>{await db.auth.signOut();await refreshAuth();};
    db.auth.onAuthStateChange(()=>setTimeout(refreshAuth,0));
    await load();await refreshAuth();
  } catch(e){$('cloudStatus').textContent='Database connection error: '+e.message;}
}
