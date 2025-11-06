import React from 'react'

import { Item, Model } from '../model'


// Pass in "andRefreshDisplay" to let parent components know that the state has changed.
function ToAuctionItems({model, andRefreshDisplay}: {model: Model, andRefreshDisplay: () => void}) {
     const [itemsAvailable, changeItemsAvailable] = React.useState(model.itemsToAuction)

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
        <div>
          <h2>Items to Auction ({itemsAvailable.length})</h2>
           <b>Name: </b><input id="new-item-name" placeholder="Item name"></input>
           <b>Description: </b><input id="new-item-description" placeholder="Item description"></input>
           <b>Initial Price: </b><input id="new-item-initial-price" placeholder="Item initial price"></input>
           <button onClick={() => {addItem()}}>Add Item</button>
           
        <ul>
          {itemsAvailable.map((item: Item) => (
            <li key={item.name}>{item.name} - {item.description} - {item.initialPrice}</li>
          ))}
        </ul>
        </div>
    )
}

function TotalFundsRaisedCard({model, redraw}: {model: Model, redraw: number}) {
  const [totalFunds, setTotalFunds] = React.useState(model.getTotalFundsRaised())
  
  React.useEffect(() => {
    setTotalFunds(model.getTotalFundsRaised())
  }, [redraw])
  
  return (
        <div>
            <h2>Total Funds Raised</h2>
            <p>{totalFunds}</p>
        </div>
    )
}

function SetupAuctionCard({model, andRefreshDisplay}: {model: Model, andRefreshDisplay: () => void}) {
    
  function handleStartAuction() {
    model.startAuction()
    andRefreshDisplay()
  }
  
  return (
        <div>
            <h2>Setup Auction</h2>
            <p>Add items to the Auction before starting</p>
            <button 
              onClick={handleStartAuction}
              disabled={model.isAuctionStarted || model.itemsToAuction.length === 0}
            >
              Start Auction</button>
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
    <div>
      <h2>Sold Items</h2>
      <p>sold items: {soldItems.length}</p>
      <ul>
        {soldItems.map((item: Item) => (
          <li key={item.name}>{item.name} - {item.description} - {item.initialPrice}</li>
        ))}
      </ul>
    </div>
  )
}

function CurrentItemCard({model, redraw, andRefreshDisplay}: {model: Model, redraw: number, andRefreshDisplay: () => void}) {
  const [currentItem, setCurrentItem] = React.useState(model.currentItem)

  // Update local state when model changes (triggered by redraw prop)
  React.useEffect(() => {
    setCurrentItem(model.currentItem)
  }, [redraw])

  function handleSellItem() {
    model.sellCurrentItem()
    andRefreshDisplay()
  }

  if(currentItem == null) {
    return (
      <div>
        <h2>Current Item</h2>
        <p>No item currently being auctioned</p>
      </div>
    )
  }
  return (
    <div>
      <h2>Current Item</h2>
      <p>current item: {currentItem.name} - {currentItem.description} - {currentItem.initialPrice}</p>
      <button 
        onClick={handleSellItem}
        disabled={currentItem === null || !model.isAuctionStarted}
      >
        Sell Item</button>
    </div>
  )
}


export { ToAuctionItems, TotalFundsRaisedCard, SetupAuctionCard, SoldItemsCard, CurrentItemCard }