import React from 'react'
import LazyLoadGif from '../assets/images/LazyLoad.gif'
// #lazy-load-container {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 99dvw;
//   height: 1000px;
// }

// #lazy-load-container > img {
//   width: 200px;
//   height: 200px;
// }

const LazyLoad = () => {
  return (
    <div className='flex justify-center items-center w-full h-screen' >
        <img src={LazyLoadGif} alt='Loading...' className='w-[200px] h-[200px] max-sm:w-[150px] max-sm:h-[150px]' />
    </div>
  )
}

export default LazyLoad


// width: 200px;
//     height: 200px;