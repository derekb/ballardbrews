const cloudburst = require('./scrapers/cloudburst')

const beers = await cloudburst.getBeers()

console.log(beers)