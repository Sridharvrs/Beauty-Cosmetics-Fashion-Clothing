// Home: extra interaction - parallax hero image
addEventListener('scroll',()=>{const i=document.querySelector('.hbg');if(i)i.style.transform='translateY('+scrollY*.25+'px)'});
