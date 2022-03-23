import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('close', () => process.exit(0))

export default function ask(q){
  return new Promise((res, rej) => {
    rl.question(q, res)
  })
}
