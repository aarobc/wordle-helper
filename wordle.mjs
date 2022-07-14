import ask from './prompt.mjs'
import {yesQuery, determination, exDex} from './util.mjs'
import fs from 'fs/promises'

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

    let pct = ml.length && (ml.length / ttw.length)

    // hack to derank words with dupes
    const dupes = countDupes(word)
    pct = dupes ? pct + 1 : pct

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

function filter(words, tq, omit, req){
  return words
    .filter(w => !omit.some(l => w.includes(l)))
    .filter(w => req.every(l => w.includes(l)))
    .filter(w => w.match(tq))
}

red()

// or crane
// or salet
// or trace
// or crate
async function red(list){
  // first step of the loop
  list ||= await validWords()

  const attempted = await ask(`attempted word: `)
  const approx = await ask(`aproximate matches: `)
  let req = approx.split('')
  const ex = await ask(`exact maching letters: `)
  req = [...req, ...ex.split('')]

  const approxCh = approx.split('')
  const exactCh = ex.split('')

  // determine if there ar duplicates
  const intersectApprox = approxCh.filter(value => exactCh.includes(value))

  let exactAddl = []
  if(intersectApprox.length){
    exactAddl = await exDex(intersectApprox, exact, ask)
  }

  let {omit, about, exact} = determination(attempted, approx, ex, exactAddl)
  const yq = yesQuery(exact, about, 5)

  console.log('query: ', yq)

  let bf = filter(list, yq, omit, req)
  let sorted = sort(bf)
  console.log('potential matches:', sorted)

  return red(sorted)
}

function countDupes(word){
  const r = {}
  word.split('').forEach(l => {
    const ev = r[l] ?? -1
    r[l] = ev + 1
  })
  return Object.values(r).reduce((c,v) => c +v)
}
