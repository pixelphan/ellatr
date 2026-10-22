'use strict';
const $ = selector => document.querySelector(selector);
const menuButton = $('.menu-toggle');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');$('#mobile-nav').hidden=true;}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');$('#mobile-nav').hidden=!open;});
document.querySelectorAll('#mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const dateString = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const today=new Date();today.setHours(0,0,0,0);
const tomorrow=new Date(today);tomorrow.setDate(tomorrow.getDate()+1);
const checkin=$('#checkin'),checkout=$('#checkout');
checkin.min=dateString(today);checkin.value=dateString(today);checkout.min=dateString(tomorrow);checkout.value=dateString(tomorrow);
checkin.addEventListener('change',()=>{if(!checkin.value)return;const next=new Date(checkin.value+'T12:00:00');next.setDate(next.getDate()+1);checkout.min=dateString(next);if(checkout.value<=checkin.value)checkout.value=dateString(next);checkout.setCustomValidity('');});
checkout.addEventListener('input',()=>checkout.setCustomValidity(''));
$('#booking-form').addEventListener('submit',event=>{event.preventDefault();if(checkout.value<=checkin.value){checkout.setCustomValidity('Please choose a check-out date after check-in.');checkout.reportValidity();return;}const url=new URL('https://www.booking.com/hotel/lk/ella-trail-luxury-villa-ella.en-gb.html');url.searchParams.set('checkin',checkin.value);url.searchParams.set('checkout',checkout.value);url.searchParams.set('group_adults',$('select[name="adults"]').value);url.searchParams.set('no_rooms','1');url.searchParams.set('group_children','0');window.open(url.href,'_blank','noopener,noreferrer');});
const rooms=[
 {image:'double',alt:'A canopy bed with crisp linen and turquoise cushions at Ella Trail',title:'DELUXE DOUBLE WITH BALCONY',description:'A welcoming retreat for two, with a double bed and your own balcony for lingering a little longer.'},
 {image:'twin',alt:'Twin beds in a bright room opening onto the balcony',title:'DELUXE TWIN ROOM',description:'Share the journey, keep your own space. Two single beds make an easy home base for travelling companions.'},
 {image:'suite',alt:'A warm and inviting canopy bed with golden cushions',title:'JUNIOR SUITE WITH MOUNTAIN VIEW',description:'Settle into a suite and let the mountain views set the pace. A lovely setting for slower days together.'},
 {image:'river-suite',alt:'A thoughtfully furnished villa bedroom with a canopy bed',title:'SUITE WITH RIVER VIEW',description:'A suite to retreat to after a day outdoors, with a river-view setting and time to make yourself at home.'}
];
function selectRoom(index,focus=false){const room=rooms[index];document.querySelectorAll('[data-room]').forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;if(focus&&i===index)tab.focus();});$('#room-image').src=`assets/${room.image}.webp`;$('#room-image').alt=room.alt;$('#room-kicker').textContent=room.title;$('#room-description').textContent=room.description;$('#room-index').textContent=`0${index+1} / 04`;$('#room-detail').setAttribute('aria-labelledby',`room-tab-${index}`);}
document.querySelectorAll('[data-room]').forEach(tab=>{tab.addEventListener('click',()=>selectRoom(Number(tab.dataset.room)));tab.addEventListener('keydown',event=>{let i=Number(tab.dataset.room);if(event.key==='ArrowRight'||event.key==='ArrowDown')i=(i+1)%4;else if(event.key==='ArrowLeft'||event.key==='ArrowUp')i=(i+3)%4;else if(event.key==='Home')i=0;else if(event.key==='End')i=3;else return;event.preventDefault();selectRoom(i,true);});});
const filmDialog=$('#film-dialog'),video=filmDialog.querySelector('video');
document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{filmDialog.showModal();document.body.classList.add('modal-open');video.play().catch(()=>{});}));
filmDialog.addEventListener('close',()=>{video.pause();document.body.classList.remove('modal-open');});
const photos=[{file:'hero',caption:'The villa at sunset'},{file:'suite',caption:'Your quiet corner'},{file:'balcony',caption:'The hills, all around'},{file:'bathroom',caption:'Considered details'},{file:'lounge',caption:'Room to relax'}];
let photoIndex=0;const lightbox=$('#lightbox');
function showPhoto(i){photoIndex=(i+photos.length)%photos.length;const photo=photos[photoIndex];$('#lightbox-image').src=`assets/${photo.file}.webp`;$('#lightbox-image').alt=photo.caption;$('#lightbox-caption').textContent=`${photo.caption} · ${photoIndex+1} / ${photos.length}`;}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{showPhoto(Number(button.dataset.gallery));lightbox.showModal();document.body.classList.add('modal-open');}));
$('.gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));$('.gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+1);}if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(photoIndex-1);}});
lightbox.addEventListener('close',()=>document.body.classList.remove('modal-open'));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});});
$('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('js-animate');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('waiting');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('waiting');observer.observe(el);}});}
