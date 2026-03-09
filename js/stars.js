const starfield = document.getElementById("starfield")

for(let i=0;i<120;i++){

const star=document.createElement("div")
star.className="star"

const size=Math.random()*2+1

star.style.width=size+"px"
star.style.height=size+"px"

star.style.left=Math.random()*100+"vw"
star.style.top=Math.random()*100+"vh"

star.style.animationDelay=Math.random()*3+"s"

starfield.appendChild(star)

}