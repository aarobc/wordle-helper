
function combRep(arr, l) {
  if(l === void 0) l = arr.length 

  let data = Array(l)             
  let  results = []               

  const f = function*(pos, start){     
    if(pos === l) {               
      const tr = data.slice()
      yield tr
      return
    }
    for(var i=start; i<arr.length; ++i) {
      data[pos] = arr[i]
      yield * f(pos+1, i)       
    }
  }

  return f(0, 0)                      
}

// const res = combRep('-+*/'.split(''), 5)
// console.log('np', res.next())
// console.log('np', res.next())
//
// for(let tt of res){
//   console.log('tt', tt)
// }

function* possibleSym(p){
  console.log('yeet')
  for(let i = 1; i <= p.length; i++){
    console.log('pos', i)
    // const res = combRep('-+*/'.split(''), 1)
    yield * combRep('-+*/'.split(''), i)
  }
}

export {combRep}
// const ia = possible('-+*/')
// console.log('np', ia.next())
// console.log('np', ia);

// for(let tt of ia){
//   console.log('tt', tt)
// }
//
