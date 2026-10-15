(()=>{
 const tabs=[...document.querySelectorAll('.cms-tab')],editor=document.getElementById('sectionEditor'),projects=document.getElementById('editorBody'),login=document.getElementById('cloudLogin');
 let active='homepage',allowed=false;
 function display(){
  tabs.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===active)));
  editor.style.display=allowed&&active!=='projects'?'block':'none';
  projects.style.display=allowed&&active==='projects'?'block':'none';
  document.querySelectorAll('.cms-group').forEach(g=>g.classList.toggle('active',g.dataset.section===active));
  document.getElementById('saveSections').style.display=active==='projects'?'none':'';
  login.classList.toggle('cms-logged-in',allowed);
  document.getElementById('sectionStatus').textContent='';
 }
 tabs.forEach(b=>b.addEventListener('click',()=>{active=b.dataset.tab;display();}));
 document.addEventListener('cms-auth',e=>{allowed=e.detail.allowed;display();});
 document.addEventListener('cms-fields-ready',display);
 display();
})();
