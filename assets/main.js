'use strict';

/* Navigation and mobile menu */
const menuToggle=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Open navigation');
  menuToggle.textContent='☰';
}
menuToggle.addEventListener('click',()=> {
  const open=menuToggle.getAttribute('aria-expanded')!=='true';
  navigation.classList.toggle('open',open);
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  menuToggle.textContent=open?'×':'☰';
});
navigation.querySelectorAll('a,button').forEach(item=>item.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=> {
  if(event.key==='Escape'&&navigation.classList.contains('open')) {
    closeMenu();
    menuToggle.focus();
  }
});

/* Illustrative workflow demos */
const demos= {
  inbox: {
    title:'INBOX ASSISTANT',sender:'New customer inquiry',question:'“Hi! Do you offer garden maintenance for small courtyards? I’d love to find out a bit more.”',label:'DRAFT REPLY · READY FOR REVIEW',text:'Thanks for getting in touch! Could you share your location and a little about your courtyard? Our team can then confirm whether we’re a good fit and talk through the next steps.',note:'Your voice. Your approval. Nothing auto-sent.',feedback:'Review complete in this demo. In a live workflow, you would edit or approve the draft before sending.'
  },leads: {
    title:'LEAD ORGANIZER',sender:'New website inquiry',question:'“We’re opening a small café next month and need help with our shopfront signage. Can we talk about options?”',label:'ORGANIZED LEAD · READY FOR YOUR TEAM',text:'Request: shopfront signage for a new café. Timing: opening next month. Next step: confirm the location, dimensions, and design needs before preparing a quote.',note:'Useful context, without an invented quote or promise.',feedback:'Lead reviewed in this demo. A live workflow could route it to your team after you confirm the next step.'
  },bookings: {
    title:'BOOKING ASSISTANT',sender:'Appointment request',question:'“Could I book a consultation sometime next week? Afternoons are usually best for me.”',label:'NEXT-STEP DRAFT · NO BOOKING MADE',text:'Happy to help arrange a consultation. What day works best for you, and what would you like to discuss? We’ll check availability and confirm a time with you.',note:'No calendar connected. No appointment confirmed.',feedback:'Request reviewed in this demo. A real booking would require verified availability and your agreed approval rules.'
  }
};
const tabMedia=window.matchMedia('(max-width:720px)');
function syncTabOrientation() {
  document.querySelector('.demo-tabs').setAttribute('aria-orientation',tabMedia.matches?'horizontal':'vertical');
}
syncTabOrientation();
tabMedia.addEventListener('change',syncTabOrientation);
let activeDemo='inbox';
const tabs=Array.from(document.querySelectorAll('[data-demo]'));
function selectDemo(key) {
  activeDemo=key;
  const d=demos[key];
  tabs.forEach(tab=> {
    const selected=tab.dataset.demo===key;
    tab.setAttribute('aria-selected',String(selected));
    tab.tabIndex=selected?0:-1;
  });
  document.querySelector('#workflow-panel').setAttribute('aria-labelledby','tab-'+key);
  ['title','sender','question','note'].forEach(part=>document.querySelector('#demo-'+part).textContent=d[part]);
  document.querySelector('#draft-label').textContent=d.label;
  document.querySelector('#draft-text').textContent=d.text;
  document.querySelector('#demo-feedback').textContent='';
  document.querySelector('#demo-review').textContent='Try the review step';
}
tabs.forEach((tab,index)=> {
  tab.addEventListener('click',()=>selectDemo(tab.dataset.demo));
  tab.addEventListener('keydown',event=> {
    let next;
    if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();
    tabs[next].focus();
    selectDemo(tabs[next].dataset.demo);
  });
});
document.querySelector('#demo-review').addEventListener('click',()=> {
  document.querySelector('#demo-feedback').textContent=demos[activeDemo].feedback;
  document.querySelector('#demo-review').textContent='Reviewed ✓';
});

/* Local-only project brief planner */
const dialog=document.querySelector('#brief-modal');
let opener;
document.querySelectorAll('[data-brief]').forEach(button=>button.addEventListener('click',()=> {
  opener=button;
  if(button.dataset.service&&document.querySelector('#brief-service').value!==button.dataset.service) {
    document.querySelector('#brief-service').value=button.dataset.service;
    invalidateBrief();
  }
  dialog.showModal();
  document.body.style.overflow='hidden';
}));
document.querySelector('.close-modal').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=> {
  if(event.target===dialog) {
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  }
});
dialog.addEventListener('close',()=> {
  document.body.style.overflow='';
  if(opener) {
    if(opener.getClientRects().length)opener.focus();
    else menuToggle.focus();
  }
});
const briefOutput=document.querySelector('#brief-output');
const briefStatus=document.querySelector('#brief-status');
document.querySelector('#brief-form').addEventListener('submit',event=> {
  event.preventDefault();
  const service=document.querySelector('#brief-service');
  const business=document.querySelector('#brief-business').value.trim();
  const goals=document.querySelector('#brief-goals').value.trim();
  const businessField=document.querySelector('#brief-business');
  const goalsField=document.querySelector('#brief-goals');
  businessField.setCustomValidity(business?'':'Please tell us what kind of business you run.');
  goalsField.setCustomValidity(goals.length>=10?'':'Please describe your goal in at least 10 characters.');
  if(!business) {
    businessField.reportValidity();
    return;
  }
  if(goals.length<10) {
    goalsField.reportValidity();
    return;
  }
  document.querySelector('#brief-stale').hidden=true;
  const context=document.querySelector('#brief-context').value.trim();
  briefOutput.value=['ROOK — PROJECT BRIEF','','Project: '+service.options[service.selectedIndex].text,'Business: '+business,'','What I’d like to improve:',goals,...(context?['','Additional context:',context]:[]),'','Created with the Rook local project planner. This brief has not been sent.'].join('\n');
  document.querySelector('#brief-result').hidden=false;
  briefStatus.textContent='Your brief is ready. Nothing has been sent.';
  document.querySelector('#brief-result').scrollIntoView( {
    behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'
  });
});
function invalidateBrief() {
  if(!document.querySelector('#brief-result').hidden) {
    document.querySelector('#brief-result').hidden=true;
    document.querySelector('#brief-stale').hidden=false;
    briefOutput.value='';
    briefStatus.textContent='';
  }
}
document.querySelector('#brief-form').addEventListener('input',event=> {
  if(event.target.setCustomValidity)event.target.setCustomValidity('');
  invalidateBrief();
});
document.querySelector('#brief-form').addEventListener('change',invalidateBrief);
document.querySelector('#copy-brief').addEventListener('click',async()=> {
  try {
    await navigator.clipboard.writeText(briefOutput.value);
    briefStatus.textContent='Copied. Your brief is ready to share when Rook’s contact channel is available.';
  }
  catch {
    briefOutput.focus();
    briefOutput.select();
    briefStatus.textContent='Select and copy the highlighted brief using your browser’s copy command.';
  }
});
document.querySelector('#download-brief').addEventListener('click',()=> {
  const blob=new Blob([briefOutput.value], {
    type:'text/plain;charset=utf-8'
  });
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download='rook-project-brief.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  briefStatus.textContent='Download started. Your brief has not been sent to Rook.';
});

/* Business-specific starting points */
const industryIdeas= {
  trades: {
    title:'FROM FIRST INQUIRY TO THE NEXT JOB',copy:'A clear service-area website, plus a workflow that gathers job details and prepares inquiry replies for your review.',boundary:'You confirm availability, pricing, and which jobs to take.'
  },retail: {
    title:'A THOUGHTFUL SHOPFRONT, ONLINE TOO',copy:'A distinctive website for your shop, plus draft answers to product, opening-hours, and collection questions using information you approve.',boundary:'Your team verifies stock and order details before making promises.'
  },hospitality: {
    title:'LESS BACK-AND-FORTH, MORE HOSPITALITY',copy:'An easy-to-explore menu and venue website, plus a workflow that organizes private-event inquiries and prepares follow-up questions.',boundary:'Your team confirms availability, dietary information, and final arrangements.'
  },studios: {
    title:'MAKE THE FIRST CONVERSATION COUNT',copy:'A clear home for your services and work, plus an intake workflow that organizes new inquiries and prepares a consultation summary.',boundary:'You decide project fit, scope, scheduling, and the advice you give.'
  }
};
document.querySelector('#industry-select').addEventListener('change',event=> {
  const idea=industryIdeas[event.target.value];
  ['title','copy','boundary'].forEach(part=>document.querySelector('#industry-'+part).textContent=idea[part]);
});

/* Transparent time-savings assumptions */
function updateEstimate() {
  const tasksInput=document.querySelector('#estimate-tasks');
  const minutesInput=document.querySelector('#estimate-minutes');
  const output=document.querySelector('#estimate-output');
  const formula=document.querySelector('#estimate-formula');
  const caption=document.querySelector('#estimate-caption');
  if(tasksInput.value===''||minutesInput.value===''||!tasksInput.validity.valid||!minutesInput.validity.valid) {
    output.textContent='—';
    caption.textContent='enter valid assumptions';
    formula.textContent='Use 0–10,000 whole tasks and 0–1,440 minutes in half-minute steps.';
    return;
  }
  const tasks=Number(tasksInput.value),minutes=Number(minutesInput.value);
  const total=tasks*minutes;
  const hours=Math.floor(total/60);
  const remainder=Math.round((total-hours*60)*10)/10;
  output.textContent=hours?(hours.toLocaleString()+'h'+(remainder?' '+remainder+'m':'')):remainder+'m';
  caption.textContent='potentially freed up each week';
  formula.textContent=tasks.toLocaleString()+' tasks × '+minutes.toLocaleString()+' minutes = '+total.toLocaleString()+' minutes per week.';
}
['estimate-tasks','estimate-minutes'].forEach(id=>document.getElementById(id).addEventListener('input',updateEstimate));
document.querySelector('#year').textContent=new Date().getFullYear();
