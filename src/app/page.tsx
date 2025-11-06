'use client'                              // directive to clarify client-side. Place at top of ALL .tsx files
import React from 'react'

import { Model, Item } from '../model'

import styles from "./page.module.css"
import { ToAuctionItems, TotalFundsRaisedCard, SetupAuctionCard, SoldItemsCard, CurrentItemCard } from './boundary'

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
       <TotalFundsRaisedCard model={model} redraw={redraw}/>
       <SetupAuctionCard model={model} andRefreshDisplay={andRefreshDisplay} />
        <ToAuctionItems model={model} andRefreshDisplay={andRefreshDisplay} />
       
       <CurrentItemCard model={model} redraw={redraw} andRefreshDisplay={andRefreshDisplay} />

       <SoldItemsCard model={model} redraw={redraw} />
      </main>
    </div>
  );
}
