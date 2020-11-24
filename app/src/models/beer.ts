interface Beer {
    name: string;
    abv: number;
    ibu?: number;
    style: string;
    formFactor: FormFactor[];
}

enum FormFactor {
    Growler,
    Crowler,
    FourPack,
    SixPack,
    TallBottle,
    Unknown
}

export { Beer, FormFactor }