export class Model {
    itemsToAuction: Item[]
    soldItems: Item[]
    isAuctionStarted: boolean = false
    currentItem: Item | null = null
    totalFundsRaised: number = 0

    // Auction BidMaster
    //
    // Keep track of Items being auctioned
    constructor() {
        this.itemsToAuction = []
        this.soldItems = []
        this.isAuctionStarted = false
        this.currentItem = null
        this.totalFundsRaised = 0
    }

    addItemToAuction(item: Item) {
        this.itemsToAuction.push(item)
    }
    startAuction() {
        if(this.isAuctionStarted == false && this.itemsToAuction.length > 0) {
            this.isAuctionStarted = true
            this.currentItem = this.itemsToAuction[0]
            this.itemsToAuction.shift()
        }
    }
    getTotalFundsRaised() {
        return "$" + this.totalFundsRaised.toFixed(2)
    }
    sellCurrentItem() {
        if(this.currentItem !== null) {
            this.soldItems.push(this.currentItem)
            this.totalFundsRaised += this.currentItem.initialPrice
            if(this.itemsToAuction.length > 0) {
                this.currentItem = this.itemsToAuction[0]
                this.itemsToAuction.shift() // Remove first item
            } else {
                this.currentItem = null
            }
        }
    }
}

export class Item {
    name : string
    description : string
    initialPrice : number

    constructor(name: string, description: string, initialPrice: number) {
        this.name = name;
        this.description = description;
        this.initialPrice = initialPrice;
    }
}