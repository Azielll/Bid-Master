'use client'                              // directive to clarify client-side. Place at top of ALL .tsx files
import React from 'react'

import { Model, Item } from '../model'

import styles from "./page.module.css"
import { ToAuctionItems } from './boundary'

// BOUNDARY OBJECT
export default function Home() {
 const [model, setModel] = React.useState(new Model())
 const [redraw, forceRedraw] = React.useState(0)

 // helper function that forces React app to redraw whenever this is called.
 function andRefreshDisplay() {
   forceRedraw(redraw + 1)
 }

  // https://gitlab03.wpi.edu/heineman/table  be sure to review!
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      
       {
       /** When this renders, it will show the number of items to auction. BUT if ToAuctionItems changes, 
        * it will not update IF ToAuctionItems DOESN'T call 'andRefreshDisplay()' to force US to refresh. */
       }
       <h1>Items to auction ({model.itemsToAuction.length})</h1>
        <ToAuctionItems model={model} andRefreshDisplay={andRefreshDisplay} />
       
       <h1>Current Item</h1>

       <h1>Items that have auctioned</h1>
      </main>
    </div>
  );
}
