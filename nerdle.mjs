import ask from './prompt.mjs'
import {yesQuery, determination} from './util.mjs'
import {combRep} from './comb.mjs'

let omit = []
let req = []
let exact = []
let about = []
let f = '9*8-7=65'

console.log('start')
const validNumbers = '234589'
const numNum = 6
const validSymbols = '+-*'
const eqs = -2

// 9*8-7=65
// main()
red()


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


function thePlacement(nums, syms, eqs){

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
  // console.log('num, sym', num, sym)
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
  const place = thePlacement(numbers, symbols, eqs)
    .filter(n => !n.match(/[^0-9]0/))

  console.log('place', place)

  const ev = place.filter(evalIt)

  console.log('ev', ev)
}

function equalLocation(posssible, about){
  const eqd = exact.indexOf('=')
  if(eqd != -1){
   return -7 + eqd 
  }

  const abt = about.indexOf('=')
  return abt == 5 ? -2 : -1

}

function* iterate(numsCb, symsCb, eqs){

  const nums = numsCb()
  for(let num of nums){
    const syms = symsCb()
    for(let sym of syms){
      // console.log('num', num, sym)
      const m = mte(num.join(''), sym, eqs)
      for (let v of m){
        yield v
      }
    }
  }
}

// function runSearch({re, omit, exact, about}){
//
//   // required to come up with plausable first run
//   const possible = '1234567890'.split('').filter(w => !omit.includes(w))
//   const possibleS = '-+*/'.split('').filter(w => !omit.includes(w))
//
//   console.log('possible symbols', possibleS)
//   console.log('possible numbers', possible)
//
//   const eqs = equalLocation(possible, about)
//   const p = potent(omit, 4, 6)
//   const syms = possibleSym(possibleS)
//
//   const mb = []
//   const ira = iterate(p, syms, eqs)
//   for(let item of ira){
//     console.log({item})
//     if(mb.length > 10){
//       break
//     }
//     mb.push(item)
//   }
//   // if we know the exact eqs:
//   // let eqs = exact[5] == '=' ? -2 : -1
//   console.log({possible, eqs})
// }

function crs({re, omit, exact, about}){

  // required to come up with plausable first run
  const possible = '1234567890'.split('').filter(w => !omit.includes(w))
  const possibleS = '-+*/'.split('').filter(w => !omit.includes(w))

  console.log('possible symbols', possibleS)
  console.log('possible numbers', possible)

  const mb = []
  const eqs = equalLocation(possible, about)
  // const p = potent(omit, 4, 6)
  for(let i = 4; i <= 6; i++){
    const tov = 7 - i
    const nums = () => combRep(possible, i)
    const syms = () => combRep(possibleS, tov)

    const ira = iterate(nums, syms, eqs)

    let l = ''
    for(let item of ira){
      // console.log({item})
      if(mb.length > 10){
        break
      }
      // console.log('item', item)
      // l = item
      const m = item.replace('==', '=').match(`/${re}/`)

      console.log('em', m)
      break;
      return
      evalIt(item) && m && mb.push(item)
      // mb.push(item)
    }
    // console.log('eye', i)
    // console.log('last', l)
  }

  console.log('re', re)
  return mb
}


//    9*8-7=65
//    0+12/3=4

const exDex = async (intersect, exact) => {
  for(let letter of intersect){
    const index = await ask(`Index of exact match for '${letter}': `)
    const tint = parseInt(index) 
    exact[tint] = letter
  }
  return exact
}


async function red(){
  const attempted = (await ask(`attempted equation: ${f}`)) || f
  f = ''

  const approx = await ask(`aproximate matches: `)|| '-5'  
  req = [...req, ...approx.split('')]
  const ex = await ask(`exact matches: `) || '9='
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

  const re = yesQuery(exact, about, 8)

  console.log('query: ', re)
  let bf = crs({re, ...tr})
  console.log('potential matches:', bf)
  red()
}

function* potent(omit, min=null, max=5){

  min ??= max
  const possible = '1234567890'.split('').filter(w => !omit.includes(w))

  console.log('valid', possible, possible.includes('5'))
  const tm = possible
    .map(v => parseInt(v))
    .sort((a,b) => b - a)
    .filter(v => v)

  const [mm] = tm
  const [mmin] = tm.reverse()
  console.log('tm', tm, 'mmin', mmin)

  const tam  = parseInt(`${mm}`.repeat(max))
  const tmin  = parseInt(mmin + (possible.includes('0') ? '0' : `${mmin}`).repeat(min -1))
  console.log('tam', tam)
  console.log('tmin', tmin)

  const tl = []

  // const valids = possible
  for(let i = tmin; i<=tam; i++){
    const exclude = `${i}`.split('').some(v => omit.includes(v))
    // console.log({exclude, omit, i})
    if(exclude){
      continue
    }
    // break
    yield i
    // break
    // const oc = valids.every(v => `${i}`.includes(v))
    // if(common && oc){
    //   tl.push(`${i}`)
    // }
  }

  // return tl
}

// function* possibleSym(p){
//   console.log('yeet')
//   for(let i = 1; i <= p.length; i++){
//     yield * combRep(p, i)
//   }
// }
//
// function* possibleNum(p){
//   console.log('yeet')
//   for(let i = 1; i <= p.length; i++){
//     yield * combRep('-+*/'.split(''), i)
//   }
// }
// potentialSymbols()

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
