export function typeText(screen,text){

    screen.innerText=""
    
    let i=0
    
    const interval=setInterval(()=>{
    
    if(i<text.length){
    
    screen.innerText=text.substring(0,i+1)
    i++
    
    }else{
    
    clearInterval(interval)
    
    }
    
    },40)
    
    }