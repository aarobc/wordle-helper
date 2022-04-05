import ask from './prompt.mjs'
import {yesQuery, determination, exDex} from './util.mjs'
import {allPossible, stringPermutations} from './comb.mjs'

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
      const m = mte(num.join(''), sym, eqs).filter(item => item)
      for (let v of m){
        yield v
      }
    }
  }
}

function crs({re, omit, exact, about}){

  // required to come up with plausable first run
  const possible = '1234567890'.split('')
    .filter(w => !omit.includes(w))
  const possibleS = '-+*/'.split('')
    .filter(w => !omit.includes(w))

  console.log('query: ', re)
  console.log('possible symbols', possibleS)
  console.log('possible numbers', possible)
  console.log('required values', about)

  const mb = []
  const eqs = equalLocation(possible, about)
  for(let i = 4; i <= 6; i++){
    const tov = 7 - i
    const nums = () => allPossible(possible, i)
    const syms = () => allPossible(possibleS, tov)

    const ira = iterate(nums, syms, eqs)

    for(let item of ira){
      if(mb.length > 10){
        break
      }

      const itv = about.every(sym => item.includes(sym))
      const m = item.replace('==', '=').match(re)

      if(evalIt(item) && m && itv){ mb.push(item) }
    }
  }

  return mb
}

//    9*8-7=65
//    0+12/3=4
async function red(){
  const attempted = (await ask(`attempted equation: ${f}`)) || f
  f = ''

  const approx = await ask(`aproximate matches: `)
  req = [...req, ...approx.split('')]
  const ex = await ask(`exact matches: `)
  req = [...req, ...ex.split('')]

  const approxCh = approx.split('')
  const exactCh = ex.split('')

  // determine if there ar duplicates
  const intersect = approxCh.filter(value => exactCh.includes(value))

  if(intersect.length){
    exact = await exDex(intersect, exact, ask)
  }

  const tr = determination(attempted, approx, ex, omit, exact, about)
  omit = tr.omit
  exact = tr.exact
  about = tr.about

  const re = yesQuery(exact, about, 8).replace('*', '\\*')

  let bf = crs({re, ...tr})
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
