const f=document.getElementById('cf'),m=document.getElementById('fm');
f.onsubmit=e=>{e.preventDefault();const n=nm.value.trim(),em=document.getElementById('em').value.trim(),s=ms.value.trim();m.className='';
if(!n||!/^\S+@\S+\.\S+$/.test(em)||s.length<10){m.className='err';m.textContent='Please add your name, a valid email and a message of at least 10 characters.';return}
m.className='ok';m.textContent='Thank you, '+n+'! We will reply within one working day.';f.reset()};
