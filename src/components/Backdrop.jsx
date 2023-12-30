import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

const Backdrop = () => {

  return (
    <div className='backdrop-background'>
        <CircularProgress color="inherit" className='company-profile-circular-progress' />
    </div>
  )
}

export default Backdrop