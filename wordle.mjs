import ask from './prompt.mjs'
import {yesQuery, determination, exDex} from './util.mjs'
import fs from 'fs/promises'

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
  return fs.readFile('./wordle-list/words', { encoding: 'utf8' })
    .then(data => data.split('\n'))
}

async function runSearch(tq){
  const valid = (await validWords())
    .filter(w => !omit.some(l => w.includes(l)))
    .filter(w => req.every(l => w.includes(l)))
    .filter(w => w.match(tq))

  const f = buildFrequency(valid)
  return frequency(f, valid)
    .sort((a,b) => {
      const ay = countDupes(a)
      const by = countDupes(b)
      return Math.sign(ay - by)
    })
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
    exact = await exDex(intersect, exact, ask)
  }

  const tr = determination(attempted, approx, ex, omit, exact, about)
  omit = tr.omit
  exact = tr.exact
  about = tr.about
  const yq = yesQuery(exact, about, 5)

  console.log('query: ', yq)
  let bf = await runSearch(yq)
  console.log('potential matches:', bf)
  red()
}


function rating(word, bf){
    return word.split('').reduce((carry, v) => {
      // we want closest to 0
      const r = Math.abs(0.5 - bf[v].pct)
      return carry + r
    }, 0)

}

function frequency(f, set){

  const tfs = set.sort((a, b) => {
    const rata = rating(a, f)
    const ratb = rating(b, f)
    return rata > ratb ? 1 : -1
  })
  return tfs
}

function buildFrequency(set){
  const alpha = Array.from(Array(26)).map((e, i) => String.fromCharCode(i + 97))

  return alpha.reduce((carry, value) => {
    const match = set.filter(word => word.includes(value))
    carry[value] = {qty: match.length, pct: (match.length / set.length).toPrecision(3)}
    return carry
  }, {})
}
