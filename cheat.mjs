import allWords from './english-words/words_dictionary.json' assert { type: 'json' }
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
let f = true
const autoFirst = 'crane'

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

let matches = validWords()

const ask = (q) => new Promise((res, rej) => {
  rl.question(q, res)
})

function excludeQuery(tm){
    return `[^${tm.join('|')}]`
}

function yesQuery(){

  const res = []
  for(let i = 0; i < 5; i++){
    if(exact[i]){
      res[i] = exact[i]
      continue
    }

    const ab = about[i]

    if(ab?.length){
      res[i] = excludeQuery(ab)
      continue
    }
    res[i] = '.'
  }
  return res.join('')
}

function runSearch(tq){
  return matches
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

const mapSerial = (posts, method) => {

    var retd = []
    return Promise.reduce(posts, (pac, post) =>{
        retd.push(pac)
        return method(post)
    }, 0)
    .then(val =>{
        retd.push(val)
        retd.shift()
        return retd
    })
}

const exDex = async (intersect) => {
    for(let letter of intersect){
      const exDex = await ask(`Index of exact match for '${letter}': `)
      const tint = parseInt(exDex) 
      exact[tint] = letter
    }
}


red()

// start with adieu
// or crane
async function red(){


  const addl = f ? `(${autoFirst})` : ''
  f = false
  const attempted = (await ask(`attempted word: ${addl}`)) || autoFirst 
  const approx = await ask(`aproximate matches: `)
  req = [...req, ...approx.split('')]
  const ex = await ask(`exact maching letters: `)
  req = [...req, ...ex.split('')]

  const approxCh = approx.split('')
  const exactCh = ex.split('')
  // determine if there ar duplicates
  const intersect = approxCh.filter(value => exactCh.includes(value))

  // intersect.length && await exDex(intersect)
  if(intersect.length){
    await exDex(intersect)
  }

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

