import { loadData, generateFortune } from "./fortuneEngine.js"
import { typeText } from "./typing.js"

const screen = document.getElementById("screen")
const askBtn = document.getElementById("askBtn")
const machine = document.getElementById("machine")
const coinBtn = document.getElementById("coinBtn")
const coinCounter = document.getElementById("coins")
const coinImg = document.getElementById("coinAnim")

const langEN = document.getElementById("langEN")
const langUK = document.getElementById("langUK")

const powerLost = localStorage.getItem("zoltarPowerLost")
const oracleArea = document.querySelector(".window-glass")

if (powerLost === "true") {
  machine.classList.add("power-off")
  screen.innerText = "⚡ The oracle has lost power. Insert coin tomorrow to restore it."
}

langEN.onclick = () => {
  localStorage.setItem("zoltarLang", "en")
  location.reload()
}

langUK.onclick = () => {
  localStorage.setItem("zoltarLang", "uk")
  location.reload()
}

let coins = 0
let unpaidClicks = 0
let rageClicks = parseInt(localStorage.getItem("zoltarRageClicks")) || 0

const angryLines = [
  "Zoltar is not a charity.",
  "The spirits demand payment.",
  "No candle - no mercy. No coin - no prophecy.",
  "Even magic has bills to pay."
]

const rageLines = [
  "ENOUGH! INSERT A COIN!",
  "Do you mock the ancient spirits?",
  "ZOLTAR SEES YOUR CHEAPNESS.",
  "THE ORACLE IS NOT AMUSED."
]

loadData()

/* ---------- INITIAL STATE ---------- */

const today = new Date().toDateString()
const lastUse = localStorage.getItem("zoltarLastUse")

if (lastUse === today) {
  coins = 0
  coinCounter.innerText = coins
  screen.innerText = "⚡ The oracle rests until tomorrow."
  oracleArea.classList.add("closed")
}

/* ---------- COIN INSERT ---------- */

coinBtn.onclick = () => {

  const today = new Date().toDateString()

  /* ---------- POWER RECOVERY ---------- */

  const powerLost = localStorage.getItem("zoltarPowerLost")

  if (powerLost === "true") {

    const lastRecovery = localStorage.getItem("zoltarRecovery")

    if (lastRecovery === today) {
      screen.innerText = "The oracle is still recovering today."
      return
    }

    localStorage.setItem("zoltarRecovery", today)
    localStorage.setItem("zoltarPowerLost", "false")

    coins = 0
    coinCounter.innerText = coins

    machine.classList.remove("power-off")

    screen.innerText = "⚡ Power restored. The spirits need rest today."

    coinBtn.disabled = true
    coinBtn.style.opacity = 0.5

    return
  }

  /* ---------- NORMAL COIN INSERT ---------- */

  const lastCoin = localStorage.getItem("zoltarLastCoin")

  if (lastCoin === today) {
    screen.innerText = "₿ You already inserted today's coin."
    coinBtn.disabled = true
    coinBtn.style.opacity = 0.5
    return
  }

  coins = 1
  coinCounter.innerText = coins

  localStorage.setItem("zoltarLastCoin", today)

  unpaidClicks = 0
  machine.classList.remove("angry")

  screen.innerText = "₿ Coin accepted."

  /* coin shake animation */

  coinImg.style.display = "block"
  coinImg.classList.remove("shake-coin", "drop-coin")
  void coinImg.offsetWidth
  coinImg.classList.add("shake-coin")
}

/* ---------- ASK ZOLTAR ---------- */

askBtn.onclick = () => {

  const today = new Date().toDateString()

  /* oracle exhausted */

  if (rageClicks >= 7) {

    machine.classList.add("power-off")
    screen.innerText = "⚡ The oracle has lost power..."

    localStorage.setItem("zoltarPowerLost", "true")
    return
  }

  /* no coin */

  if (coins <= 0) {

    unpaidClicks++
    rageClicks++

    localStorage.setItem("zoltarRageClicks", rageClicks)

    machine.classList.add("shake")

    setTimeout(() => {
      machine.classList.remove("shake")
    }, 300)

    if (unpaidClicks < 3) {

      screen.innerText =
        angryLines[Math.floor(Math.random() * angryLines.length)]

    } else {

      screen.innerText =
        rageLines[Math.floor(Math.random() * rageLines.length)]

      machine.classList.add("angry")
        oracleArea.classList.add("closed")
    }

    return
  }

  /* already used today */

  const lastUse = localStorage.getItem("zoltarLastUse")

  if (lastUse === today) {

    screen.innerText = "The spirits have already spoken today."
    coins = 0
    coinCounter.innerText = coins
    return
  }

  /* consume coin */

  coins = 0
  coinCounter.innerText = coins

  /* coin drop animation */

  coinImg.classList.remove("shake-coin")
  void coinImg.offsetWidth
  coinImg.classList.add("drop-coin")

  setTimeout(() => {

    coinImg.style.display = "none"
    coinImg.classList.remove("drop-coin")

    /* consult spirits AFTER coin drop */

    screen.innerText = "Consulting the spirits..."
    screen.classList.add("glow")

    setTimeout(() => {

      const fortune = generateFortune()
      typeText(screen, fortune)

      localStorage.setItem("zoltarLastUse", today)

      /* stop glow */

      setTimeout(() => {
        screen.classList.remove("glow")
      }, 3000)

      /* reset rage */

      rageClicks = 0
      localStorage.setItem("zoltarRageClicks", 0)

    }, 7000)

  }, 800)

}
