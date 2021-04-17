const generateIntervalObject = (max, interval) => {
  let finalResult = []
  for (let i = 0; i < max; i += interval) {
    i + interval <= max &&
    finalResult.push({
      min: i,
      max: i + interval
    })
  }
  
  return finalResult
}

module.exports = generateIntervalObject