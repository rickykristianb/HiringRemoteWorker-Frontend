import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import { Divider } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const CompanyProfileSkeleton = () => {
  return (
    <div className="company-profile-container">
        <div className='company-profile-header'>
        <div className='profile_picture'>
          <div className='profile_image'>
            <Skeleton variant="circular" animation="wave" width={250} height={250} />
          </div>
          
          <div className='rate-name-company-profile'>
                <div className='profile-rate-company-profile-skeleton' >
                    <Skeleton animation="wave" width={150} height={40} />
                </div>
                <div className='user-fullname'>
                    <h1><Skeleton animation="wave" width={280} height={60} /></h1>
                </div>
                <Divider />
                <br />
                <div className='basic-company-info'>
                  <div className='company-phone-email'>
                    <div>
                      <LocalPhoneIcon /><span><Skeleton animation="wave" width={250} height={30} /></span>
                    </div>
                    <div>
                      <EmailIcon /><span><Skeleton animation="wave" width={250} height={30} /></span>
                    </div>
                  </div>
                  <div className='company-address'>
                    <div>
                      <LocationOnIcon /><span><Skeleton animation="wave" width={250} height={30} /></span>
                    </div>
                    <br />
                    <Skeleton animation="wave" width={300} height={90} />
                    <br />
                    <br />
                  </div>
                </div>
            </div>
        </div>
        </div>
        <div className='company-bio-container'>
            <br />
            <Divider />
            <h1>Company Profile</h1>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <br />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <br />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <br />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
        </div> 

        <div id='job-posted-container'>
            <Divider />
            <div id="job-posted-title-button">
                <h1>Job Posted</h1>
            </div>
            <br />
            <br />
            <div id="job-posted-list-container">
                <div id="job-container" >
                <div id="job-basic-info">
                    <h2><Skeleton animation="wave" width={250} height={50}/></h2>
                    <p><Skeleton animation="wave" width={170} height={30} /></p>
                    <div>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                    </div>
                </div>
                <div id="job-skills-company-profile-skeleton">
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                </div>
                <div id="job-date-action-button">
                    <p><Skeleton animation="wave" width={110} height={30} /></p>
                    <p><Skeleton animation="wave" width={80} height={30} /></p>
                </div>
                </div>
                <div id="job-container" >
                <div id="job-basic-info">
                    <h2><Skeleton animation="wave" width={250} height={50}/></h2>
                    <p><Skeleton animation="wave" width={170} height={30} /></p>
                    <div>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                    </div>
                </div>
                <div id="job-skills-company-profile-skeleton">
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                </div>
                <div id="job-date-action-button">
                    <p><Skeleton animation="wave" width={110} height={30} /></p>
                    <p><Skeleton animation="wave" width={80} height={30} /></p>
                </div>
                </div>
                <div id="job-container" >
                <div id="job-basic-info">
                    <h2><Skeleton animation="wave" width={250} height={50}/></h2>
                    <p><Skeleton animation="wave" width={170} height={30} /></p>
                    <div>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                    </div>
                </div>
                <div id="job-skills-company-profile-skeleton">
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                </div>
                <div id="job-date-action-button">
                    <p><Skeleton animation="wave" width={110} height={30} /></p>
                    <p><Skeleton animation="wave" width={80} height={30} /></p>
                </div>
                </div>
                <div id="job-container" >
                <div id="job-basic-info">
                    <h2><Skeleton animation="wave" width={250} height={50}/></h2>
                    <p><Skeleton animation="wave" width={170} height={30} /></p>
                    <div>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                    </div>
                </div>
                <div id="job-skills-company-profile-skeleton">
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                </div>
                <div id="job-date-action-button">
                    <p><Skeleton animation="wave" width={110} height={30} /></p>
                    <p><Skeleton animation="wave" width={80} height={30} /></p>
                </div>
                </div>
                <div id="job-container" >
                <div id="job-basic-info">
                    <h2><Skeleton animation="wave" width={250} height={50}/></h2>
                    <p><Skeleton animation="wave" width={170} height={30} /></p>
                    <div>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                        <span><Skeleton animation="wave" width={60} /></span>
                    </div>
                </div>
                <div id="job-skills-company-profile-skeleton">
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                    <Skeleton animation="wave" width={80} height={30} />
                </div>
                <div id="job-date-action-button">
                    <p><Skeleton animation="wave" width={110} height={30} /></p>
                    <p><Skeleton animation="wave" width={80} height={30} /></p>
                </div>
                </div>
            </div>
        </div>
        <div id='company-profile-skeleton-pagination'>
            <Skeleton animation="wave" width={50} height={50} />
            <Skeleton animation="wave" width={50} height={50} />
            <Skeleton animation="wave" width={50} height={50} />
        </div>

        <div id='add-rating-company'>
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
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
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
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
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
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
                            <Skeleton animation="wave" width={700} height={10} className='rate-menu' />
                        </div>
                    </div>
                </div>           
            </div>
        </div>
    </div>
  )
}

export default CompanyProfileSkeleton