
function yesQuery(exact, about, l = 8){

  const res = []
  for(let i = 0; i < l; i++){
    if(exact[i]){
      res[i] = exact[i]
      continue
    }

    const ab = about[i]

    if(ab?.length){
      res[i] = excludeQuery(ab)
      continue
    }
    res[i] = '.'
  }
  return res.join('')
}

function excludeQuery(tm){
    return `[^${tm.join('|')}]`
}

function notPlace(word, approx){

  const about = []
  approx.split('').forEach(letter =>{
    const d = word.indexOf(letter)
    if(d == -1){
      return
    }
    // console.log('about?', about[d], letter)
    about[d] = [...about[d] || [], ...letter ] 
  })
  return about
}

function determineOmit(attempted, approx, ex){
  const both = `${approx}${ex}`
  return attempted.split('').filter(w => !both.includes(w))
}

function determineExact(attempted, ex, exact){
  // determine the placement of the exact matches
  attempted.split('').forEach((l, i) => {
    if(ex.includes(l)){
      // hmm, what if it's not the first match tho?
      const re = new RegExp(l)
      ex = ex.replace(re, '')
      exact[i] = l
    }
  })
  return exact
}

const exDex = async (intersect, ask) => {
  const exact = []
  for(let letter of intersect){
    const index = await ask(`Index of exact match for '${letter}': `)
    const tint = parseInt(index) 
    exact[tint] = letter
  }
  return exact
}

function determination(attempted, approx = [], ex = [], exact = []){
  const omit = determineOmit(attempted, approx, ex)
  exact = determineExact(attempted, ex, exact)
  const about = notPlace(attempted, approx)

  return {omit, exact, about}
}

export {yesQuery, notPlace, determination, exDex}
