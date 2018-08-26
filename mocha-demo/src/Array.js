function sum (...res) {
  let sum = 0
  for (let i = 0; i < res.length; i++) {
    sum += res[i]
  }
  return sum
}

exports.sum = sum
