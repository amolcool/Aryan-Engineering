(()=>{const section=document.querySelector('.biofuel');if(!section)return;const content=[['START WITH YOUR FEEDSTOCK','There’s potential in the leftovers.','Wood, agricultural residues, cashew shells and processed wet garbage are all potential fuel inputs. Suitability depends on moisture, size, composition and the preparation required for your selected pellet machine.','Explore pellet machines ↗','pellet machine'],['MAKE FUEL EASIER TO HANDLE','Small form. Useful energy.','Pellet machines densify prepared biomass into compact fuel. Pellet quality, dimensions and moisture must suit the burner and feeding system you plan to use.','Explore pellet machines ↗','pellet machine'],['PUT COMBUSTION TO WORK','A controlled flame. A productive plant.','A pellet burner converts suitable fuel into heat for compatible process equipment. Fuel selection, combustion control and system sizing determine performance.','Explore pellet burners ↗','pellet burner']];let stage=0;function select(i){stage=i;document.querySelectorAll('[data-bio]').forEach(b=>{b.classList.toggle('selected',Number(b.dataset.bio)===i);b.setAttribute('aria-pressed',String(Number(b.dataset.bio)===i));});document.querySelector('.bio-stage').dataset.stage=i;['bioTag','bioTitle','bioDescription','bioExplore'].forEach((id,n)=>document.getElementById(id).textContent=content[i][n]);document.getElementById('bioIndex').textContent=String(i+1).padStart(2,'0');}document.querySelectorAll('[data-bio]').forEach(b=>b.onclick=()=>select(Number(b.dataset.bio)));function find(category,query){document.getElementById('machineSearch').value=query||'';document.querySelector('[data-filter="'+category+'"]').click();location.hash='products';}document.getElementById('bioExplore').onclick=e=>{e.preventDefault();find('green',content[stage][4]);};document.querySelectorAll('[data-application]').forEach(b=>b.onclick=()=>find(b.dataset.application,''));const motion=document.getElementById('bioMotion');motion.onclick=()=>{const paused=section.classList.toggle('bio-paused');motion.textContent=paused?'▶ Resume motion':'Ⅱ Pause motion';motion.setAttribute('aria-pressed',String(paused));};if(matchMedia('(prefers-reduced-motion: reduce)').matches){motion.hidden=true;section.classList.add('bio-paused');}
/* Scroll-driven story: stages advance as the diagram moves through the viewport.
   A manual tap wins for 5s; disabled with reduced motion / pause. */
const stageEl=document.querySelector('.bio-stage');let tappedAt=0;
document.querySelectorAll('[data-bio]').forEach(b=>b.addEventListener('click',()=>{tappedAt=Date.now();}));
function scrub(){
  if(section.classList.contains('bio-paused')||Date.now()-tappedAt<5000)return;
  const r=stageEl.getBoundingClientRect();
  const prog=(innerHeight*.7-r.top)/(r.height+innerHeight*.2);
  if(prog<0||prog>1.35)return;
  const s=prog<.38?0:prog<.72?1:2;
  if(s!==stage)select(s);
}
addEventListener('scroll',scrub,{passive:true});
select(0);})();
