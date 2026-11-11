/* ============================================================================
   THE HUMAN ARCHIVE — CHAPTER THREE: MARS
   Four independently designed records, matching Belge 1 and Belge 2:
   04 Sojourner (Template A), 05 Spirit (Template A),
   06 Opportunity (Template B + 5-second SIGNAL LOST),
   07 Ingenuity (Template B + 1–72 flight slider).
   ============================================================================ */
(() => {
  'use strict';
  const $ = (tag, cls, txt) => { const n=document.createElement(tag); if(cls)n.className=cls; if(txt!==undefined)n.textContent=String(txt); return n; };
  const btn = (txt, cls, fn) => { const n=$('button',cls,txt); n.type='button'; n.addEventListener('click',fn); return n; };
  const IMG='assets/images/';
  const AUDIO='assets/audio/';
  const SOURCE = {
    sojourner:'https://www.jpl.nasa.gov/missions/mars-pathfinder-sojourner-rover/',
    spirit:'https://science.nasa.gov/mission/mer-spirit/',
    opportunity:'https://science.nasa.gov/mission/mer-opportunity/',
    ingenuity:'https://www.jpl.nasa.gov/videos/see-ingenuitys-flight-map-72-helicopter-flights-on-mars/'
  };
  const DATA = [
    {
      id:'sojourner', number:4, step:1, title:'SOJOURNER', eyebrow:'THE FIRST TO ROAM', subtitle:'A microwave-sized rover. The first steps of surface mobility.', location:'ARES VALLIS',
      images:[
        {src:'sojourner-rover-mars-surface.webp',alt:'Sojourner rover on the Martian surface',credit:'NASA / JPL',url:'https://images.nasa.gov/details/PIA01122'},
        {src:'sojourner-and-yogi.webp',alt:'Sojourner rover examining the Yogi rock on Mars',credit:'NASA / JPL',url:'https://images.nasa.gov/details/PIA00766'}
      ],
      traces:[
        'One of the first successful rovers to travel across Mars.',
        'Part of the Mars Pathfinder mission.',
        'Operated for 83 sols.'
      ],
      what:'A small, six-wheeled robotic rover — humanity’s first successful wheeled vehicle to explore the surface of Mars.',
      purpose:'It tested rover mobility and science operations on another planet, and examined nearby rocks and soil.',
      fate:'It was designed for a short 7-day mission, but operated for 83 sols before communication ended.',
      why:'Sojourner proved that a mobile robot could travel across Mars and investigate its surface at close range.',
      mission:'Mars Pathfinder', arrival:'July 4, 1997', operation:'83 sols', size:'30 cm (1 foot)', weight:'10.6 kg (23 pounds)', distance:'About 100 metres', planned:'7 days',
      storyLead:'It was one of the first rovers to move across the Martian surface. Despite its small size, it was traveling across the surface of an entirely new world.',
      story:'Humanity’s tiny, trailblazing Mars rover — only the size of a microwave oven. It was engineered to last just 7 days, but explored for 83 sols (Martian days) and travelled about 100 metres before falling silent.'
    },
    {
      id:'spirit', number:5, step:2, title:'SPIRIT', eyebrow:'SIX YEARS', subtitle:'A robotic geologist. One wheel caught in the sands of Mars.', location:'GUSEV CRATER',
      images:[
        {src:'spirit-rover-gusev-crater.webp',alt:'NASA Spirit rover on the surface of Gusev Crater',credit:'NASA / JPL-Caltech / Cornell University',url:'https://images.nasa.gov/details/PIA04413'},
        {src:'gusev-crater-map.webp',alt:'Map showing the Gusev Crater landing and exploration region on Mars',credit:'NASA / JPL-Caltech / ASU / Cornell University',url:'https://images.nasa.gov/details/PIA21006'}
      ],
      traces:[
        'A rover. One of its wheels became stuck in the Martian soil.',
        'Gusev Crater, Mars. 14.5684° S, 175.4726° E.',
        'Mars Exploration Rover A (MER-A). 2004–2011.',
        'Evidence of past water activity and hydrothermal processes.'
      ],
      what:'Spirit was a robotic geologist rover, one of NASA’s Mars Exploration Rovers.',
      purpose:'It examined rocks and soil in Gusev Crater to investigate the history of water and the Martian environment.',
      fate:'Spirit became trapped in soft soil. It stopped communicating in 2010; the mission officially ended on May 25, 2011.',
      why:'Its observations revealed strong evidence that water had altered Martian rocks and terrain in the past, including signs of hydrothermal processes.',
      mission:'Mars Exploration Rover A (MER-A)', coordinates:'14.5684° S, 175.4726° E', period:'2004–2011', planned:'90 sols', actual:'2,210 sols', distance:'~7.73 km', end:'May 25, 2011',
      storyLead:'It was designed for 90 days. It lasted six years.',
      story:'A rugged robotic geologist crossed 7.73 km of treacherous alien desert. Before it became permanently trapped in the deep sands, Spirit discovered the first clear, definitive evidence that liquid water had once actively flowed across the surface of Mars.'
    },
    {
      id:'opportunity', number:6, step:3, title:'OPPORTUNITY', eyebrow:'THE HEART OF THE STORY', subtitle:'A rover that kept going — until the signal disappeared.', location:'MERIDIANI PLANUM',
      images:[{src:'opportunity-rover-greeley-panorama.webp',alt:'Opportunity rover panorama at Endeavour Crater on Mars',credit:'NASA / JPL-Caltech / Cornell / Arizona State University',url:'https://images.nasa.gov/details/PIA15689'}],
      what:'Opportunity was a robotic geologist rover, the second Mars Exploration Rover (MER-B).',
      purpose:'It explored rocks and soil to investigate evidence that liquid water once existed on Mars.',
      fate:'A massive planet-wide dust storm blocked sunlight from its solar panels. Contact was lost in June 2018; the mission ended in February 2019.',
      why:'Opportunity travelled farther than any other Mars rover at the time and transformed scientific understanding of ancient water on Mars.',
      mission:'Mars Exploration Rover B (MER-B)',arrival:'January 25, 2004',planned:'90 sols',actual:'5,498 sols',last:'June 10, 2018',end:'February 13, 2019',distance:'45.16 km',
      storyLead:'Then it fell silent.',
      story:'The ultimate planetary distance runner. Built to survive for 90 days, Opportunity outlasted all expectations by operating for 5,498 sols and covering 45.16 km before a massive, planet-wide dust storm permanently blocked its solar power panels in 2018.',
      timeline:[
        ['2004','LANDING'],
        ['2005','FIRST ROCK EXAMINATION'],
        ['2007','VICTORIA CRATER'],
        ['2010','20 KM TRAVELLED'],
        ['2014','ENDEAVOUR CRATER'],
        ['2018','DUST STORM']
      ]
    },
    {
      id:'ingenuity', number:7, step:4, title:'INGENUITY', eyebrow:'FLIGHT', subtitle:'A small helicopter. The first powered flight on another planet.', location:'JEZERO CRATER',
      images:[{src:'ingenuity-mars-helicopter.webp',alt:'NASA Ingenuity Mars Helicopter on the Martian surface',credit:'NASA / JPL-Caltech',url:'https://images.nasa.gov/details/PIA23882'}],
      what:'Ingenuity was a small robotic helicopter delivered to Mars with the Perseverance rover.',
      purpose:'It was a technology demonstrator designed to test powered, controlled flight in the thin Martian atmosphere.',
      fate:'After completing 72 flights, a rotor blade was damaged during its final flight. The mission ended on January 25, 2024.',
      why:'Ingenuity became the first aircraft to achieve powered, controlled flight on another planet and opened a path for future aerial explorers.',
      mission:'Mars 2020 / Perseverance technology demonstration',planned:'5 flights',actual:'72 flights',first:'April 19, 2021',final:'January 18, 2024',end:'January 25, 2024',
      storyLead:'What did Ingenuity leave behind?',
      legacy:['Data.','Design lessons.','A path for future flying vehicles.'],
      story:'The little rotorcraft that could. Planned for only five short test flights, Ingenuity flew through the thin Martian atmosphere 72 times, becoming the first aircraft to achieve powered, controlled flight on another planet. A rotor blade was damaged during its final flight.'
    }
  ];
  const PROGRESS='thaProgress';
  let timers=[], effects=[], ambient=null, imageWarm=null, activeWhirr=null;

  function getProgress(){try{return Math.max(0,Math.min(4,Number(JSON.parse(localStorage.getItem(PROGRESS)||'{}').mars)||0));}catch(_){return 0;}}
  function saveProgress(count){try{const p=JSON.parse(localStorage.getItem(PROGRESS)||'{}');p.mars=Math.max(Number(p.mars)||0,Math.min(4,count));localStorage.setItem(PROGRESS,JSON.stringify(p));window.THA?.setProgress?.('mars',p.mars);return p.mars;}catch(_){return count;}}
  function clearTimers(){timers.forEach(clearTimeout);timers=[];}
  function stopEffects(){effects.forEach(a=>{try{a.pause();a.currentTime=0;}catch(_){}});effects=[];}
  function stopAll(){clearTimers();stopEffects();stopWhirr();try{ambient?.pause();if(ambient)ambient.currentTime=0;}catch(_){}}
  function audio(file,volume=.3){if(window.THA?.audioMuted)return null;try{const a=new Audio(AUDIO+file);a.preload='auto';a.volume=volume;a.load();effects.push(a);return a;}catch(_){return null;}}
  function play(file,volume,onFailure=null){const a=audio(file,volume);if(!a)return null;if(typeof onFailure==='function')a.addEventListener('error',onFailure,{once:true});const request=a.play();if(request&&typeof request.catch==='function')request.catch(()=>{if(typeof onFailure==='function')onFailure();});return a;}
  function startAmbient(){if(!ambient||window.THA?.audioMuted)return;if(ambient.volume<.05||ambient.volume>.90)ambient.volume=.78;ambient.play().catch(()=>{});}
  function pauseAmbient(){try{ambient?.pause();if(ambient)ambient.currentTime=0;}catch(_){}}
  function fadeMedia(media,target,duration,onDone){if(!media){onDone?.();return;}const token=(media.__thaFadeToken||0)+1;media.__thaFadeToken=token;const start=media.volume,steps=Math.max(1,Math.ceil(duration/60));let i=0;const tick=()=>{if(media.__thaFadeToken!==token)return;i++;media.volume=start+(target-start)*(i/steps);if(i>=steps){if(target===0&&media===ambient)pauseAmbient();onDone?.();return;}const t=setTimeout(tick,duration/steps);timers.push(t);};tick();}
  function stopWhirr(){try{activeWhirr?.pause();if(activeWhirr)activeWhirr.currentTime=0;}catch(_){}activeWhirr=null;}
  function warmImages(){if(imageWarm)return imageWarm;const files=DATA.flatMap(r=>r.images.map(i=>i.src));files.push('gusev-crater-map.webp','ingenuity-flight-path-optimized.webp','ingenuity-flight-72-damaged.webp');imageWarm=Promise.all(files.map(src=>new Promise(resolve=>{const im=new Image();im.decoding='async';im.fetchPriority='low';im.onload=()=>resolve(true);im.onerror=()=>resolve(false);im.src=IMG+src;if(im.complete&&im.naturalWidth)resolve(true);})));return imageWarm;}
  function external(url,label='VIEW OFFICIAL NASA SOURCE ↗'){const a=$('a','mars-source',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function addImageCard(parent,item,index=0){const f=$('figure','mars-evidence');const im=$('img');im.src=IMG+item.src;im.alt=item.alt;im.loading=index===0?'eager':'lazy';im.decoding='async';im.fetchPriority=index===0?'high':'low';const cap=$('figcaption','mars-credit');cap.append(document.createTextNode(item.credit+' · '));const link=$('a','','NASA IMAGE SOURCE ↗');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';cap.append(link);f.append(im,cap);parent.append(f);return f;}
  function gallery(r){const g=$('div','mars-image-gallery');r.images.forEach((im,i)=>addImageCard(g,im,i));if(r.id==='ingenuity'){addImageCard(g,{src:'ingenuity-flight-path-optimized.webp',alt:'NASA/JPL map tracing the paths of Ingenuity helicopter flights 1 through 72',credit:'NASA / JPL-Caltech',url:'https://www.jpl.nasa.gov/videos/see-ingenuitys-flight-map-72-helicopter-flights-on-mars/'},1);}return g;}
  function learningLayer(r){const b=$('section','mars-discover-copy');b.append($('p','mars-overline','DISCOVER // THE OBJECT'));const qs=[['01 · WHAT WAS IT?',r.what],['02 · WHAT WAS ITS PURPOSE?',r.purpose],['03 · WHAT HAPPENED TO IT?',r.fate],['04 · WHY DOES IT MATTER?',r.why]];const list=$('div','mars-answers');qs.forEach(([q,a])=>{const card=$('article','mars-answer');card.append($('h3','',q),$('p','',a));list.append(card);});b.append(list);return b;}
  function objectDNA(r){const facts=r.id==='sojourner'?[['MISSION LIFE','83 sols','Designed for a 7-day mission.'],['SIZE','30 cm','About one foot tall.'],['WEIGHT','10.6 kg','A microwave-sized rover.']]:r.id==='spirit'?[['PLANNED','90 sols','The planned primary mission.'],['ACTUAL','2,210 sols','Over six Earth years.'],['DISTANCE','~7.73 km','Across Gusev Crater terrain.']]:r.id==='opportunity'?[['PLANNED','90 sols','A short primary mission.'],['ACTUAL','5,498 sols','Far beyond the planned life.'],['DISTANCE','45.16 km','A remarkable Mars traverse.']]:[['PLANNED','5 flights','A technology demonstration.'],['COMPLETED','72 flights','67 beyond the original plan.'],['LEGACY','AERIAL EXPLORATION','A new way to explore another world.']];const card=$('section','mars-object-dna');card.append($('p','mars-overline','OBJECT DNA // DECODE THE HARDWARE'),$('p','mars-dna-intro','Three verified details from this recovered mission.'));const grid=$('div','mars-dna-grid');facts.forEach(([k,v,n],i)=>{const tile=$('article','mars-dna-tile');tile.style.setProperty('--dna-index',String(i));tile.append($('span','mars-dna-index',`0${i+1}`),$('span','mars-dna-label',k),$('strong','mars-dna-value',v),$('p','mars-dna-note',n));grid.append(tile);});card.append(grid);return card;}
  function nasaData(r){const b=$('section','mars-nasa-data');b.append($('p','mars-data-label','NASA DATA // VERIFIED MISSION RECORD'));const fields=[];if(r.mission)fields.push(['MISSION',r.mission]);if(r.location)fields.push(['LOCATION',r.location]);if(r.coordinates)fields.push(['COORDINATES',r.coordinates]);if(r.arrival)fields.push(['ARRIVAL',r.arrival]);if(r.period)fields.push(['MISSION PERIOD',r.period]);if(r.planned)fields.push(['PLANNED',r.planned]);if(r.actual)fields.push([r.id==='ingenuity'?'COMPLETED':'ACTUAL',r.actual]);if(r.operation)fields.push(['OPERATION',r.operation]);if(r.size)fields.push(['SIZE',r.size]);if(r.weight)fields.push(['WEIGHT',r.weight]);if(r.distance)fields.push(['DISTANCE',r.distance]);if(r.last)fields.push(['LAST CONTACT',r.last]);if(r.first)fields.push(['FIRST FLIGHT',r.first]);if(r.final)fields.push(['FINAL FLIGHT',r.final]);if(r.end)fields.push(['MISSION END',r.end]);const grid=$('dl','mars-data-grid');fields.forEach(([k,v])=>grid.append($('dt','',k),$('dd','',v)));b.append(grid,external(SOURCE[r.id]));return b;}
  function exploreLayer(r){const b=$('div','mars-explore-copy');b.append($('p','mars-overline','EXPLORE // NASA DATA + OBJECT DNA'));
    // Opportunity's verified contact/end dates are intentionally withheld until
    // SIGNAL LOST has remained on screen for the full five-second silence.
    if(r.id!=='opportunity')b.append(nasaData(r));
    b.append(objectDNA(r));return b;}
  function tabs(r){const wrap=$('section','mars-layers');const bar=$('div','mars-tabs');const discover=btn('DISCOVER','mars-tab is-active',()=>select(true));const explore=btn('EXPLORE','mars-tab',()=>select(false));discover.setAttribute('aria-pressed','true');explore.setAttribute('aria-pressed','false');const d=$('div','mars-layer');const e=$('div','mars-layer');d.append(learningLayer(r));e.append(exploreLayer(r));e.hidden=true;bar.append(discover,explore);wrap.append(bar,d,e);function select(show){d.hidden=!show;e.hidden=show;discover.classList.toggle('is-active',show);explore.classList.toggle('is-active',!show);discover.setAttribute('aria-pressed',String(show));explore.setAttribute('aria-pressed',String(!show));}return wrap;}
  function storyCard(r){
    const s=$('section','mars-story');
    s.append($('p','mars-overline','THE STORY // 2126 ARCHIVE'));
    s.append($('p','mars-story-lead',r.storyLead));
    if(r.legacy){const legacy=$('div','mars-story-legacy');r.legacy.forEach(line=>legacy.append($('p','',line)));s.append(legacy);}
    if(r.story)s.append($('p','mars-story-copy',r.story));
    return s;
  }
  function recordHeader(r){const header=$('header','mars-record-top');const back=btn('← ARCHIVE MAP','mars-back',()=>window.THANavigation?.goTo('menu'));header.append(back,$('p','mars-overline',`CHAPTER THREE // RECORD ${r.number}`),$('p','mars-eyebrow',r.eyebrow),$('h1','',r.title),$('p','mars-record-subtitle',r.subtitle),$('p','mars-location','FIELD SITE // '+r.location));return header;}
  function footer(){const f=$('footer','mars-footer');f.append($('span','','MARS SURFACE SURVEY // ARCHIVE 2126'),btn('← ARCHIVE MENU','mars-secondary',()=>window.THANavigation?.goTo('menu')));return f;}
  function playSojournerWheelThenAmbient(){
    // The wheel cue is intentionally isolated: do not restart the Martian bed
    // until the complete wheel-roll clip has ended (or failed to load).
    pauseAmbient();
    const wheel=play('wheel-roll.mp3',.34);
    let resumed=false;
    const resume=()=>{
      if(resumed)return;
      resumed=true;
      if(wheel){wheel.removeEventListener('ended',resume);wheel.removeEventListener('error',resume);}
      if(rootIsMarsMap())startAmbient();
    };
    function rootIsMarsMap(){return Boolean(document.querySelector('.tha-mars-screen') && document.querySelector('.tha-mars-screen .mars-map-intro'));}
    if(wheel){
      wheel.addEventListener('ended',resume,{once:true});
      wheel.addEventListener('error',resume,{once:true});
      const fallback=setTimeout(resume,5000);
      timers.push(fallback);
    }else resume();
  }
  function addContinue(root,r){
    const actions=$('div','mars-actions');
    const label=r.number===7?'MARS ARCHIVE COMPLETE →':`RETURN TO MARS MAP // TRACE ${r.number+1} →`;
    actions.append(btn(label,'mars-primary',()=>{
      saveProgress(r.step);
      if(r.id==='sojourner'){
        renderMarsMapInto(root,false);
        playSojournerWheelThenAmbient();
        return;
      }
      if(r.id==='spirit'){
        // The melancholic ambience dip is non-blocking; return to the map at once.
        if(ambient)fadeMedia(ambient,.38,120);
        renderMarsMapInto(root);
        if(ambient)ambient.volume=.78;
        return;
      }
      if(r.number===7)renderCompletion(root,false);else renderMarsMapInto(root);
    }));
    return actions;
  }
  function traceSequence(root,r,content){const section=$('section','mars-trace-sequence');section.append($('p','mars-overline',`TRACE SEQUENCE // ${r.traces.length} CLUES · REVEAL IN ORDER`),$('p','mars-trace-instruction','Each recovered trace adds one piece to the record.'));const list=$('div','mars-trace-list');let revealed=0;r.traces.forEach((line,i)=>{const item=$('article','mars-trace-item is-locked');const trigger=btn(`REVEAL TRACE ${i+1} →`,'mars-trace-trigger',()=>{if(i!==revealed)return;trigger.disabled=true;item.classList.remove('is-locked');item.classList.add('is-revealed');const body=$('p','mars-trace-copy',`TRACE ${i+1} → ${line}`);item.append(body);trigger.textContent=`TRACE ${i+1} // RECOVERED`;revealed++;const next=list.querySelectorAll('.mars-trace-trigger')[revealed];if(next){next.disabled=false;next.closest('.mars-trace-item')?.classList.remove('is-locked');}if(revealed===r.traces.length){const open=btn('OPEN DISCOVER / EXPLORE →','mars-primary',()=>{const layers=tabs(r);content.append(layers,storyCard(r),addContinue(root,r));layers.scrollIntoView({behavior:'smooth',block:'start'});open.remove();});section.append(open);}});trigger.disabled=i!==0;item.append($('span','mars-trace-number',String(i+1).padStart(2,'0')),trigger);list.append(item);});section.append(list);return section;}
  function buildTemplateA(root,r,content){content.append(gallery(r));const clues=traceSequence(root,r,content);content.append(clues);}
  function buildOpportunity(root,r,content){
    content.append(gallery(r),tabs(r));
    const timeline=$('section','mars-timeline is-appearing');
    timeline.append($('p','mars-overline','THE HEART OF THE STORY // MISSION TIMELINE'),$('p','mars-timeline-help','The timeline assembles one stop at a time. Select each year to recover the next event.'));
    const ol=$('ol','mars-events');let selected=0;
    r.timeline.forEach(([year,label],i)=>{
      const li=$('li','mars-event-item');li.style.animationDelay=(i*160)+'ms';
      const b=btn('', 'mars-event',()=>{
        if(i!==selected)return;
        b.disabled=true;b.classList.add('is-selected');b.querySelector('.mars-event-prompt')?.remove();
        const marker=$('span','mars-event-year',year);
        const title=$('strong','mars-event-title',label);
        b.append(marker,title);play('click.mp3',.3);
        selected++;
        if(ambient){const target=Math.min(.78,.50+selected*.055);fadeMedia(ambient,target,850);}
        const next=ol.querySelectorAll('.mars-event')[selected];if(next)next.disabled=false;
        if(selected===r.timeline.length){
          const storm=$('section','mars-storm-gate');
          storm.append($('p','mars-overline','2018'),$('h2','','A MASSIVE DUST STORM ON MARS'));
          timeline.append(storm);
          // Bring the newly revealed 2018 dust-storm card into view before
          // the signal-loss sequence follows it.
          requestAnimationFrame(() => storm.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          const t=setTimeout(()=>signalLost(root,r,content,storm),1100);timers.push(t);
        }
      });
      b.disabled=i!==0;
      b.append($('span','mars-event-index',String(i+1).padStart(2,'0')),$('span','mars-event-prompt',`${year}  ·  ${label}`));
      li.append(b);ol.append(li);
    });
    timeline.append(ol);content.append(timeline);
  }
  function signalLost(root,r,content,storm){
    if(content.dataset.signalStarted)return;
    content.dataset.signalStarted='true';
    storm.classList.add('is-storm-dark');
    root.classList.add('is-signal-blackout');

    const lost=$('section','mars-signal-sequence');
    lost.append($('h2','','SIGNAL LOST'));

    // The NASA facts, story, and single piano note are deliberately held back
    // until the complete five-second silence has elapsed.
    const nasa=$('section','mars-lost-data');
    nasa.hidden=true;
    nasa.append(
      $('p','mars-data-label','NASA DATA // VERIFIED'),
      $('p','','LAST CONTACT // June 10, 2018'),
      $('p','','MISSION END // February 13, 2019')
    );
    // Keep the NASA data completely out of the DOM until the silence ends.
    // This prevents the hidden attribute from being overridden by any layout CSS.

    const pageFooter=root.querySelector('.mars-footer');
    pageFooter?.classList.remove('is-restored');
    pageFooter?.setAttribute('aria-hidden','true');

    if(ambient)fadeMedia(ambient,.96,1500,()=>pauseAmbient());
    const cut=setTimeout(()=>{
      pauseAmbient();
      stopEffects();
      stopWhirr();
      // SIGNAL LOST appears only after the storm audio has cut off.
      content.append(lost);
      // Bring the newly-created SIGNAL LOST scene into view so users who are
      // reading higher on the record never miss the critical ending.
      requestAnimationFrame(() => lost.scrollIntoView({ behavior: 'smooth', block: 'center' }));

      // Start the five-second clock only after every sound source is stopped.
      const reveal=setTimeout(()=>{
        if(!root.isConnected)return;

        // These three elements begin together: NASA DATA, STORY, and one
        // sustained piano note. The MP3 is played once and fades over its life.
        nasa.hidden=false;
        nasa.classList.add('is-revealing');
        const story=storyCard(r);
        story.classList.add('is-revealing');
        content.append(nasa,story);
        requestAnimationFrame(() => nasa.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        const piano=play('single-piano-note.mp3',.62);
        if(piano){
          piano.volume=.62;
          const pianoFadeMs=Math.max(6500,Math.min(7200,(Number.isFinite(piano.duration)&&piano.duration>0?piano.duration:7.03)*980));
          fadeMedia(piano,0,pianoFadeMs);
        }

        const motto=$('p','mars-abandoned','ABANDONED ≠ FORGOTTEN.');
        motto.hidden=true;
        content.append(motto);

        const actions=$('div','mars-actions');
        actions.hidden=true;
        const next=btn('RETURN TO MARS MAP // TRACE 07 →','mars-primary',()=>{
          saveProgress(r.step);
          renderMarsMapInto(root);
        });
        next.disabled=true;
        actions.append(next);
        content.append(actions);

        const finish=()=>{
          if(!root.isConnected||motto.dataset.finished==='true')return;
          motto.dataset.finished='true';
          motto.hidden=false;
          motto.classList.add('is-revealing');
          actions.hidden=false;
          next.disabled=false;
          // Let the ABANDONED ≠ FORGOTTEN line finish its reveal first;
          // only then restore the footer, in the same order as Belge 1.
          if(pageFooter){
            const footerReveal=setTimeout(()=>{
              if(!pageFooter.isConnected)return;
              pageFooter.classList.add('is-restored');
              pageFooter.setAttribute('aria-hidden','false');
              pageFooter.scrollIntoView({behavior:'smooth',block:'nearest'});
            },900);
            timers.push(footerReveal);
          }
        };

        if(piano){
          piano.addEventListener('ended',finish,{once:true});
          // Do not strand the closing text if a browser blocks or cannot decode audio.
          const fallback=setTimeout(finish,7600);
          timers.push(fallback);
          piano.addEventListener('error',finish,{once:true});
        }else{
          // Muted or unavailable audio: retain the long-note pacing without
          // pretending that a sound was played.
          const fallback=setTimeout(finish,7000);
          timers.push(fallback);
        }
      },5000);
      timers.push(reveal);
    },1500);
    timers.push(cut);
  }
  function buildIngenuity(root,r,content){
    content.append(gallery(r),tabs(r));const flightBox=$('section','mars-flight');
    flightBox.append($('p','mars-overline','FLIGHT SLIDER // 5 PLANNED · 72 COMPLETED'),$('h2','','FOLLOW THE FLIGHT PATH'),$('p','mars-flight-help','Move from flight 1 to flight 72. Every completed flight leaves a trace.'));
    const output=$('output','mars-flight-value','FLIGHT 1 / 72');const range=$('input','mars-flight-range');range.type='range';range.min='1';range.max='72';range.value='1';range.setAttribute('aria-label','Ingenuity flight number, 1 to 72');
    const dots=$('div','mars-flight-dots');for(let i=0;i<72;i++)dots.append($('span','mars-flight-dot'));
    const reveal=$('div','mars-flight-final');reveal.hidden=true;
    range.addEventListener('input',()=>{
      const n=Number(range.value);output.textContent=`FLIGHT ${n} / 72`;dots.querySelectorAll('.mars-flight-dot').forEach((d,i)=>d.classList.toggle('is-passed',i<n));
      if(n!==72||flightBox.dataset.final)return;flightBox.dataset.final='true';flightBox.classList.add('is-final-flight');
      let damageStarted=false;
      let whirrSafety=null;
      let damageSafety=null;
      const stopFlightBoxMotion=()=>flightBox.classList.remove('is-flight-vibration');
      const startFlightBoxMotion=()=>flightBox.classList.add('is-flight-vibration');
      const showStory=()=>{
        if(!reveal.isConnected||reveal.dataset.storyShown)return;
        reveal.dataset.storyShown='true';
        if(damageSafety)clearTimeout(damageSafety);
        root.classList.remove('is-damage-tremor');
        stopFlightBoxMotion();
        reveal.append(storyCard(r),addContinue(root,r));
      };
      const damageSequence=()=>{
        if(damageStarted||!flightBox.isConnected)return;
        damageStarted=true;
        if(whirrSafety)clearTimeout(whirrSafety);
        stopFlightBoxMotion();
        stopWhirr();
        pauseAmbient();
        // The screen trembles for the damage audio only; the flight-control
        // card has already stopped vibrating when the helicopter whirr ends.
        root.classList.add('is-damage-tremor');
        reveal.append($('p','mars-overline','FLIGHT 72 // ROTOR DAMAGE DETECTED'));
        addImageCard(reveal,{src:'ingenuity-flight-72-damaged.webp',alt:'NASA image of Ingenuity after flight 72, showing rotor blade damage',credit:'NASA / JPL-Caltech',url:'https://images.nasa.gov/details/PIA26243'},0);
        reveal.hidden=false;
        const damage=play('damage-sound.mp3',.82,showStory);
        if(damage){
          damage.addEventListener('ended',showStory,{once:true});
          // Safety net only: the actual media ended/error event controls the
          // sequence in normal playback; this is deliberately longer than the clip.
          damageSafety=setTimeout(showStory,8000);
          timers.push(damageSafety);
        }else showStory();
      };
      startFlightBoxMotion();
      activeWhirr=play('helicopter-whirr.mp3',.78,damageSequence);
      if(activeWhirr){
        activeWhirr.addEventListener('ended',damageSequence,{once:true});
        // Cut the rotor whirr short so the helicopter is heard lifting briefly,
        // the flight-control box shakes, then damage interrupts the flight.
        // The forced hand-off stops the longer source clip before its natural end.
        whirrSafety=setTimeout(damageSequence,2500);
        timers.push(whirrSafety);
      }else damageSequence();
    });
    flightBox.append(output,range,dots,reveal);content.append(flightBox);
  }
  function renderRecordInto(root,r){stopEffects();clearTimers();root.className='tha-mars-screen is-record';root.replaceChildren();root.append(fieldHeader(),recordHeader(r));const content=$('main','mars-record-content');content.append($('p','mars-progress-line',`MARS ARCHIVE // ${getProgress()} OF 04 RECORDS RECOVERED`));if(r.id==='sojourner'||r.id==='spirit')buildTemplateA(root,r,content);else if(r.id==='opportunity')buildOpportunity(root,r,content);else buildIngenuity(root,r,content);const pageFooter=footer();pageFooter.setAttribute('aria-hidden','false');root.append(content,pageFooter);if(ambient){ambient.volume=r.id==='opportunity'?.50:.78;}startAmbient();window.THAIdentity?.mountInMenu?.();window.scrollTo({top:0,behavior:'smooth'});}

  function mapSVG(){return `<svg class="mars-terrain-svg" viewBox="0 0 1000 750" role="img" aria-label="Expedition route across a rust-red Martian terrain, showing four numbered trace locations"><defs><linearGradient id="marsGround" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9a4428"/><stop offset=".48" stop-color="#54251a"/><stop offset="1" stop-color="#1c100d"/></linearGradient><radialGradient id="marsHaze"><stop stop-color="#dd8054" stop-opacity=".42"/><stop offset="1" stop-color="#6e2d1b" stop-opacity="0"/></radialGradient><pattern id="marsGrain" width="38" height="38" patternUnits="userSpaceOnUse"><circle cx="6" cy="8" r="1.6" fill="#ffbd96" opacity=".22"/><circle cx="28" cy="25" r="1.1" fill="#170c09" opacity=".55"/><path d="M4 31l8-2m16-22 5-2" stroke="#f2a27b" opacity=".12"/></pattern></defs><rect width="1000" height="750" fill="url(#marsGround)"/><rect width="1000" height="750" fill="url(#marsHaze)"/><rect width="1000" height="750" fill="url(#marsGrain)"/><g fill="none" stroke="#f1a27c" opacity=".17" stroke-width="2"><path d="M-30 94Q120 12 240 95T470 88T730 73T1040 105"/><path d="M-20 158Q135 78 265 158T505 147T765 140T1020 166"/><path d="M-40 520Q170 420 320 510T600 505T840 480T1040 530"/><path d="M-20 710Q180 615 350 700T650 694T1010 720"/><path d="M80 -20Q160 100 115 210T180 430T130 620M880 -20Q810 110 865 230T840 430T910 620"/></g><g fill="none" stroke="#1e0d08" stroke-width="22" opacity=".22"><path d="M40 440Q120 375 210 406T400 380T590 360T800 235T985 135"/><path d="M25 460Q115 395 207 426T405 400T600 380T815 255T1000 155"/></g><path d="M170 585C260 530 330 475 420 435S600 340 700 278S800 195 860 113" fill="none" stroke="#ffd0ae" stroke-width="4" stroke-dasharray="12 14" opacity=".74"/><path d="M170 585C260 530 330 475 420 435S600 340 700 278S800 195 860 113" fill="none" stroke="#ffb18a" stroke-width="13" stroke-dasharray="2 26" stroke-linecap="round" opacity=".3"/><g fill="#f5b08a" opacity=".65" font-family="monospace" letter-spacing="5"><text x="42" y="48" font-size="20">MARTIAN REGOLITH // EXPEDITION PATH</text><text x="42" y="78" font-size="12">FIELD SURVEY 04—07 · SCHEMATIC ROUTE</text><text x="42" y="715" font-size="12">PATHFINDER → GUSEV → MERIDIANI → JEZERO</text></g><g fill="none" stroke="#ed9b72" opacity=".14"><path d="M250 0Q350 140 500 110T760 0M520 750Q620 620 720 660T980 730" stroke-width="3"/><path d="M0 260Q170 190 300 255T550 250T1000 210" stroke-width="2"/></g></svg>`;}
  function mapRecordList(){const panel=$('aside','mars-expedition-list');panel.append($('p','mars-overline','FIELD LOG // RECOVERY ORDER'),$('h2','','THE ROVER YEARS'));DATA.forEach(r=>{const unlocked=r.step<=getProgress()+1;const complete=r.step<=getProgress();const label=complete?'RECOVERED':unlocked?'READY TO OPEN':'LOCKED';const row=btn('',`mars-expedition-row${complete?' is-complete':''}${unlocked?' is-unlocked':' is-locked'}`,()=>{if(!unlocked)return;openRecordFromMap(r);});row.disabled=!unlocked;const copy=$('span','mars-expedition-copy');copy.append($('strong','',r.title));row.append($('span','mars-expedition-no',String(r.number).padStart(2,'0')),copy,$('span','mars-expedition-status',label));panel.append(row);});panel.append($('p','mars-expedition-note','The archive opens one new trace at a time. Recovered records can be revisited.'));return panel;}
  function openRecordFromMap(r){const root=document.querySelector('.tha-mars-screen');if(!root||r.step>getProgress()+1)return;startAmbient();play('click.mp3',.28);const frame=root.querySelector('.mars-map-frame');if(frame){frame.style.setProperty('--mars-focus-x',`${r.x||([17,42,70,86][r.step-1])}%`);frame.style.setProperty('--mars-focus-y',`${r.y||([75,55,36,15][r.step-1])}%`);frame.classList.add('is-zooming');}const t=window.setTimeout(()=>{if(root.isConnected)renderRecordInto(root,r);},660);timers.push(t);}
  function fieldHeader(){
    const header=$('header','tha-moon-header mars-header');
    const brand=$('div','tha-moon-brand');brand.append($('span','tha-moon-brand-mark','THA'));
    const brandCopy=$('div','tha-moon-brand-copy');brandCopy.append($('strong','','THE HUMAN ARCHIVE'),$('small','','FIELD RECOVERY // 2126'));brand.append(brandCopy);
    const right=$('div','tha-moon-header-right');
    const status=$('span','tha-moon-live');status.append($('i'),document.createTextNode('PLANETARY LINK // ACTIVE'));
    const identity=$('div','tha-moon-identity-slot');identity.id='thaMenuIdentitySlot';
    right.append(status,identity);header.append(brand,right);return header;
  }
  function renderMarsMapInto(root, startAudio=true){stopEffects();clearTimers();root.className='tha-mars-screen';root.replaceChildren();const header=fieldHeader();const intro=$('section','mars-map-intro');intro.append($('p','mars-overline','A NEW WORLD // MARS EXPEDITION'),$('h1','','MARS / LOST OBJECT MAP'),$('p','mars-map-subtitle','A red world. Four traces. Follow the rover years.'),$('p','mars-map-intro-copy','A new atmosphere. A new surface. A route marked by the machines humanity left behind.'));const count=$('div','mars-recovery-counter');const next=DATA[Math.min(getProgress(),3)];count.append($('span','mars-counter-label',getProgress()===4?'MARS ARCHIVE COMPLETE':'RECORD DETECTED: '+String(next.number)),$('strong','',`${getProgress()} / 4 RECOVERED`));intro.append(count);const layout=$('section','mars-map-layout');const frame=$('div','mars-map-frame');frame.innerHTML=mapSVG();const coords=[[17,75],[42,55],[70,36],[86,15]];DATA.forEach((r,i)=>{const [x,y]=coords[i];r.x=x;r.y=y;const complete=r.step<=getProgress();const available=r.step===getProgress()+1;const mark=btn('',`mars-marker ${complete?'is-complete':''} ${available?'is-current':'is-locked'}`,()=>openRecordFromMap(r));mark.style.left=x+'%';mark.style.top=y+'%';mark.disabled=!available;mark.setAttribute('aria-label',`${r.number} ${r.title} ${complete?'recovered':available?'ready to open':'locked'}`);const symbol=$('span','mars-marker-symbol');symbol.append($('span','mars-marker-number',String(r.number).padStart(2,'0')));mark.append($('span','mars-marker-halo'),symbol,$('span','mars-marker-caption',r.title));frame.append(mark);});layout.append(frame,mapRecordList());intro.append();root.append(header,intro,layout);const provenance=$('p','mars-audio-provenance','NASA DATA // PERSEVERANCE SUPERCAM MICROPHONE RECORDING · SOL 001 · LOW-FREQUENCY PLAYBACK · ');const source=$('a','','NASA AUDIO SOURCE ↗');source.href='https://www.nasa.gov/wp-content/uploads/2024/05/scam-mic-sol001-run001.wav';source.target='_blank';source.rel='noopener noreferrer';provenance.append(source);root.append(provenance,$('p','mars-map-footnote','THE HUMAN ARCHIVE // FOUR MARS RECORDS · ONE EXPEDITION PATH'),footer());window.THAIdentity?.mountInMenu?.();if(getProgress()===4){root.append(btn('MARS ARCHIVE COMPLETE // OPEN SUMMARY →','mars-primary mars-open-completion',()=>renderCompletion(root,true)));}if(startAudio)startAmbient();}
  function renderCompletion(root,returnVisit=false){
    stopAll();
    try{localStorage.setItem('thaMarsCompletionSeen','true');}catch(_){}
    root.className='tha-mars-screen mars-completion';
    root.replaceChildren(fieldHeader());

    const layout=$('main','mars-completion-layout');
    const primary=$('section','mars-completion-primary');
    primary.append(
      $('p','mars-overline','EXPEDITION DEBRIEF // CHAPTER THREE'),
      $('p','mars-completion-kicker','ALL MARTIAN TRACES RECOVERED'),
      $('div','mars-completion-score'),
      $('h1','','MARS ARCHIVE COMPLETE'),
      $('p','mars-completion-lead','Four records. Four missions. A world of human ingenuity left behind.'),
      $('p','mars-completion-statement','We found the traces on Mars.\nBut humanity travelled even farther.')
    );
    const score=primary.querySelector('.mars-completion-score');
    score.append($('strong','','04'),$('span','','/ 04 RECORDS SECURED'));

    const side=$('aside','mars-completion-side');
    side.append($('p','mars-overline','RECOVERY LOG // MARS SURFACE'));
    const track=$('ol','mars-completion-track');
    DATA.forEach((record,index)=>{
      const item=$('li','mars-completion-record');
      item.append(
        $('span','mars-completion-record-no',String(record.number).padStart(2,'0')),
        $('span','mars-completion-record-copy',record.title),
        $('span','mars-completion-record-state','RECOVERED ✓')
      );
      track.append(item);
    });
    side.append(track);

    const actions=$('div','mars-completion-actions');
    if(returnVisit){
      actions.append(
        btn('CONTINUE TO OTHER TRACES →','mars-primary',()=>window.THANavigation?.goTo('otherTraces')),
        btn('RETURN TO ARCHIVE MENU','mars-secondary',()=>window.THANavigation?.goTo('menu'))
      );
    }else{
      actions.append(
        btn('REPLAY MARS CHAPTER ↺','mars-primary',()=>{
          try{const p=JSON.parse(localStorage.getItem(PROGRESS)||'{}');p.mars=0;localStorage.setItem(PROGRESS,JSON.stringify(p));localStorage.removeItem('thaMarsCompletionSeen');}catch(_){}
          renderMarsMapInto(root);
        }),
        btn('RETURN TO ARCHIVE MENU','mars-secondary',()=>window.THANavigation?.goTo('menu'))
      );
    }
    side.append(actions);
    layout.append(primary,side);

    const signature=$('footer','mars-completion-footer');
    signature.append(
      $('span','','THE HUMAN ARCHIVE'),
      $('span','','MARS EXPEDITION // 04 TRACES PRESERVED // 2126')
    );
    root.append(layout,signature);
    window.THAIdentity?.mountInMenu?.();

    // Keep the established completion audio cue; the Opportunity record's
    // one-note ending is handled separately and is never repeated here.
    const chord=play('piano.mp3',.28);
    let pingScheduled=false;
    const distant=()=>{if(pingScheduled)return;pingScheduled=true;const t=setTimeout(()=>play('electronic-ping.mp3',.12),1500);timers.push(t);};
    if(chord){chord.addEventListener('ended',distant,{once:true});const fallback=setTimeout(distant,1800);timers.push(fallback);}else distant();
  }
  function renderMarsMap(){stopAll();void warmImages();try{ambient=new Audio(AUDIO+'low-frequency-ambient.mp3');ambient.preload='auto';ambient.volume=.78;ambient.loop=true;ambient.setAttribute('fetchpriority','high');ambient.dataset.provenance='NASA Perseverance SuperCam microphone sample, converted from supplied WAV to MP3 for efficient local playback.';ambient.load();window.THAMarsAmbient=ambient;}catch(_){ambient=null;}const root=$('main','tha-mars-screen');let seen=false;try{seen=localStorage.getItem('thaMarsCompletionSeen')==='true';}catch(_){}if(getProgress()===4&&seen)renderCompletion(root,true);else renderMarsMapInto(root);return root;}

  window.THAMarsAudio={stop:stopAll};
  window.renderMarsMap=renderMarsMap;
  window.renderMarsRecord=(id)=>{const root=document.querySelector('.tha-mars-screen')||renderMarsMap();const r=DATA.find(x=>x.id===id||x.number===Number(id));if(r&&r.step<=getProgress()+1)renderRecordInto(root,r);return root;};
})();
