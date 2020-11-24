import { Beer } from "../models/beer";

export interface BreweryScraper {
  getBeers(): Promise<Beer[]>;
  getBreweryName(): string;
}
