import ask from './prompt.mjs'
import {yesQuery, determination, exDex} from './util.mjs'
import fs from 'fs/promises'

let omit = []
let req = []
let exact = []
let about = []

function validWords(){
  return fs.readFile('./wordle-list/words', { encoding: 'utf8' })
    .then(data => data.split('\n'))
}

function wordFrequency(words){
  return words.reduce((carry, word, d) => {
    // build query string for existing word list
    const q = word.split('')
      .map((l, i) => {
        const ph = '.....'.split('')
        ph[i] = l
        return ph.join('')
      })
      .join('|')
    // omit the current word from the search
    const ttw = [...words.slice(0,d), ...words.slice(d+1)]
    const ml = ttw.filter(w => w.match(q))

    const pct = ml.length && (ml.length / ttw.length)

    return [...carry, {
      word,
      len: ml.length,
      ttw: ttw.length,
      q,
      pct,
      dist: ml.length ? Math.abs(0.5 - pct) : 1
    }]
  }, [])
}

function sort(words){
  const freq = wordFrequency(words)
    .sort((a, b) => {
      return a.dist > b.dist ? 1 : -1
    })

  return freq.map(item => item.word)
}

function filter(words, tq){
  return words
    .filter(w => !omit.some(l => w.includes(l)))
    .filter(w => req.every(l => w.includes(l)))
    .filter(w => w.match(tq))
}

await red()

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
  const vw = await validWords()
  let bf = filter(vw, yq)
  let sorted = sort(bf)
  console.log('potential matches:', sorted)

  red()
}
