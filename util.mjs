
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

function notPlace(word, approx, about){

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

function determineOmit(attempted, approx, ex, omit){
  const both = `${approx}${ex}`

  const o = attempted.split('').filter(w => !both.includes(w))
  return [...omit, ...o] 
}

function determineExact(attempted, ex, exact){
  // determine the placement of the exact matches
  const b = attempted.split('').forEach((l, i) => {
    if(ex.includes(l)){
      exact[i] = l
    }
  })
  return exact

}

function determination(attempted, approx, ex, omit, exact, about){
  omit = determineOmit(attempted, approx, ex, omit)
  exact = determineExact(attempted, ex, exact)
  about = notPlace(attempted, approx, about)

  return {omit, exact, about}
}

export {yesQuery, notPlace, determination}
