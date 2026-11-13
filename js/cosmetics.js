const lp=document.querySelector('#lip path'),sn=document.querySelector('#shn');
document.querySelectorAll('.sw').forEach(b=>b.onclick=()=>{document.querySelectorAll('.sw').forEach(x=>x.classList.remove('on'));b.classList.add('on');lp.setAttribute('fill',b.dataset.c);sn.textContent=b.dataset.n});
const ba=document.getElementById('ba'),r=ba.querySelector('input'),af=ba.querySelector('.after');
r.oninput=()=>{af.style.clipPath='inset(0 0 0 '+r.value+'%)';ba.style.setProperty('--p',r.value+'%')};
