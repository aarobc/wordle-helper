import {allPossible, stringPermutations} from './comb.mjs'
import {yesQuery, determination, exDex} from './util.mjs'
import ask from './prompt.mjs'

let omit=[], exact=[], about =[], req=[]

let firsts = ['9*8-7=65', '0+12/3=4']

red()

// const o = extra(['a', 'b', 'c'], 2)
// console.log(o)

async function red(){
  const f = firsts?.shift() || ''
  const attempted = (await ask(`attempted equation: ${f}`)) || f

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

  console.log({...tr, re})

  if(!firsts.length){
    const p = possible(tr, re)
    console.log('p', p)
  }
  red()
}

function possible({omit, exact, about}, re){
  // console.log({omit, exact, about})
  const tdv = [...exact, ...about.flat()].filter(v => v).filter(v => v != '=')
  const unique = tdv.filter((v, i, self) => self.indexOf(v) === i)

  // removed =, so we want it to be 7 long.
  const len = 7 - exact.filter(v => v != '=').length - unique.length 

  // generate a list of the possible combinations
  const o = extra(unique, len)
  const res = []

  const toItr = iterate(o, exact)
  for(const eq of toItr){
    const m = evalIt(eq) 
      // && eq.match(re)
    if(m){
      console.log('aoeu', m)
      res.push(eq)
    }

    if(res.length > 10){
      break
    }
  }
  return res
}

function* iterate(o, exact){
  for(const set of o){
    const tov = stringPermutations(set.join('')).map(v => v.split(''))
    for(const red of tov){
      let rez = zip(red, exact)
      yield rez.join('')
    }
  }
}

function zip(nums, exact){
  const res = []
  for(let i = 0; i < 8; i++){
    const tv = exact[i] || nums.shift() 
    res.push(tv)
  }
  return res
}

function evalIt(eq){
  const tig = /^0|[^0-9]0/
  const noTouch = /\D\D|^\D|\D$/ 
  return !eq.match(tig) 
    && !eq.match(noTouch) 
    && eval(eq.replace('=', '==')) && eq
}

function extra(vals, num){
  num--
  const af = vals.map(v => [...vals, v])
  return num 
    ? af.map(v => extra(v, num -1)).flat() 
    : af
}
