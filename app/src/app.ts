import { BreweryScraper } from './scrapers/BreweryScraper';
import { Cloudburst } from './scrapers/Cloudburst'
import { Reubens } from './scrapers/Reubens'

let cloudburst = new Cloudburst();
let reubens = new Reubens();

let scrapers : BreweryScraper[] = [ cloudburst, reubens ]

Promise
    .all(scrapers.flatMap(x => x.getBeers()))
    .then(beers => beers.flatMap(x => x))
    .then(beer => console.log(beer))