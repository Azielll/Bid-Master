export class Model {
    itemsToAuction: Item[]

    // Auction BidMaster
    //
    // Keep track of Items being auctioned
    constructor() {
        this.itemsToAuction = [
            new Item('1', "Antique Vase"),
            new Item('2', "Vintage Watch"),
            new Item('3', "Painting by Famous Artist"),
        ]
    }

    addItemToAuction(item: Item) {
        this.itemsToAuction.push(item)
    }
}

export class Item {
    name : string
    description : string

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}