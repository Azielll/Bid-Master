export class Model {
    itemsToAuction: Item[]
    soldItems: Item[]
    isAuctionStarted: boolean = false
    currentItem: Item | null = null
    totalFundsRaised: number = 0
    currentBids: Bid[]

    // Auction BidMaster
    //
    // Keep track of Items being auctioned
    constructor() {
        this.itemsToAuction = []
        this.soldItems = []
        this.isAuctionStarted = false
        this.currentItem = null
        this.totalFundsRaised = 0
        this.currentBids = []
    }

    addItemToAuction(item: Item) {
        this.itemsToAuction.push(item)
    }

    startAuction() {
        if(this.isAuctionStarted == false && this.itemsToAuction.length > 0) {
            this.isAuctionStarted = true
            this.currentItem = this.itemsToAuction[0]
            this.itemsToAuction.shift()
            this.currentBids = [] // Clear bids for the first item
        }
    }

    getTotalFundsRaised() {
        return "$" + this.totalFundsRaised.toFixed(2)
    }

    sellCurrentItem() {
        if(this.currentItem === null) {
            throw new Error("No item is currently being auctioned")
        }
        
        // Require at least one bid before selling
        if(this.currentBids.length === 0) {
            throw new Error("Cannot sell item without at least one bid")
        }
        
        // Get the winning bid (highest bid, which is the last one in the array)
        const winningBid = this.currentBids[this.currentBids.length - 1]
        
        // Store winner information with the item
        this.currentItem.winnerName = winningBid.bidderName
        this.currentItem.finalPrice = winningBid.amount
        // Calculate profit: final price - initial price
        this.totalFundsRaised += (winningBid.amount - this.currentItem.initialPrice)
        
        this.soldItems.push(this.currentItem)
        
        // Clear bids and move to next item
        this.currentBids = []
        if(this.itemsToAuction.length > 0) {
            this.currentItem = this.itemsToAuction[0]
            this.itemsToAuction.shift() // Remove first item
        } else {
            this.currentItem = null
        }
    }

    recordBid(bidderName: string, amount: number) {
        // Check if there's a current item being auctioned
        if(this.currentItem === null) {
            throw new Error("No item is currently being auctioned")
        }

        // Figure out what the minimum bid needs to be
        let minimumBid: number
        let isFirstBid: boolean
    
        if (this.currentBids.length === 0) {
            // No bids yet, so minimum is exactly the item's initial price
            minimumBid = this.currentItem.initialPrice
            isFirstBid = true
        } else {
            // There are bids, so minimum is the highest bid + 0.01
            const lastBid = this.currentBids[this.currentBids.length - 1]
            minimumBid = lastBid.amount + 0.01
            isFirstBid = false
        }

        // Check if the new bid is high enough
        // For first bid: amount must be >= initialPrice (exactly the initial price)
        // For subsequent bids: amount must be >= highestBid + 0.01
        if (isFirstBid && amount >= minimumBid) {
            // First bid: allow exactly the initial price or higher
            const newBid = new Bid(bidderName, amount)
            this.currentBids.push(newBid)
        } else if (!isFirstBid && amount >= minimumBid) {
            // Subsequent bids: must be at least 0.01 more than highest bid
            const newBid = new Bid(bidderName, amount)
            this.currentBids.push(newBid)
        } else {
            // Bid is too low - reject it
            throw new Error(`Bid must be at least $${minimumBid.toFixed(2)}`)
        }
    }
}

export class Item {
    name : string
    description : string
    initialPrice : number
    winnerName : string | null = null  // Winner's name (null if not sold yet)
    finalPrice : number | null = null  // Final selling price (null if not sold yet)

    constructor(name: string, description: string, initialPrice: number) {
        this.name = name;
        this.description = description;
        this.initialPrice = initialPrice;
    }
}

export class Bid {
    bidderName: string
    amount: number
    timestamp: Date

    constructor(bidderName: string, amount: number) {
        this.bidderName = bidderName
        this.amount = amount
        this.timestamp = new Date()  // Automatically set when bid is created
    }
}