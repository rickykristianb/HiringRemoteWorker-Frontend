import React, { Fragment } from 'react'

import { Divider } from '@mui/material'

const CompanyBio = (props) => {

  return (
    <div className='company-bio-container'>
    <br />
      <Divider />
      <h1>Company Profile</h1>
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