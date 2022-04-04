
export function combRep(arr, l) {
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

function strPer(str, ld = 0){
  if (str.length == 1){
    return [str]
  }

  return str.split('').reduce((acc, letter, i) => {
      const trs = str.slice(0, i) + str.slice(i + 1)
      const tp = strPer(trs, ld + 1).map(val => letter + val)
    // console.log({trs, tp})

    return [ ...acc, ...tp]
  }, [])
}

export function stringPermutations(str){
  const pers = strPer(str)
  return pers.filter((item, i)=> pers.indexOf(item) === i)
}

export function* allPossible(arr, l){
  const pos = combRep(arr, l)

  for(let first of pos){
    const tov = stringPermutations(first.join('')).map(v => v.split(''))
    for(let vv of tov){
      yield vv
    }
  }
}
