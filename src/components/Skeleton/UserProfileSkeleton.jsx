import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import { Divider } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';

const UserProfileSkeleton = () => {
  return (
    <>
        <div className='flex flex-row flex-wrap w-full bg-soft-basic rounded-lg p-10 max-sm:p-5 shadow-box-shadow max-sm:mt-16'>
            <div className='p-10 pl-0 max-sm:pl-0 max-sm:pt-0 xl:w-[30%] md:w-[40%]'>
                {/* <div className='rounded-full xl:w-60 xl:h-60 md:w-40 md:h-40 max-sm:w-36 max-sm:h-36 shadow-box-shadow'> */}
                    {/* <div className='rounded-full xl:w-60 xl:h-60 md:w-40 md:h-40 max-sm:w-36 max-sm:h-36 shadow-box-shadow'> */}
                        {/* FOR LARGE SCREEN */}
                        <div className='max-xl:hidden xl:block rounded-full w-[250px] h-[250px] shadow-box-shadow'>
                            <Skeleton variant="circular" animation="wave" width={250} height={250} />
                        </div>
                        {/* FOR MEDIUM SCREEN */}
                        <div className='xl:hidden max-lg:block max-sm:hidden max-ipad-mini:hidden rounded-full w-[150px] h-[150px] shadow-box-shadow'>
                            <Skeleton variant="circular" animation="wave" width={150} height={150} />
                        </div>
                        {/* FOR SMALL SCREEN */}
                        <div className='max-sm:block lg:hidden rounded-full ipad-mini:hidden w-[130px] h-[130px] shadow-box-shadow'>
                            <Skeleton variant="circular" animation="wave" width={130} height={130} />
                        </div>
                    {/* </div> */}
                {/* </div> */}
                <br />
                <div className='rate-name'>
                    <div className='user-fullname'>
                        <Skeleton animation="wave" width={200} height={40} />
                    </div>
                </div>
                <div className='profile-location'>
                    <PlaceIcon /> <Skeleton animation="wave" width={100}  />
                </div>
            </div>
            <div className='xl:w-[70%] md:w-[60%] max-sm:w-full'>
                <div className='w-[80%]'>
                    <Skeleton animation="wave" />
                </div>
                
                <br />
                <Divider />
                <br />
                <div className='profile-detail-bio'>
                <label><b>Bio</b></label>
                <p className='pl-5'><Skeleton animation="wave" height={25} /></p>
                <p className='pl-5'><Skeleton animation="wave" height={25} /></p>
                <p className='pl-5'><Skeleton animation="wave" height={25} /></p>
                <p className='pl-5'><Skeleton animation="wave" height={25} /></p>
                <p className='pl-5'><Skeleton animation="wave" height={25} /></p>
                <p className='pl-5'><Skeleton animation="wave" height={25} /></p>
                <p className='pl-5'><Skeleton animation="wave" height={25} /></p>
                </div>
                <br />
                <label><b>Username</b></label>
                <br />
                <p className='pl-5'><Skeleton animation="wave" width={140} height={25} /></p>
                <br />
                <label><b>Email</b></label>
                <br />
                <p className='pl-5'><Skeleton animation="wave" width={140} height={25} /></p>
                <br />
                <label><b>Phone Number</b></label>
                <br />
                <p className='pl-5'><Skeleton animation="wave" width={140} height={25} /></p>
            </div>            
        </div>

        <div className='flex flex-col gap-10 max-sm:gap-4 rounded-lg shadow-box-shadow p-10 max-sm:p-2 h-[550px]'>
            <div >
                <div className='overflow-x-auto w-full'>
                    <ul className='flex justify-center items-center text-l h-16 gap-5 m-0 p-0 max-xl:justify-start max-xl:px-2'>
                        <li >
                            <Skeleton animation="wave" width={170} height={60} className='rate-menu' />
                        </li>
                        <li >
                            <Skeleton animation="wave" width={170} height={60} className='rate-menu' />
                        </li>
                        <li >
                            <Skeleton animation="wave" width={170} height={60} className='rate-menu' />
                        </li>
                        <li >
                            <Skeleton animation="wave" width={170} height={60} className='rate-menu' />
                        </li>
                        <li >
                            <Skeleton animation="wave" width={170} height={60} className='rate-menu' />
                        </li>
                        <li >
                            <Skeleton animation="wave" width={170} height={60} className='rate-menu' />
                        </li>
                        <li >
                            <Skeleton animation="wave" width={170} height={60} className='rate-menu' />
                        </li>
                    </ul>
                </div>
            </div>
            <Divider />
            <div className='skills-container'>
                <p className='text-[32px] font-bold'>Skills</p>
                <br />
                <div className='skill-level-list'>
                    <Skeleton animation="wave" width={150} height={125}  />
                    <Skeleton animation="wave" width={150} height={125}  />
                    <Skeleton animation="wave" width={150} height={125}  />
                </div>
            </div>
        </div>

        <div className='rounded-lg shadow-box-shadow p-10'>
            <div className='w-full'>
                <p className='text-[32px] font-bold'>Ratings</p>
                <br />
                {/* FOR LARGE SCREEN */}
                {[0, 1, 2].map(() => (
                    <div id='rating-detail-container' className='max-xl:hidden xl:block flex flex-col gap-5 p-10'>
                        <p lassName='pl-20'><Skeleton animation="wave" width={130} height={20} className='rate-menu' /></p>
                        <div id='job-name-date-wrapper' className='w-full'>
                            <Skeleton animation="wave" width={250} height={25} className='rate-menu' />
                            <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                        </div>
                            <Skeleton animation="wave" width={90} height={10} className='rate-menu' />
                        <div id='comment-wrapper'>
                            <p>Comment:</p>
                            <br />
                            <div className='w-full'>
                                <Skeleton animation="wave" width={1310} height={10} className='rate-menu' />
                                <Skeleton animation="wave" width={1310} height={10} className='rate-menu' />
                                <Skeleton animation="wave" width={1310} height={10} className='rate-menu' />
                            </div>
                        </div>
                    </div>    
                ))}

                {/* FOR MEDIUM SCREEN */}
                {[0, 1, 2].map(() => (
                    <div id='rating-detail-container' className='lg:block xl:hidden max-sm:hidden ipad-mini:hidden flex flex-col gap-5 p-10 '>
                        <p lassName='pl-20'><Skeleton animation="wave" width={130} height={20} className='rate-menu' /></p>
                        <div id='job-name-date-wrapper' className='w-full'>
                            <Skeleton animation="wave" width={250} height={25} className='rate-menu' />
                            <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                        </div>
                            <Skeleton animation="wave" width={90} height={10} className='rate-menu' />
                        <div id='comment-wrapper'>
                            <p>Comment:</p>
                            <br />
                            <div className='w-full'>
                                <Skeleton animation="wave" width={630} height={10} className='rate-menu' />
                                <Skeleton animation="wave" width={630} height={10} className='rate-menu' />
                                <Skeleton animation="wave" width={630} height={10} className='rate-menu' />
                            </div>
                        </div>
                    </div>    
                ))}

                {/* FOR IPAD MINI SCREEN */}
                {[0, 1, 2].map(() => (
                    <div id='rating-detail-container' className='max-lg:hidden lg:hidden ipad-mini:block flex flex-col gap-5 p-10'>
                        <p lassName='pl-20'><Skeleton animation="wave" width={130} height={20} className='rate-menu' /></p>
                        <div id='job-name-date-wrapper' className='w-full'>
                            <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                            <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                        </div>
                            <Skeleton animation="wave" width={90} height={10} className='rate-menu' />
                        <div id='comment-wrapper'>
                            <p>Comment:</p>
                            <br />
                            <div className='w-full'>
                                <Skeleton animation="wave" width={390} height={10} className='rate-menu' />
                                <Skeleton animation="wave" width={390} height={10} className='rate-menu' />
                                <Skeleton animation="wave" width={390} height={10} className='rate-menu' />
                            </div>
                        </div>
                    </div>    
                ))}

                {/* FOR SMALL SCREEN */}
                {[0, 1, 2].map(() => (
                    <div id='rating-detail-container' className='max-md:block lg:hidden ipad-mini:hidden flex flex-col gap-5 p-10'>
                        <p lassName='pl-20'><Skeleton animation="wave" width={130} height={20} className='rate-menu' /></p>
                        <div id='job-name-date-wrapper' className='w-full'>
                            <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                            <Skeleton animation="wave" width={100} height={25} className='rate-menu' />
                        </div>
                            <Skeleton animation="wave" width={90} height={10} className='rate-menu' />
                        <div id='comment-wrapper'>
                            <p>Comment:</p>
                            <br />
                            <div className='w-full'>
                                <Skeleton animation="wave" width={180} height={10} className='rate-menu' />
                                <Skeleton animation="wave" width={180} height={10} className='rate-menu' />
                                <Skeleton animation="wave" width={180} height={10} className='rate-menu' />
                            </div>
                        </div>
                    </div>    
                ))}
                                          
            </div>
        </div>
    </>
  )
}

export default UserProfileSkeleton