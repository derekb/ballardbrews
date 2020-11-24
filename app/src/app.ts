import { Cloudburst } from './scrapers/cloudburst'
import { Reubens } from './scrapers/reubens'

Cloudburst.getBeers()
    .then(beers => console.log(beers))
Reubens.getBeers()
    .then(beers => console.log(beers))
