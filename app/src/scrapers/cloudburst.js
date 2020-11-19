const cheerio = require('cheerio')
const got = require('got')

async function getBeers() {
    let {body} = await got('https://cloudburstbrew.com/location/5456-shilshole-ave-nw/#on-tap')

    return parseBeers(body)
}

function parseBeers(data) {
    let $ = cheerio.load(data)

    let togo = $('.taplist')[1]
    let beers = $('.list-item', togo).toArray()

    let parseBeer = (rawBeer) => {
        let name = $('.item-title', rawBeer).text().trim()
        let abv = $('.item-abv', rawBeer).text().trim()
        let ibu = $('.item-ibu .value', rawBeer).text().trim()
        let style = $('.item-descriptor', rawBeer).text().trim()
        let formFactors = getFormFactor(rawBeer)
    
        return {
            name: name,
            abv: abv,
            ibu: ibu,
            style: style,
            formFactor: formFactors.map(sanitizeFormFactor)
        }
    }

    let getFormFactor = (formatData) => {
        if (!formatData) {
            return []
        }

        return $('.item-meta .format-icons img', formatData).toArray().map(x => $(x).attr("alt"))
    }

    return beers.map(parseBeer)
}

function sanitizeFormFactor(input) {
    switch (input) {
        case '16oz 4-pack icon':
            return '16oz 4-pack'
        case 'crowler icon':
            return 'crowler';
        default:
            break;
    }
}

exports.getBeers = getBeers