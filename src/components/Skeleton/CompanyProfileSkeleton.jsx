import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import { Divider } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';

const CompanyProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-16 my-14 max-sm:mt-44 max-sm:mx-8 justify-center items-center">
        <div className='xl:w-[1000px] max-xl:px-12 max-sm:px-0 w-full max-sm:w-full flex flex-col gap-16'>
            <div className='flex flex-col items-center justify-center bg-soft-basic  max-sm:mx-2 max-sm:h-[500px] rounded-3xl shadow-box-shadow'>
                <div className='profile-img relative bottom-10 bg-slate-200'>
                    <img className="profile-img" />
                </div>
                
                <div className='w-full px-12'>
                    <Skeleton animation="wave" width={120} height={40} />
                    <div className='user-fullname'>
                        <p className='text-[35px] font-bold'><Skeleton animation="wave" width={220} height={50} /></p>
                    </div>
                    <Divider />
                </div>
                <br />
                <br />
                <div className='flex flex-wrap justify-between flex-row gap-4 w-full px-12'>
                    <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <LocalPhoneIcon /><span><Skeleton animation="wave" width={130} height={30} /></span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <EmailIcon /><span className='break-all'><Skeleton animation="wave" width={180} height={30} /></span>
                    </div>
                    </div>
                    <div className='self-start'>
                    <div className='flex items-center gap-2'>
                        <LocationOnIcon /><span><Skeleton animation="wave" width={180} height={30} /></span>
                    </div>
                    <br />
                        <Skeleton animation="wave" width={210} height={100} />
                    <br />
                    <br />
                    
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <br />
                <Divider />
                <p className='text-3xl font-bold leading-[80px]'>Company Profile</p>
                <p className='company-bio-content'>
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <br />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <br />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                    <Skeleton animation="wave" height={20} className='w-full' />
                </p>
            </div>
            <div id='job-posted-container'>
                <Divider />
                <p className='text-3xl font-bold leading-[80px]'>Job Posted</p>
                <div id="job-posted-list-container">
                    {[0,1,2].map(() => (
                        <div className='flex border p-4 w-full max-sm:flex-col' >
                        <div className='w-[470px] max-sm:w-full'>
                            <p className='text-3xl font-bold mb-6'><Skeleton animation="wave" width={290} height={40} /></p>
                            <p className='mb-2'><Skeleton animation="wave" width={150} height={30} /></p>
                            <div className='flex gap-4'>
                                <Skeleton animation="wave" width={70} height={30} />
                                <Skeleton animation="wave" width={70} height={30} />
                                <Skeleton animation="wave" width={70} height={30} />
                            </div>
                        </div>
                        <div className='w-[380px] max-sm:w-full'>
                        <ul className='flex flex-row flex-wrap gap-2 mt-4'>
                        <Skeleton animation="wave" width={70} height={30} />
                        <Skeleton animation="wave" width={70} height={30} />
                        <Skeleton animation="wave" width={70} height={30} />
                        </ul>
                        </div>
                        <div className='flex flex-col gap-4 justify-center items-end max-sm:flex-row max-sm:justify-start max-sm:mt-4'>
                            <div className='flex flex-col gap-4 items-end pl-6 max-sm:flex-row max-sm:pl-0'>
                                <p><Skeleton animation="wave" width={60} height={30} /></p>
                                <div id="loved-counter">
                                <FavoriteIcon />
                                <span><p><Skeleton animation="wave" width={20} height={30} /></p></span>
                                </div>
                                <p><span><p><Skeleton animation="wave" width={60} height={30} /></p></span></p>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            
            <div className='w-full'>
                <p className='text-[32px] font-bold'>Ratings</p>
                <br />
                {[0,1,2].map(() => (
                    <div className='w-full'>
                        <div id='rating-detail-container' className='flex flex-col gap-5 p-10'>
                            <p ><Skeleton animation="wave" width={100} height={30} /></p>
                            <div id='job-name-date-wrapper'>
                                <p className='text-2xl font-bold'><Skeleton animation="wave" width={230} height={40} /></p>
                                <p><Skeleton animation="wave" width={80} height={30} /></p>
                            </div>
                            <p ><b><Skeleton animation="wave" width={60} height={30} /></b></p>
                            <div id='comment-wrapper' className='w-full'>
                                <p>Comment:</p>
                                <div className='flex flex-col w-[89%]'>
                                    <p><Skeleton animation="wave" height={20} className='w-full' /></p>
                                    <p><Skeleton animation="wave" height={20} className='w-full' /></p>
                                    <p><Skeleton animation="wave" height={20} className='w-full' /></p>
                                </div>
                            </div>
                        </div>
                    </div>    
                ))}
            </div>

        </div>
    </div>
  )
}

export default CompanyProfileSkeleton