import { hover } from '@testing-library/user-event/dist/hover';
import React, { useEffect, useState } from 'react'
import { AreaChart, Area,  ResponsiveContainer, YAxis, LineChart } from 'recharts';

export const Coinelement = ({ name, iconurl, symbol, id, hash, currentPrice, price_btc, marketCap, volume, priceChange, chartData }) => {
    const [graphData, setGraphData] = useState();
    const [upper, setUpper] = useState();
    const [lower, setLower] = useState();
    const [lineColor, setLineColor] = useState();
    const [background, setBackground] = useState(false);

    
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
        priceChange.includes('-') ? setLineColor('#ff4d4d') : setLineColor('#6ccf59');
        priceChange.includes('-') ? setBackground(false) : setBackground(true);
          },[])
    return (
      <tr className='table-row'>
        <td className='td-hash'>{hash}</td>
        <td className='td-name'>{<img className='table-icon' src={iconurl} alt='icon'/>}{name}<div className='symbol'>&nbsp; • {symbol}</div></td>
        <td className='td-change' style={{color: lineColor}}>
            <div className={!background ? 'background-down':'background-up'}>
              {priceChange}
            </div>
          </td>
        <td className='td-price'>{currentPrice}</td>
        <td className='td-btc'>{price_btc}</td>
        <td className='td-cap'>{marketCap}</td>
        <td className='td-volume'>{volume}</td>
        <td className='td-graph'>
            <div className='little-line'>
            <ResponsiveContainer width="100%" height="100%" className='response'>
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