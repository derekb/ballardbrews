import { Beer, FormFactor } from "../models/beer";
import cheerio from "cheerio";
import got from "got";
import { BreweryScraper } from "./BreweryScraper";

export class Reubens implements BreweryScraper {
  async getBeers(): Promise<Beer[]> {
    let { body } = await got("https://reubensbrews.com/tap-list-taproom/");

    return this.parseBeers(body);
  }

  getBreweryName(): string {
    return "Reuben's Brews";
  }

  private parseBeers(data: string): Beer[] {
    let $ = cheerio.load(data);

    let parseCategory = (category: cheerio.Element): Beer[] => {
      let categoryName = $(".tap-list-category-block-title", category)
        .text()
        .trim();
      let beers = $(".tap-list-beer", category)
        .toArray()
        .map((x) => parseBeer(x, categoryName));

      return beers;
    };

    let parseBeer = (rawBeer: cheerio.Element, categoryName: string): Beer => {
      let name = $(".the-tl-beer-name", rawBeer).text().trim();
      let abv = $(".tl-abv-ibu .tl-abv-number", rawBeer).text().trim();
      let formFactors = getFormFactor(rawBeer);

      return {
        name: name,
        abv: parseInt(abv),
        ibu: undefined,
        style: categoryName,
        formFactor: formFactors.map(this.sanitizeFormFactor),
        breweryName: this.getBreweryName(),
      };
    };

    let getFormFactor = (formatData: cheerio.Element) => {
      if (!formatData) {
        return [];
      }

      return $(".tl-vessel-type", formatData)
        .children(".holder")
        .toArray()
        .map((x) => x.attribs["class"].split(" ")[0]);
    };

    let isBeerCategory = (category: cheerio.Element): boolean => {
      let categoryName = $(".tap-list-category-block-title", category)
        .text()
        .trim();

      switch (categoryName.toUpperCase()) {
        case "FRUITFIZZ HARD SELTZER":
        case "CIDER":
          return false;
        default:
          return true;
      }
    };

    let categories = $(
      ".the-tap-list div.tap-list-beer-category-block"
    ).toArray();

    return categories.filter(isBeerCategory).flatMap(parseCategory);
  }

  private removeUndefined(input: (string | undefined)[]): string[] {
    const result: string[] = [];
    input.forEach((x) => {
      if (x) {
        result.push(x);
      }
    });
    return result;
  }

  private sanitizeFormFactor(input: string | undefined) {
    switch (input) {
      case "bottle-holder":
        return FormFactor.TallBottle;
      case "can-holder":
        return FormFactor.FourPack;
      case "growler-holder":
        return FormFactor.Growler;
      default:
        return FormFactor.Crowler;
    }
  }
}
