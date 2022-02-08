import allWords from './english-words/words_dictionary.json'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('close', () => process.exit(0))

let omit = []
let req = []
let exact = []
let about = []

function countDupes(word){
  const r = {}
  word.split('').forEach(l => {
    const ev = r[l] ?? -1 
    r[l] = ev + 1
  })
  return Object.values(r).reduce((c,v) => c +v)
}


function validWords(){
  const arr = Object.keys(allWords)
  return arr.filter(w => w.length == 5)
    .sort((a,b) => {
      const ay = countDupes(a)
      const by = countDupes(b)
      return ay < by ? -1 : 1
    })
}

function excludeQuery(tm){
    const j = tm.join('|')
    return `[^${j}]`
}


const ask = (q) => new Promise((res, rej) => {
  rl.question(q, res)
})



function yesQuery(){

  const res = []
  for(let i = 0; i < 5; i++){
    if(exact[i]){
      res[i] = exact[i]
      continue
    }

    const ab = about[i]

    if(ab?.length){
      const j = ab.join('|')
      res[i] = `[^${j}]`
      continue
    }
    res[i] = '.'
  }
  return res.join('')
}

function runSearch(tq){
  return validWords()
    .filter(w => !omit.some(l => w.includes(l)))
    .filter(w => req.every(l => w.includes(l)))
    .filter(w => w.match(tq))
}

function notPlace(word, approx){

  approx.forEach(letter =>{
    const d = word.indexOf(letter)
    if(d == -1){
      return
    }
    about[d] = [...about[d] || [], ...letter ] 
  })
  return about
}


const w = await red()

// start with adieu
// or crane
async function red(){

  const attempted = await ask(`attempted word: `)
  const approx = await ask(`aproximate matches: `)
  req = [...req, ...approx.split('')]
  const ex = await ask(`exact maching letters: `)
  req = [...req, ...ex.split('')]

  const both = `${approx}${ex}`

  const o = attempted.split('').filter(w => !both.includes(w))
  omit = [...omit, ...o] 
  // determine the placement of the exact matches
  const b = attempted.split('').forEach((l, i) => {
    if(ex.includes(l)){
      exact[i] = l
    }
  })

  const n = notPlace(attempted, approx.split(''))

  const yq = yesQuery()

  let bf = runSearch(yq)
  console.log('potential matches:', bf)
  red()
}

