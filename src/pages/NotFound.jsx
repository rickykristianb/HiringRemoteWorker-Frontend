import React from 'react'

const NotFound = (props) => {
  return (
    <div className='not-found-container'>
        <p>404</p>
        <h1>{props.label}</h1>
    </div>
  )
}

export default NotFound