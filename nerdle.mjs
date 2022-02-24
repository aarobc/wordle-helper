// import readline from 'readline'

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

// rl.on('close', () => process.exit(0))

let omit = []
let req = []
let exact = []
let about = []




// TODO: more than just permutations

// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/stringPermutations.md
const stringPermutations = (str, ld = 0) => {
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

const tig = /^0|[^0-9]0/
function evalIt(eq){
  // eq.match(/^0|=0/)
  // const an = eval(eq)
  return !eq.match(tig) && eval(eq) && eq
  // return an && eq
}

// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/stringPermutations.md
console.log('start')
const validNumbers = "23459"
const validSymbols = "-";
const eqs = -2

const numbers = stringPermutations(validNumbers)
  .filter(n => n.match(/^9/))
//
console.log('numbers', numbers)
const symbols = stringPermutations(validSymbols)
const place = thePlacement(numbers, symbols)
// console.log('place', place)

const ev = place.filter(evalIt)
console.log('ev', ev)


const ask = (q) => new Promise((res, rej) => {
  rl.question(q, res)
})

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

//    9*8-7=65
//    0+12/3=4

async function red(){

  const attempted = await ask(`attempted equation: `)
  const approx = await ask(`aproximate matches: `)
  req = [...req, ...approx.split('')]
  const ex = await ask(`exact matches: `)
  req = [...req, ...ex.split('')]

  const approxCh = approx.split('')
  const exactCh = ex.split('')
}
