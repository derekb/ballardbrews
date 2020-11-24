import { Beer, FormFactor } from '../models/beer'
import cheerio from 'cheerio'
import got from 'got'

async function getBeers() {
    let {body} = await got('https://cloudburstbrew.com/location/5456-shilshole-ave-nw/#on-tap')

    return parseBeers(body)
}

function parseBeers(data: string): Beer[] {
    let $ = cheerio.load(data)

    let togo = $('.taplist')[1]
    let beers = $('.list-item', togo).toArray()

    let parseBeer = (rawBeer: cheerio.Element) : Beer => {
        let name = $('.item-title', rawBeer).text().trim()
        let abv = $('.item-abv', rawBeer).text().trim()
        let ibu = $('.item-ibu .value', rawBeer).text().trim()
        let style = $('.item-descriptor', rawBeer).text().trim()
        let formFactors = getFormFactor(rawBeer)
    
        return {
            name: name,
            abv: parseInt(abv),
            ibu: parseInt(ibu),
            style: style,
            formFactor: formFactors.map(sanitizeFormFactor)
        }
    }

    let getFormFactor = (formatData: cheerio.Element) => {
        if (!formatData) {
            return []
        }            
        
        return $('.item-meta .format-icons img', formatData)
            .toArray()
            .map(x => $(x).attr("alt"))
    }

    return beers.map(parseBeer)
}

function sanitizeFormFactor(input : string | undefined) {
    switch (input) {
        case '16oz 4-pack icon':
            return FormFactor.FourPack
        case 'crowler icon':
            return FormFactor.Crowler;
        default:
            return FormFactor.Crowler;
    }
}

export const Cloudburst = {
    getBeers
}