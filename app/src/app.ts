import { Cloudburst } from './scrapers/cloudburst'

Cloudburst.getBeers()
    .then(beers => console.log(beers))

