import { Beer } from "../models/Beer";

export interface BreweryScraper {
  getBeers(): Promise<Beer[]>;
  getBreweryName(): string;
}
