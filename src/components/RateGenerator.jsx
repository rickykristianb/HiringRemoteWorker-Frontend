import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

const RateGenerator = (props) => {

    const [rating, setRating] = useState()

    const generateStars = (data) => {
        const stars = []

        for (let i=1; i< 6; i++){
            if ( i === data ){
                const starClass = 'fa fa-star'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            } else if ( i < data ){
                const starClass = 'fa fa-star'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            } else if (i > data && i - 1 < data){
                // const starClass = 'fa fa-star-o'
                const starClass = 'fa-solid fa-star-half-stroke'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            } else if (i < data< i+1){
                const starClass = 'fa fa-star-o'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            } else {
                const starClass = 'fa fa-star-o'
                // const starClass = 'fa-solid fa-star-half-stroke'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            }
        }
        setRating(stars)
        return stars
    }

    useEffect(() => {
        generateStars(props.rating)
    },[props.rating])

  return (
    <div>
        <Tooltip className='tooltip'  TransitionComponent={Zoom} placement="right" title={props.rating} arrow>
            <ul className='rate-stars'>{rating}</ul>
        </Tooltip> 
    </div>
  )
}

export default RateGenerator