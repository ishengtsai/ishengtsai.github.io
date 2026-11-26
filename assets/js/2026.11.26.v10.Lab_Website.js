
const nav=document.querySelector('#navigation'),toggle=document.querySelector('.menu-toggle'),items=[...document.querySelectorAll('.nav-item')];
function setOpen(item,open){item.classList.toggle('is-open',open);item.querySelector('.submenu-toggle').setAttribute('aria-expanded',String(open));}
function closeAll(except){items.forEach(i=>{if(i!==except)setOpen(i,false)});}
function closeMobile(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu';}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close':'Menu';nav.classList.toggle('open',open);if(!open)closeAll();});
items.forEach(item=>{
 const button=item.querySelector('.submenu-toggle');
 item.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:951px)').matches){closeAll(item);setOpen(item,true)}});
 item.addEventListener('pointerleave',()=>{if(!item.contains(document.activeElement))setOpen(item,false)});
 item.addEventListener('focusin',e=>{if(e.target!==button&&matchMedia('(min-width:951px)').matches){closeAll(item);setOpen(item,true)}});
 item.addEventListener('focusout',e=>{if(!item.contains(e.relatedTarget))setOpen(item,false)});
 button.addEventListener('click',()=>{const open=!item.classList.contains('is-open');closeAll(item);setOpen(item,open)});
 item.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();button.focus();setOpen(item,false)}else if(e.key==='ArrowDown'&&e.target.closest('.nav-parent,.submenu-toggle')){e.preventDefault();closeAll(item);setOpen(item,true);item.querySelector('.submenu a').focus()}});
});
nav.addEventListener('click',e=>{if(e.target.closest('a')){closeAll();closeMobile()}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeAll()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAll();closeMobile()}});

function openLinkedArchive(){const id=decodeURIComponent(location.hash.slice(1));const el=document.getElementById(id);if(el&&el.tagName==='DETAILS')el.open=true;}window.addEventListener('hashchange',openLinkedArchive);openLinkedArchive();
// Independent hyphae and budding yeast motifs. This is an illustration, not recorded microscopy.
(()=>{
 const mode='both';
 const hero=document.querySelector('main>.hero');if(!hero)return;
 const stage=document.createElement('div');stage.className='living-stage';hero.before(stage);stage.append(hero);
 const canvas=document.createElement('canvas');canvas.className='living-canvas';canvas.setAttribute('aria-hidden','true');stage.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx)return;
 const pause=document.createElement('button');pause.type='button';pause.className='motion-pause';stage.append(pause);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=true,raf=0,clock=0,last=0,width=0,height=0,paths=[],cells=[],frames=0;
 function rng(seed){return()=>{seed=(Math.imul(1664525,seed)+1013904223)|0;return(seed>>>0)/4294967296}}
 function smooth(a,b,t){const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x)}
 function buildGeometry(){
  paths=[];cells=[];const random=rng(87521),mobile=width<700;
  function path(x,y,angle,count,step,born,duration,depth){
   const pts=[{x,y}];for(let i=1;i<count;i++){angle+=(random()-.5)*.26;const pull=x<width*.5?0:Math.PI;if(depth===0)angle+=Math.sin(pull-angle)*.012;x+=Math.cos(angle)*step;y+=Math.sin(angle)*step;pts.push({x,y})}
   const result={pts,born,duration,weight:depth?1.05:1.6};paths.push(result);
   if(depth<1){for(const fraction of [.32,.64]){const i=Math.floor(fraction*(pts.length-2)),a=pts[i],b=pts[i+1],branchAngle=Math.atan2(b.y-a.y,b.x-a.x)+(random()>.5?1:-1)*(.48+random()*.36);path(a.x,a.y,branchAngle,Math.floor(count*.55),step*.9,born+fraction*duration,duration*.7,depth+1)}}
  }
  const rootY=mobile?[.03,.36,.68,.98]:[.04,.42,.82,.98];
  rootY.forEach((y,i)=>{path(-8,height*y,(i%2?.18:-.12),78,Math.min(width*.004,4.4),i*2,29,0);path(width+8,height*(1-y*.92),Math.PI+(i%2?.22:-.18),78,Math.min(width*.004,4.4),i*2+1,31,0)});
  const placements=mobile?[[.09,.035],[.9,.17],[.08,.36],[.94,.55],[.08,.74],[.15,.95],[.42,.96],[.73,.95],[.93,.91]]:[[.035,.17],[.045,.60],[.97,.25],[.96,.69],[.17,.84],[.27,.88],[.39,.80],[.49,.40],[.51,.77],[.67,.91],[.83,.90],[.06,.94],[.94,.94],[.30,.035],[.71,.035]];
  placements.forEach(([nx,ny],i)=>cells.push({x:nx*width,y:ny*height,r:(mobile?9:13)+random()*7,angle:random()*Math.PI*2,budAngle:random()*Math.PI*2,phase:random(),period:18+random()*15,elongation:1.15+random()*.25}));
 }
 function resize(){const box=stage.getBoundingClientRect();width=box.width;height=box.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);buildGeometry();draw()}
 function trace(path,time){const progress=Math.max(0,Math.min(1,(time-path.born)/path.duration));if(!progress)return;const n=(path.pts.length-1)*progress,whole=Math.floor(n);ctx.lineWidth=path.weight;ctx.beginPath();ctx.moveTo(path.pts[0].x,path.pts[0].y);for(let i=1;i<=whole;i++)ctx.lineTo(path.pts[i].x,path.pts[i].y);if(whole<path.pts.length-1){const a=path.pts[whole],b=path.pts[whole+1],f=n-whole;ctx.lineTo(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f)}ctx.stroke()}
 function cell(c,time){
  const phase=(time/c.period+c.phase)%1;const bud=smooth(.08,.64,phase),separation=smooth(.68,.96,phase),fade=1-smooth(.94,1,phase);const breathing=1+.012*Math.sin(time*.7+c.phase*6);
  ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle);ctx.lineWidth=1.65;ctx.globalAlpha=.55;ctx.beginPath();ctx.ellipse(0,0,c.r*breathing,c.r*c.elongation*breathing,0,0,Math.PI*2);ctx.stroke();
  // A second faint wall contour gives the ovoid cell a soft microscopy-like outline.
  ctx.globalAlpha=.15;ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,0,c.r-2,c.r*c.elongation-2,0,0,Math.PI*2);ctx.stroke();
  if(bud>.02){const r=c.r*(.14+.56*bud),angle=c.budAngle,dist=c.r*.93+r*.72+separation*c.r*.72;const bx=Math.cos(angle)*dist,by=Math.sin(angle)*dist*c.elongation;ctx.globalAlpha=.55*fade;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(bx,by,r,r*1.18,angle,0,Math.PI*2);ctx.stroke();if(separation<.15){ctx.globalAlpha=.30*fade;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(Math.cos(angle)*c.r*.85,Math.sin(angle)*c.r*c.elongation*.85);ctx.lineTo(bx-Math.cos(angle)*r*.7,by-Math.sin(angle)*r*.7);ctx.stroke()}}
  ctx.restore();
 }
 function draw(){if(!width||!height)return;ctx.clearRect(0,0,width,height);ctx.strokeStyle=getComputedStyle(stage).color;ctx.lineCap='round';ctx.lineJoin='round';if(mode==='both'||mode==='hyphae'){const t=(clock+19)%76;ctx.globalAlpha=.42*(1-smooth(67,76,t));paths.forEach(p=>trace(p,t))}if(mode==='both'||mode==='yeast')cells.forEach(c=>cell(c,clock));ctx.globalAlpha=1;canvas.dataset.renderCount=String(++frames)}
 function frame(now){raf=0;if(paused||!visible||document.hidden||mode==='off'){last=0;return}if(!last)last=now;if(now-last>=32){clock+=Math.min((now-last)/1000,.1)*4.875;last=now;draw()}raf=requestAnimationFrame(frame)}
 function refresh(){pause.textContent=paused?'Play animation · 播放動畫':'Pause animation · 暫停動畫';pause.setAttribute('aria-pressed',String(paused));pause.disabled=mode==='off';if(raf){cancelAnimationFrame(raf);raf=0}last=0;draw();if(!paused&&visible&&!document.hidden&&mode!=='off')raf=requestAnimationFrame(frame)}
 pause.addEventListener('click',()=>{paused=!paused;refresh()});
 reduced.addEventListener('change',e=>{paused=e.matches;refresh()});document.addEventListener('visibilitychange',refresh);
 new ResizeObserver(resize).observe(stage);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh()},{rootMargin:'100px'}).observe(stage);resize();refresh();
})();

// Native horizontal scrolling also works without JavaScript.
document.querySelectorAll('.lab-gallery').forEach(gallery=>{
 const track=gallery.querySelector('.gallery-track'),slides=[...track.children];
 const previous=gallery.querySelector('.gallery-previous'),next=gallery.querySelector('.gallery-next'),counter=gallery.querySelector('.gallery-counter');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,frame=0;
 const sync=()=>{index=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/track.clientWidth)));previous.disabled=index===0;next.disabled=index===slides.length-1;const label=`${index+1} / ${slides.length}`;if(counter.textContent!==label)counter.textContent=label;};
 const go=target=>track.scrollTo({left:Math.max(0,Math.min(slides.length-1,target))*track.clientWidth,behavior:reduced.matches?'auto':'smooth'});
 previous.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
 track.addEventListener('keydown',event=>{const targets={ArrowLeft:index-1,ArrowRight:index+1,Home:0,End:slides.length-1};if(event.key in targets){event.preventDefault();go(targets[event.key]);}});
 track.addEventListener('scroll',()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;sync();});},{passive:true});
 new ResizeObserver(()=>{track.scrollTo({left:index*track.clientWidth,behavior:'auto'});sync();}).observe(track);
 gallery.querySelector('.gallery-controls').hidden=false;sync();
});
