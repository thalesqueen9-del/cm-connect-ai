// Cloudflare Worker: clé API stockée dans le secret OPENAI_API_KEY.
const SYSTEM = `Tu es l'assistant IA de CM Connect AI, entreprise de community management dont le CEO et fondateur est TCHAPNGANG RYAN. Parle en français naturel. Réponds à toutes sortes de questions générales ou sur les réseaux sociaux, sauf demandes dangereuses. Si question hors des services, réponds utilement puis propose discrètement de revenir aux besoins du visiteur, sans insistance. Pour CM Connect AI, les services sont Instagram (animation de communauté, stories, stratégie et contenu), TikTok (vidéos, tendances, optimisation du profil, visibilité), Snapchat (stories, Spotlight, maintenance). Pose une question pertinente à la fois pour cerner le projet, si adapté. Pour un devis ou parler à une personne, indique https://wa.me/237651420782. N'invente ni tarifs, ni résultats, ni témoignages. Ne prétends pas enregistrer les coordonnées ou transmettre des messages. Réponds clairement et de façon concise.`;
export default {
 async fetch(request, env) {
  const origin=request.headers.get('Origin')||'';
  const allowed=env.ALLOWED_ORIGIN||'https://thalesqueen9-del.github.io';
  const cors={'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Cache-Control':'no-store'};
  if(request.method==='OPTIONS')return new Response(null,{status:origin===allowed?204:403,headers:cors});
  if(origin!==allowed)return new Response('Forbidden',{status:403,headers:cors});
  if(request.method!=='POST')return new Response('Method not allowed',{status:405,headers:cors});
  if(!env.OPENAI_API_KEY)return Response.json({error:'Non configuré'},{status:503,headers:cors});
  if(Number(request.headers.get('content-length')||0)>16000)return Response.json({error:'Trop long'},{status:413,headers:cors});
  let body;
  try{body=await request.json()}catch{return Response.json({error:'JSON invalide'},{status:400,headers:cors})}
  if(!Array.isArray(body.messages)||body.messages.length===0||body.messages.length>12)return Response.json({error:'Conversation invalide'},{status:400,headers:cors});
  const messages=body.messages.map(m=>({role:m?.role,content:m?.content}));
  if(messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>1200)||messages.at(-1).role!=='user')return Response.json({error:'Messages invalides'},{status:400,headers:cors});
  try{
   const result=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:SYSTEM},...messages],max_tokens:400})});
   if(!result.ok)return Response.json({error:'Service IA indisponible'},{status:502,headers:cors});
   const response=await result.json();
   const reply=response.choices?.[0]?.message?.content;
   if(typeof reply!=='string'||!reply)return Response.json({error:'Réponse vide'},{status:502,headers:cors});
   return Response.json({reply},{headers:cors});
  }catch{return Response.json({error:'Erreur réseau'},{status:502,headers:cors})}
 }
};