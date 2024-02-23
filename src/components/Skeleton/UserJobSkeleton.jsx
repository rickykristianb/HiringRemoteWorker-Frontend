import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PsychologyIcon from '@mui/icons-material/Psychology';

const UserJobSkeleton = () => {
  return (
    <div className='container-user-list' >
      <div className='user-list'>
      {Array.from({length: 12}).map(() => (
        <div className='user-card' >
            <div className='user-image-name'>
                <div className='user-image-skeleton'>
                <Skeleton variant="circular" animation="wave" width={100} height={100} />
                </div>
                <div className='user-name'>
                    <h3><Skeleton animation="wave" width={100} height={30} /></h3>
                    <p><Skeleton animation="wave" width={200} height={30} /></p>
                </div>
            </div>
            <div className="user-info-skill-container">
                <div className='user-info' >
                <ul>
                    <li>
                        <LocationOnIcon className='icon-user-list'  /><span> <Skeleton animation="wave" width={100} height={30} /></span>
                    </li>
                    <li id='salary-skeleton'>
                        <AttachMoneyIcon />
                        <span> <Skeleton animation="wave" width={50} height={30} /> / <Skeleton animation="wave" width={50} height={30} /></span>
                    </li>
                    <li className='emp-type-user-list'>
                    <AccessTimeIcon /> 
                        <li><Skeleton animation="wave" width={50} height={30} /></li>
                        <li><Skeleton animation="wave" width={30} height={30} /></li>
                        <li><Skeleton animation="wave" width={70} height={30} /></li>
                    </li>
                    <li><PsychologyIcon /><span> <li><Skeleton animation="wave" width={150} height={30} /></li></span></li>
                </ul>
                </div>
                <div className='user-skills' >
                <li className='user-skills-list-skeleton'>
                    <ul>
                        <li><Skeleton animation="wave" width={55} height={30} /></li>
                        <li><Skeleton animation="wave" width={55} height={30} /></li>
                        <li><Skeleton animation="wave" width={55} height={30} /></li>
                        <li><Skeleton animation="wave" width={55} height={30} /></li>
                    </ul>
                </li>
                </div>                
            </div>
            
            <div className='user-rate-status'>
                <ul>
                    <div className='user-list-rating-skeleton'>
                    <Skeleton animation="wave" width={120} height={30} />
                    </div>
                </ul>
            </div>
        </div>

      ))}
      </div>
        <div className='container-pagination'>
            <Skeleton animation="wave" width={120} height={30} />
        </div>
    </div>
  )
}

export default UserJobSkeleton