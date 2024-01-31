import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import { Divider } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';

const UserProfileSkeleton = () => {
  return (
    <>
        <div className='profile_detail_header'>
            <div className='profilepicture-rate-name'>
                <div className='profile_picture'>
                    <div className='profile_image'>
                        <Skeleton variant="circular" animation="wave" width={250} height={250} />
                    </div>
                </div>
                <div className='rate-name'>
                    <div className='user-fullname'>
                        <Skeleton animation="wave" width={250} height={40} />
                    </div>
                </div>
                <div className='profile-location'>
                    <PlaceIcon /> <Skeleton animation="wave" width={100}  />
                </div>
            </div>
            <div className='profile-detail'>
                <Skeleton animation="wave" width={500} height={25} />
                <Divider />
                <br />
                <div className='profile-detail-bio'>
                <label><b>Bio</b></label>
                <Skeleton animation="wave" height={25} />
                <Skeleton animation="wave" height={25} />
                <Skeleton animation="wave" height={25} />
                <Skeleton animation="wave" height={25} />
                </div>
                <label><b>Username</b></label>
                <Skeleton animation="wave" width={140} height={25} />
                <label><b>Email</b></label>
                <Skeleton animation="wave" width={250} height={25} />
                <label><b>Phone Number</b></label>
                <Skeleton animation="wave" width={170} height={25} />
            </div>            
        </div>
        <br />
        <br />
        <br />
        <br />
        <div className='profile-menu-content-container'>
            <div id='profile-menu-wrapper'>
                <div className='profile-menu-list'>
                    <ul className='profile-menu'>
                        <li >
                            <Skeleton animation="wave" width={170} height={25} className='rate-menu' />
                        </li>
                        <li >
                        <Skeleton animation="wave" width={170} height={25} className='rate-menu' />
                        </li>
                        <li >
                        <Skeleton animation="wave" width={170} height={25} className='rate-menu' />
                        </li>
                        <li >
                        <Skeleton animation="wave" width={170} height={25} className='rate-menu' />
                        </li>
                        <li >
                        <Skeleton animation="wave" width={170} height={25} className='rate-menu' />
                        </li>
                        <li >
                        <Skeleton animation="wave" width={170} height={25} className='rate-menu' />
                        </li>
                        <li >
                        <Skeleton animation="wave" width={170} height={25} className='rate-menu' />
                        </li>
                    </ul>
                </div>
            </div>
            <Divider />
            <div className='skills-container'>
                <h1>Skills</h1>
                <br />
                <div className='skill-level-list'>
                    <Skeleton animation="wave" width={170} height={125}  />
                    <Skeleton animation="wave" width={170} height={125}  />
                    <Skeleton animation="wave" width={170} height={125}  />
                </div>
            </div>
        </div>
        <div id='user-profile-rating'>
            <div>
                <h1>Ratings</h1>
                <br />
                <div id='rating-detail-container'>
                        <Skeleton animation="wave" width={130} height={20} className='rate-menu' />
                    <div id='job-name-date-wrapper'>
                        <Skeleton animation="wave" width={250} height={25} className='rate-menu' />
                        <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                    </div>
                        <Skeleton animation="wave" width={90} height={10} className='rate-menu' />
                    <div id='comment-wrapper'>
                        <p>Comment:</p>
                        <br />
                        <div>
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                        </div>
                    </div>
                </div>    
                <div id='rating-detail-container'>
                        <Skeleton animation="wave" width={130} height={20} className='rate-menu' />
                    <div id='job-name-date-wrapper'>
                        <Skeleton animation="wave" width={250} height={25} className='rate-menu' />
                        <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                    </div>
                        <Skeleton animation="wave" width={90} height={10} className='rate-menu' />
                    <div id='comment-wrapper'>
                        <p>Comment:</p>
                        <br />
                        <div>
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                        </div>
                    </div>
                </div>    
                <div id='rating-detail-container'>
                        <Skeleton animation="wave" width={130} height={20} className='rate-menu' />
                    <div id='job-name-date-wrapper'>
                        <Skeleton animation="wave" width={250} height={25} className='rate-menu' />
                        <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                    </div>
                        <Skeleton animation="wave" width={90} height={10} className='rate-menu' />
                    <div id='comment-wrapper'>
                        <p>Comment:</p>
                        <br />
                        <div>
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={1100} height={10} className='rate-menu' />
                        </div>
                    </div>
                </div>           
            </div>
        </div>
    </>
  )
}

export default UserProfileSkeleton