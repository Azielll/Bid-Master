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
        <header className={styles.header}>
          <h1 className={styles.title}>BidMaster</h1>
          <p className={styles.subtitle}>Manage your auction items and track bids</p>
        </header>

        <div className={styles.content}>
          <div className={styles.topSection}>
            <TotalFundsRaisedCard model={model} redraw={redraw}/>
            <SetupAuctionCard model={model} andRefreshDisplay={andRefreshDisplay} />
          </div>

          <div className={styles.mainSection}>
            <div className={styles.leftColumn}>
              <ToAuctionItems model={model} redraw={redraw} andRefreshDisplay={andRefreshDisplay} />
              <SoldItemsCard model={model} redraw={redraw} />
            </div>

            <div className={styles.rightColumn}>
              <CurrentItemCard model={model} redraw={redraw} andRefreshDisplay={andRefreshDisplay} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
