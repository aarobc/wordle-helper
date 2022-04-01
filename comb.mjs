
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

export {combRep}
