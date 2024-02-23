import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PsychologyIcon from '@mui/icons-material/Psychology';

const JobDetailSkeleton = () => {
  return (
    <div id="job-detail-section">
      <div id='job-detail-container'>
        <div id="job-detail-layout">
          <div id='job-time-status'>
            <p><Skeleton animation="wave" width={80} height={30} /></p>
            <div id='job-detail-posted-on-skeleton'>
                <p>Posted On: </p>
                <p><Skeleton animation="wave" width={100} height={30} /></p>
            </div>
            
          </div>
          <div id='job-detail'>
            <div className='profile_image'>
                <Skeleton variant="circular" animation="wave" width={250} height={250} />
            </div>
            <div id="job-detail-header">
                <h1><Skeleton animation="wave" width={350} height={55} /></h1>
                <p><Skeleton animation="wave" width={200} height={30} /></p>
              <div className='job-detail-icon-info'>
                <LocationOnIcon />
                <p><Skeleton animation="wave" width={100} height={30} /></p>
              </div>
              <div className='job-detail-icon-info'>
                <AccessTimeIcon />
                <p><Skeleton animation="wave" width={80} height={30} /></p>
                <p><Skeleton animation="wave" width={80} height={30} /></p>
                <p><Skeleton animation="wave" width={80} height={30} /></p>
              </div>
              <div className='job-detail-icon-info'>
                <AttachMoneyIcon />
                <p><Skeleton animation="wave" width={70} height={30} /></p>
              </div>
              <div className='job-detail-icon-info'>
                <PsychologyIcon />
                <p><Skeleton animation="wave" width={70} height={30} /></p>
                <p><Skeleton animation="wave" width={70} height={30} /></p>
              </div>
              <div className='job-detail-icon-info'>
                <span>Apply before:</span>
                <p><Skeleton animation="wave" width={100} height={30}/></p>
              </div>
              
              <div id="job-skills">
              <div id='job-detail-skills-skeleton'>
                <Skeleton animation="wave" width={120} height={30} />
                <Skeleton animation="wave" width={120} height={30} />
                <Skeleton animation="wave" width={120} height={30} />
                <Skeleton animation="wave" width={120} height={30} />
              </div>
                
              </div>
            </div>
          </div>
          <div id="job-detail-action-button">
          </div>
          <br />
          <div id='job-detail-description'>
            <br />
            <Divider />
            <h1>Job Description</h1>
            <br />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <br />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <br />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <Skeleton animation="wave" height={25} />
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailSkeleton