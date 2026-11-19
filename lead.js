// Cloudflare Pages Function. Configure BOT_TOKEN and CHAT_ID as environment secrets.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export async function onRequestPost({request,env}){
 if(!env.BOT_TOKEN||!env.CHAT_ID)return reply({error:'Форма ще не налаштована адміністратором.'},503);
 if(!(request.headers.get('content-type')||'').includes('application/json'))return reply({error:'Невірний формат запиту.'},415);
 if(Number(request.headers.get('content-length')||0)>12000)return reply({error:'Завеликий запит.'},413);
 let data;try{data=await request.json()}catch{return reply({error:'Некоректний запит.'},400)}
 if(!data||typeof data!=='object'||Array.isArray(data))return reply({error:'Некоректні дані.'},400);
 if(data.website)return reply({ok:true});
 const name=String(data.name||'').trim(),contact=String(data.contact||'').trim(),service=String(data.service||'').trim(),message=String(data.message||'').trim();
 if(!name||!contact||!service||name.length>100||contact.length>150||service.length>120||message.length>2000)return reply({error:'Перевірте поля форми.'},400);
 const text=`📩 <b>Нова заявка — System Agency</b>\n\n👤 <b>Ім'я:</b> ${esc(name)}\n📞 <b>Контакт:</b> ${esc(contact)}\n🛠 <b>Послуга:</b> ${esc(service)}\n📝 <b>Коментар:</b> ${esc(message||'Не вказано')}`;
 try{const res=await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:env.CHAT_ID,text,parse_mode:'HTML'})});if(!res.ok)return reply({error:'Помилка Telegram. Спробуйте пізніше.'},502);return reply({ok:true})}catch{return reply({error:'Сервіс тимчасово недоступний.'},502)}
}
