import React, { useEffect, useState } from 'react'
import { AreaChart, Area,  ResponsiveContainer, YAxis, LineChart } from 'recharts';

export const Coinelement = ({ name, iconurl, symbol, id, hash, currentPrice, price_btc, marketCap, volume, priceChange, chartData }) => {
    const [graphData, setGraphData] = useState();
    const [upper, setUpper] = useState();
    const [lower, setLower] = useState();
    const [lineColor, setLineColor] = useState();
    
    useEffect(()=>{
        setGraphData(
            chartData.map(data => {
                return {
                    time : data[0],
                    price: data[1],

                }
            })
        )
        let maxPrice = Math.max(...chartData.map(point => point[1]).flat());
        setUpper(maxPrice * 1.2);
        let minPrice = Math.min(...chartData.map(point => point[1]).flat());
        setLower(minPrice * 0.8);
        priceChange.includes('-') ? setLineColor('#FF0000') : setLineColor('#00FF00')
    },[])

    return (
      <tr>
        <td>{hash}</td>
        <td className='td-name'>{<img className='table-icon' src={iconurl} alt='icon'/>}{name} • {symbol}</td>
        <td className='td-change'>{priceChange}</td>
        <td className='td-price'>{currentPrice}</td>
        <td className='td-btc'>{price_btc}</td>
        <td className='td-cap'>{marketCap}</td>
        <td className='td-volume'>{volume}</td>
        <td className='td-graph'>
            <div className='little-line'>
            <ResponsiveContainer width="100%" height="100%">
        <AreaChart
            width={150}
            height={50}
            data={graphData}
            margin={{
                top: -30,
                right: 0,
                left: 0,
                bottom: -30,
              }}
              yAxis={{
                domain: [0, 100],
                axisLine: false, // hide the axis line
                tickLine: false, // hide the tick lines
              }}
        >
            <YAxis display="none" domain={[lower, upper]}/>
          <Area type="monotone" dataKey="price" stroke={lineColor} fill="none"/>
        </AreaChart>
        </ResponsiveContainer>
            </div>
        </td>
      </tr>
    )
  }