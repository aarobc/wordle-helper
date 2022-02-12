import cheat from './cheat.mjs'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('close', () => process.exit(0))

const ask = (q) => new Promise((res, rej) => {
  rl.question(q, res)
})

while(cheat.matches.length > 2){
  await red()
}

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

  cheat.matches = bf
  let bf = runSearch(yq)
  console.log('potential matches:', bf)
}

