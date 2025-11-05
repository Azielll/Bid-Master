import React from 'react'

import { Item } from '../model'


// Pass in "andRefreshDisplay" to let parent components know that the state has changed.
function ToAuctionItems({model, andRefreshDisplay}) {
     const [itemsAvailable, changeItemsAvailable] = React.useState(model.itemsToAuction)

    // CONTROLLER
    function addItem() {
        const inputElement = document.getElementById("new-item-name") as HTMLInputElement
        const itemName = inputElement.value
        const newItem = new Item(Date.now().toString(), itemName)

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
           <b>Name: </b><input id="new-item-name" placeholder="Item name"></input>
           <button onClick={() => {addItem()}}>Add Item</button>
           
        <ul>
          {itemsAvailable.map((item: Item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
        </div>
    )
}


export { ToAuctionItems }