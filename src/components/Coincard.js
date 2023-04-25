import React, { useEffect, useState } from 'react'

export const Coincard = (props) => {
  const [description, setDescription] = useState('');
  useEffect(()=>{
    setDescription(props.description.split('. ',1)[0])

  },[])
  return (
    <div>
      <h2>{props.name}</h2>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
      
      </div>
  )
}
