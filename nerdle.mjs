import ask from './prompt.mjs'
import {yesQuery, determination, exDex} from './util.mjs'

let omit = []
let req = []
let exact = []
let about = []

console.log('start')
const validNumbers = '23678'
const numNum = 5
const validSymbols = '-/'
const eqs = -1


// main()


// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/stringPermutations.md
function stringPermutations(str, ld = 0){
  if (str.length == 1) return [str]

  return str.split('').reduce((acc, letter, i) => {
      const trs = str.slice(0, i) + str.slice(i + 1)
      const tp = stringPermutations(trs, ld + 1).map(val => letter + val)

      return [ ...acc, ...tp]
  }, [])
}

function validPlacements(num, [ sym, ...osim]){

  let res = []
  if(!sym){return [num]}
  if(!num){return res}


  for(let i=1; i <= num.length -1; i++){

    const trs = num.slice(0, i) + sym
    const lh =  num.slice(i)

    const to = validPlacements(lh, osim)
      .map(iv => trs + iv)

    res = [...res, ...to]
  }

  return res
}


function thePlacement(nums, syms){

  let tr = []
  for(let num of nums){
    for(let sym of syms){
      const m = mte(num, sym, eqs)
      tr = [...tr, ...m]
    }
  }
  return tr
}

function mte(num, sym, lp = -1){
  const lh = num.slice(lp)
  const fh =  num.slice(0, lp)
  return validPlacements(fh, sym).map(p => `${p}==${lh}`)
}

function evalIt(eq){
const tig = /^0|[^0-9]0/
  return !eq.match(tig) && eval(eq) && eq
}


function main() {

  const numbers = potential(validNumbers, numNum)

  console.log('numbers', numbers)
  const symbols = stringPermutations(validSymbols)
  const place = thePlacement(numbers, symbols)
    .filter(n => !n.match(/[^0-9]0/))

  console.log('place', place)

  const ev = place.filter(evalIt)

  console.log('ev', ev)
}

function runSearch({re, omit, exact, about}){

  // required to come up with plausable first run
  const possible = '1234567890'.split('').filter(w => !omit.includes(w))
  console.log({possible})
}


//    9*8-7=65
//    0+12/3=4

red()

async function red(){
  const attempted = await ask(`attempted equation: `)
  const approx = await ask(`aproximate matches: `)
  req = [...req, ...approx.split('')]
  const ex = await ask(`exact matches: `)
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

  console.log(tr)
  const re = yesQuery(exact, about, 8)
    // .replace('=', '==')

  console.log('query: ', re)
  let bf = runSearch({re, ...tr})
  console.log('potential matches:', bf)
  red()
}

function potential(valid, len = 5){

  console.log('valid', valid, valid.includes('5'))
  const tm = valid.split('')
    .map(v => parseInt(v))
    .sort((a,b) => b - a)
    .filter(v => v)

  const [mm] = tm
  const [mmin] = tm.reverse()
  console.log('tm', tm, 'mmin', mmin)

  const tam  = parseInt(`${mm}`.repeat(len))
  const tmin  = parseInt(mmin + (valid.includes('0') ? '0' : `${mmin}`).repeat(len -1))
  console.log('tam', tam)
  console.log('tmin', tmin)

  const tl = []

  const valids = valid.split('')
  for(let i = tmin; i<=tam; i++){
    const common = `${i}`.split('').every(v => valid.includes(v))
    const oc = valids.every(v => `${i}`.includes(v))
    if(common && oc){
      tl.push(`${i}`)
    }
  }

  return tl
}

// function potential(valid, len = 5){
//
//   console.log('valid', valid, valid.includes('5'))
//   const tm = valid.split('')
//     .map(v => parseInt(v))
//     .sort((a,b) => b - a)
//     .filter(v => v)
//
//   const [mm] = tm
//   const [mmin] = tm.reverse()
//   console.log('tm', tm, 'mmin', mmin)
//
//   const tam  = parseInt(`${mm}`.repeat(len))
//   const tmin  = parseInt(mmin + (valid.includes('0') ? '0' : `${mmin}`).repeat(len -1))
//   console.log('tam', tam)
//   console.log('tmin', tmin)
//
//   const tl = []
//
//   const valids = valid.split('')
//   for(let i = tmin; i<=tam; i++){
//     const common = `${i}`.split('').every(v => valid.includes(v))
//     const oc = valids.every(v => `${i}`.includes(v))
//     if(common && oc){
//       tl.push(`${i}`)
//     }
//   }
//
//   return tl
// }
