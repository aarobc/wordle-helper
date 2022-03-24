import allWords from './english-words/words_dictionary.json' //assert {type: 'json'}
import ask from './prompt.mjs'
import {yesQuery, determination, exDex} from './util.mjs'

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

function runSearch(tq){
  return validWords()
    .filter(w => !omit.some(l => w.includes(l)))
    .filter(w => req.every(l => w.includes(l)))
    .filter(w => w.match(tq))
}

const w = await red()

// or crane
// or salet
// or trace
// or crate
async function red(){

  const attempted = await ask(`attempted word: `)
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
    exact = await exDex(intersect, exact)
  }

  const tr = determination(attempted, approx, ex, omit, exact, about)
  omit = tr.omit
  exact = tr.exact
  about = tr.about
  const yq = yesQuery(exact, about, 5)

  console.log('query: ', yq)
  let bf = runSearch(yq)
  console.log('potential matches:', bf)
  red()
}

