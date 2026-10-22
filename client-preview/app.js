/** Self-contained presentation-only logic. No network API calls or real orders. */
const dishes=[
 {id:'paneer',name:'Royal Paneer Lababdar',category:'Curries',price:349,veg:true,description:'Soft paneer, tomato-cashew gravy, a gentle touch of cream.',img:'photo-1631452180519-c014fe946bc7'},
 {id:'chicken',name:'Dakshayani Butter Chicken',category:'Curries',price:429,veg:false,description:'Tender tandoori chicken with smoky makhani sauce.',img:'photo-1603894584373-5ac82b2ae398'},
 {id:'dal',name:'Dal Makhani Heritage',category:'Curries',price:299,veg:true,description:'Black lentils slow-cooked overnight with warming spices.',img:'photo-1546833999-b9f581a1996d'},
 {id:'tikka',name:'Tandoori Chicken Tikka',category:'Tandoor',price:389,veg:false,description:'Yoghurt-marinated bites finished over charcoal.',img:'photo-1599487488170-d11ec9c172f0'},
 {id:'biryani',name:'Hyderabadi Dum Biryani',category:'Rice',price:399,veg:false,description:'Saffron basmati, fragrant herbs and royal spices.',img:'photo-1563379091339-03246963d96c'},
 {id:'naan',name:'Garlic Butter Naan',category:'Tandoor',price:89,veg:true,description:'Fresh from the tandoor with garlic and butter.',img:'photo-1610057099431-d73a1c9d2f2f'},
 {id:'kebab',name:'Malai Soya Chaap',category:'Tandoor',price:319,veg:true,description:'Creamy soya morsels, gently charred and spiced.',img:'photo-1626777552726-4a6b54e52b27'},
 {id:'dessert',name:'Saffron Phirni',category:'Dessert',price:169,veg:true,description:'Chilled rice pudding with cardamom and saffron.',img:'photo-1666190094768-9ca57d82a59b'}
];
const $=selector=>document.querySelector(selector);
const money=amount=>'₹'+Number(amount).toLocaleString('en-IN');
const cart={};let currentCategory='All',showAll=false,booking={};
function notify(message){const t=$('#toast');t.textContent=message;t.hidden=false;clearTimeout(notify.id);notify.id=setTimeout(()=>t.hidden=true,2800)}
function renderDishes(){const term=$('#dish-search').value.toLowerCase().trim();const shown=dishes.filter(d=>(currentCategory==='All'||d.category===currentCategory)&&d.name.toLowerCase().includes(term));const visible=showAll?shown:shown.slice(0,4);$('#dish-grid').innerHTML=visible.map(d=>`<article class="dish-card"><div class="dish-photo"><img loading="lazy" alt="${d.name}" src="https://images.unsplash.com/${d.img}?auto=format&fit=crop&w=650&q=85"/><span class="dish-tag">${d.veg?'✿ VEG':'● NON-VEG'}</span></div><div class="dish-copy"><small>${d.category}</small><h3>${d.name}</h3><p>${d.description}</p><div class="dish-bottom"><strong>${money(d.price)}</strong><button data-add="${d.id}" aria-label="Add ${d.name} to cart">＋ ADD</button></div></div></article>`).join('')||'<p>No matching dishes. Try another search.</p>';$('#view-all').textContent=showAll?'SHOW FEWER DISHES ↑':'VIEW ALL DISHES →'}
function renderCart(){const rows=Object.entries(cart).filter(([,q])=>q>0);$('#cart-count').textContent=rows.reduce((a,[,q])=>a+q,0);$('#cart-items').innerHTML=rows.map(([id,q])=>{const d=dishes.find(x=>x.id===id);return `<div class="cart-row"><img src="https://images.unsplash.com/${d.img}?auto=format&fit=crop&w=140&q=75" alt=""/><div class="cart-info"><strong>${d.name}</strong><small>${money(d.price)} each</small><div><button data-qty="${id}" data-dir="-1">−</button>${q}<button data-qty="${id}" data-dir="1">＋</button></div></div><strong>${money(d.price*q)}</strong></div>`}).join('')||'<p>Your demo cart is empty. Add something delicious!</p>';$('#cart-total').textContent=money(rows.reduce((a,[id,q])=>a+dishes.find(x=>x.id===id).price*q,0))}
function openCart(){renderCart();$('#shade').hidden=false;$('#cart-drawer').classList.add('open')}
function closeCart(){$('#shade').hidden=true;$('#cart-drawer').classList.remove('open')}
function openBooking(date='',time='19:00',guests='2'){booking={date:date||$('#reserve-date').value||'',time,guests};$('#booking-review').textContent=booking.date?`Preferred date: ${booking.date} • ${time} • ${guests} guest(s). Our team will confirm availability in the real website.`:'Choose your reservation details on the hero card. This is a presentation request.';$('#booking-dialog').showModal()}
$('#year').textContent=new Date().getFullYear();
const now=new Date();const today=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);$('#reserve-date').min=today;$('#reserve-date').value=today;
$('#categories').addEventListener('click',event=>{const b=event.target.closest('[data-category]');if(!b)return;currentCategory=b.dataset.category;$('#categories').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderDishes()});
$('#dish-search').addEventListener('input',renderDishes);$('#view-all').addEventListener('click',()=>{showAll=!showAll;renderDishes()});
$('#dish-grid').addEventListener('click',event=>{const btn=event.target.closest('[data-add]');if(!btn)return;cart[btn.dataset.add]=(cart[btn.dataset.add]||0)+1;renderCart();notify('Added to your demo cart')});
$('#cart-items').addEventListener('click',event=>{const b=event.target.closest('[data-qty]');if(!b)return;cart[b.dataset.qty]=Math.max(0,(cart[b.dataset.qty]||0)+Number(b.dataset.dir));renderCart()});
$('#cart-trigger').addEventListener('click',openCart);$('#close-cart').addEventListener('click',closeCart);$('#shade').addEventListener('click',closeCart);
$('#demo-checkout').addEventListener('click',()=>notify('Checkout runs in the connected MERN application.'));
$('#quick-reserve').addEventListener('submit',event=>{event.preventDefault();openBooking($('#reserve-date').value,$('#reserve-time').value,$('#reserve-guests').value)});
document.querySelectorAll('[data-book]').forEach(btn=>btn.addEventListener('click',()=>openBooking()));
$('#close-dialog').addEventListener('click',()=>$('#booking-dialog').close());
$('#booking-form').addEventListener('submit',event=>{event.preventDefault();$('#booking-dialog').close();notify('Demo request submitted — no real booking was created');$('#booking-form').reset()});
$('#nav-hamburger').addEventListener('click',()=>$('#site-links').classList.toggle('open'));
document.querySelectorAll('#site-links a').forEach(a=>a.addEventListener('click',()=>$('#site-links').classList.remove('open')));
renderDishes();renderCart();
