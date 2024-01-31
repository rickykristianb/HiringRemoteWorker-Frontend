import React from 'react'
import LazyLoadGif from '../assets/images/LazyLoad.gif'

const LazyLoad = () => {
  return (
    <div id='lazy-load-container'>
        <img src={LazyLoadGif} alt='Loading...' />
    </div>
  )
}

export default LazyLoad