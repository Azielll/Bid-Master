import React from 'react'

import { Item, Model, Bid } from '../model'
import styles from './boundary.module.css'


// Pass in "andRefreshDisplay" to let parent components know that the state has changed.
function ToAuctionItems({model, redraw, andRefreshDisplay}: {model: Model, redraw: number, andRefreshDisplay: () => void}) {
     const [itemsAvailable, changeItemsAvailable] = React.useState(model.itemsToAuction)

    // Update local state when model changes (triggered by redraw prop)
    React.useEffect(() => {
        changeItemsAvailable([...model.itemsToAuction])
    }, [redraw])

    // CONTROLLER
    function addItem() {
        const nameElement = document.getElementById("new-item-name") as HTMLInputElement
        const descriptionElement = document.getElementById("new-item-description") as HTMLInputElement
        const initialPriceElement = document.getElementById("new-item-initial-price") as HTMLInputElement
        
        const name = nameElement.value
        const description = descriptionElement.value
        const initialPrice = initialPriceElement.value
        
        const newItem = new Item(name, description, parseInt(initialPrice))

        // FIRST make sure that we add to the model
        model.addItemToAuction(newItem)

        // TO FORCE the redraw LOCALLY, you have to change state USING THE setState function
        // ... before an array means to grab all the existing items in the array
        changeItemsAvailable([...model.itemsToAuction])

        // in case any parent React code needs to know about this change, call the passed-in function
        andRefreshDisplay()
    }

    return (
        <div className={styles.card}>
          <h2>Items to Auction ({itemsAvailable.length})</h2>
          
          {model.isAuctionStarted ? (
            <p className={styles.noItems}>Auction has started. New items cannot be added.</p>
          ) : (
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <label htmlFor="new-item-name">Name</label>
                <input id="new-item-name" data-testid="new-item-name" placeholder="Item name" />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="new-item-description">Description</label>
                <input id="new-item-description" data-testid="new-item-description" placeholder="Item description" />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="new-item-initial-price">Initial Price ($)</label>
                <input id="new-item-initial-price" data-testid="new-item-initial-price" type="number" step="0.01" placeholder="Item initial price" />
              </div>
              <button className={styles.addButton} onClick={() => {addItem()}}>Add Item</button>
            </div>
          )}
           
          {itemsAvailable.length === 0 ? (
            <p className={styles.noItems}>No items added yet. Add items to start the auction.</p>
          ) : (
            <ul className={styles.itemsList}>
              {itemsAvailable.map((item: Item, index: number) => (
                <li key={`${item.name}-${index}`} className={styles.itemCard}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemDescription}>{item.description}</div>
                  </div>
                  <div className={styles.itemPrice}>${item.initialPrice.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
    )
}

function TotalFundsRaisedCard({model, redraw}: {model: Model, redraw: number}) {
  const [totalFunds, setTotalFunds] = React.useState(model.getTotalFundsRaised())
  
  React.useEffect(() => {
    setTotalFunds(model.getTotalFundsRaised())
  }, [redraw])
  
  return (
        <div className={`${styles.card} ${styles.totalFunds}`}>
            <h2>Total Funds Raised</h2>
            <div className={styles.totalFundsAmount}>{totalFunds}</div>
        </div>
    )
}

function SetupAuctionCard({model, andRefreshDisplay}: {model: Model, andRefreshDisplay: () => void}) {
    
  function handleStartAuction() {
    model.startAuction()
    andRefreshDisplay()
  }
  
  return (
        <div className={`${styles.card} ${styles.setupCard}`}>
            <h2>Setup Auction</h2>
            <p>Add items to the Auction before starting</p>
            <button 
              data-testid="start-auction-button"
              onClick={handleStartAuction}
              disabled={model.isAuctionStarted || model.itemsToAuction.length === 0}
            >
              {model.isAuctionStarted ? 'Auction Started' : 'Start Auction'}
            </button>
        </div>
    )
}

function SoldItemsCard({model, redraw}: {model: Model, redraw: number}) {
  const [soldItems, setSoldItems] = React.useState(model.soldItems)

  // Update local state when model changes (triggered by redraw prop)
  React.useEffect(() => {
    setSoldItems([...model.soldItems])
  }, [redraw])

  return (
    <div className={styles.card}>
      <h2>Sold Items ({soldItems.length})</h2>
      {soldItems.length === 0 ? (
        <p className={styles.noItems}>No items sold yet.</p>
      ) : (
        <ul className={styles.soldItemsList}>
          {soldItems.map((item: Item, index: number) => (
            <li key={`${item.name}-${index}`} className={styles.soldItemCard}>
              <div className={styles.soldItemHeader}>
                <div className={styles.soldItemName}>{item.name}</div>
              </div>
              <div className={styles.soldItemDesc}>{item.description}</div>
              <div className={styles.soldItemDetails}>
                <div className={styles.soldItemDetail}>
                  <div className={styles.soldItemDetailLabel}>Final Price</div>
                  <div className={`${styles.soldItemDetailValue} ${styles.price}`}>
                    ${item.finalPrice?.toFixed(2) || item.initialPrice.toFixed(2)}
                  </div>
                </div>
                <div className={styles.soldItemDetail}>
                  <div className={styles.soldItemDetailLabel}>Winner</div>
                  <div className={`${styles.soldItemDetailValue} ${styles.winner}`}>
                    {item.winnerName || "No winner"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CurrentItemCard({model, redraw, andRefreshDisplay}: {model: Model, redraw: number, andRefreshDisplay: () => void}) {
  const [currentItem, setCurrentItem] = React.useState(model.currentItem)
  const [currentBids, setCurrentBids] = React.useState(model.currentBids)

  // Update local state when model changes (triggered by redraw prop)
  React.useEffect(() => {
    setCurrentItem(model.currentItem)
    setCurrentBids([...model.currentBids])
  }, [redraw])

  function handleSellItem() {
    try {
      model.sellCurrentItem()
      andRefreshDisplay()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to sell item")
    }
  }

  function handlePlaceBid() {
    const bidderNameElement = document.getElementById("new-bidder-name") as HTMLInputElement
    const bidAmountElement = document.getElementById("new-bid-amount") as HTMLInputElement
    
    const bidderName = bidderNameElement.value
    const bidAmount = parseFloat(bidAmountElement.value)

    try {
      model.recordBid(bidderName, bidAmount)
      // Clear input fields
      bidderNameElement.value = ""
      bidAmountElement.value = ""
      andRefreshDisplay()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to place bid")
    }
  }

  // Get current highest bid (last element in array, or initial price if no bids)
  const getCurrentHighestBid = () => {
    if (currentBids.length > 0) {
      return currentBids[currentBids.length - 1].amount
    }
    return currentItem?.initialPrice || 0
  }

  // Get minimum next bid (highest bid + 0.01 for subsequent bids, or exactly initial price for first bid)
  const getMinimumNextBid = () => {
    if (currentBids.length === 0) {
      // First bid should be exactly the initial price
      return currentItem?.initialPrice || 0
    } else {
      // Subsequent bids need to be at least 0.01 more than the highest bid
      const highest = getCurrentHighestBid()
      return highest + 0.01
    }
  }

  // Sort bids in reverse order by price (highest first) for display
  const sortedBids = [...currentBids].sort((a, b) => b.amount - a.amount)

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString()
  }

  if(currentItem == null) {
    return null
  }

  return (
    <div className={`${styles.card} ${styles.currentItemCard}`}>
      <h2>Current Item</h2>
      <p>Now accepting bids</p>
      
      {/* Item Details */}
      <div className={styles.itemDetails}>
        <div className={styles.itemTitle}>{currentItem.name}</div>
        <div className={styles.itemDesc}>{currentItem.description}</div>
        <div className={styles.priceInfo}>
          <div>
            <div className={styles.priceLabel}>Initial Price</div>
            <div className={styles.priceValue}>${currentItem.initialPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className={styles.priceLabel}>Current Highest Bid</div>
            <div className={styles.priceValue}>${getCurrentHighestBid().toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Bidding Form */}
      <div className={styles.biddingForm}>
        <div className={styles.formRow}>
          <label htmlFor="new-bidder-name">Bidder Name</label>
          <input id="new-bidder-name" data-testid="new-bidder-name" placeholder="Enter your name" />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="new-bid-amount">Bid Amount ($)</label>
          <input 
            id="new-bid-amount" 
            data-testid="new-bid-amount"
            type="number" 
            step="0.01"
            placeholder={`Min: $${getMinimumNextBid().toFixed(2)}`} 
          />
        </div>
        <button className={styles.primaryButton} data-testid="place-bid-button" onClick={handlePlaceBid}>Place Bid</button>
      </div>

      {/* Current Bids List */}
      <div className={styles.bidsSection}>
        <div className={styles.bidsCount}>{currentBids.length} bid{currentBids.length !== 1 ? 's' : ''}</div>
        {sortedBids.length === 0 ? (
          <p className={styles.noBids}>No bids yet. Be the first to bid!</p>
        ) : (
          <ul className={styles.bidsList}>
            {sortedBids.map((bid: Bid, index: number) => (
              <li key={`${bid.bidderName}-${bid.amount}-${index}`} className={`${styles.bidItem} ${index === 0 ? styles.highest : ''}`}>
                <div className={styles.bidInfo}>
                  <div className={styles.bidderName}>
                    {index === 0 && <span className={styles.highestBadge}>HIGHEST</span>}
                    {bid.bidderName}
                  </div>
                  <div className={styles.bidTime}>{formatTime(bid.timestamp)}</div>
                </div>
                <div className={styles.bidAmount}>${bid.amount.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sell Button */}
      <button 
        className={styles.sellButton}
        data-testid="sell-item-button"
        onClick={handleSellItem}
        disabled={!model.isAuctionStarted || currentBids.length === 0}
      >
        Sell Item
      </button>
      {currentBids.length === 0 && (
        <p className={styles.errorMessage}>
          At least one bid is required to sell this item
        </p>
      )}
    </div>
  )
}


export { ToAuctionItems, TotalFundsRaisedCard, SetupAuctionCard, SoldItemsCard, CurrentItemCard }