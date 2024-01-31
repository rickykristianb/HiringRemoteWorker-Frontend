import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PsychologyIcon from '@mui/icons-material/Psychology';

const UserJobSkeleton = () => {
  return (
    <div className='flex w-screen max-sm:mt-2 items-center flex-col max-lg:mt-0' >
      <div className='flex justify-center flex-wrap gap-10 mt-10 md:mt-10 max-lg:mt-0 max-sm:mt-10'>
      {Array.from({length: 12}).map(() => (
        <div className='card-container' >
            <div className='flex gap-4 m-5 h-[110]'>
                <div className='bg-white rounded-full w-[100px] h-[100px] flex justify-center'>
                    <Skeleton variant="circular" animation="wave" width={100} height={100} />
                </div>
                <div className='flex flex-col gap-4 justify-center'>
                    <h3><Skeleton animation="wave" width={100} height={30} /></h3>
                    <p><Skeleton animation="wave" width={200} height={30} /></p>
                </div>
            </div>
            <div className="user-info-skill-container">
                <div className='bg-white flex' >
                <ul className='flex flex-col gap-2 pl-5 mt-5'>
                    <li className='flex gap-3'>
                        <LocationOnIcon className='icon-user-list'  /><span> <Skeleton animation="wave" width={100} height={30} /></span>
                    </li>
                    <li className='flex gap-3'>
                        <AttachMoneyIcon />
                        <span className='flex gap-3'> <Skeleton animation="wave" width={50} height={30} /> / <Skeleton animation="wave" width={50} height={30} /></span>
                    </li>
                    <li className='flex gap-3'>
                    <AccessTimeIcon /> 
                        <li><Skeleton animation="wave" width={50} height={30} /></li>
                        <li><Skeleton animation="wave" width={30} height={30} /></li>
                        <li><Skeleton animation="wave" width={70} height={30} /></li>
                    </li>
                    <li className='flex gap-3'><PsychologyIcon /><span> <li><Skeleton animation="wave" width={150} height={30} /></li></span></li>
                </ul>
                </div>
                <div className='bg-white' >
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
            
            <div className='flex justify-start items-center bg-soft-basic h-[30px] rounded-[0_0_10px_10px] pl-5'>
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