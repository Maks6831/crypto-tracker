import React from 'react'
import { HashRouter } from 'react-router-dom'

export const Coinelement = ({ name, iconurl, symbol, id, hash, currentPrice, price_btc, marketCap, volume, priceChange, chartData }) => {
    return (
      <tr>
        <td>{hash}</td>
        <td>{<img src={iconurl} alt='icon'/>}{name} • {symbol}</td>
        <td>{priceChange}</td>
        <td>{currentPrice}</td>
        <td>{price_btc}</td>
        <td>{marketCap}</td>
        <td>{volume}</td>
        <td>graph</td>
      </tr>
    )
  }