let fortunes = null
let grammar = null

export async function loadData(){

const lang = localStorage.getItem("zoltarLang") || "en"

const fortuneRes = await fetch(`data/fortunes-${lang}.json`)
fortunes = await fortuneRes.json()

const grammarRes = await fetch(`data/procedural-${lang}.json`)
grammar = await grammarRes.json()

}

function pick(arr){
return arr[Math.floor(Math.random()*arr.length)]
}

function jsonFortune(){

const roll=Math.random()

if(roll<0.6)
return pick(fortunes.good)

if(roll<0.8)
return pick(fortunes.lucky)

return pick(fortunes.jokes)

}

/* grammar engine */

function grammarFortune(){

const pattern=pick(grammar.patterns)

return pattern
.replace("[subject]",pick(grammar.subjects))
.replace("[action]",pick(grammar.actions))
.replace("[object]",pick(grammar.objects))
.replace("[modifier]",pick(grammar.modifiers))

}

/* main generator */

export function generateFortune(){

if(!fortunes||!grammar)
return "The spirits are gathering..."

return Math.random()<0.6
?jsonFortune()
:grammarFortune()

}