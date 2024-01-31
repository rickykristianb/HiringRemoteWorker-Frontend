import React, { Fragment } from 'react'

import { Divider } from '@mui/material'

const CompanyBio = (props) => {

  return (
    <div className='w-full'>
    <br />
      <Divider />
      <p className='text-3xl font-bold leading-[80px]'>Company Profile</p>
      <p className='company-bio-content'>{props.userData.bio?.split('\n').map((line, i) => (
          <Fragment key={i}>
              {i > 0 && <br />}
              {line}
          </Fragment>
      ))}</p>
    </div>
  )
}

export default CompanyBio