import { BreweryScraper } from "./scrapers/BreweryScraper";
import { Cloudburst } from "./scrapers/Cloudburst";
import { Reubens } from "./scrapers/Reubens";
import express from "express";

let cloudburst = new Cloudburst();
let reubens = new Reubens();

let scrapers: BreweryScraper[] = [cloudburst, reubens];

const app = express();
const port = 8080;

app.get("/", async (req, res) => {
  let beers = await Promise.all(
    scrapers.flatMap((x) => x.getBeers())
  ).then((beers) => beers.flatMap((x) => x));

  res.send(beers);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
