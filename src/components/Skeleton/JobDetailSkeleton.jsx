import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PsychologyIcon from '@mui/icons-material/Psychology';

const JobDetailSkeleton = () => {
  return (
    <>
    {/* SKELETON FOR LARGE SCREEN */}
      <div className="flex justify-center max-sm:hidden">
        <div className='bg-white flex flex-wrap flex-col my-16 xl:w-[70%] w-[86%] rounded-lg shadow-box-shadow p-2'>
          <div className='flex flex-col w-full'>
            <div className='flex justify-end gap-10 mx-10'>
              <p><Skeleton animation="wave" width={80} height={30} /></p>
              <div className='flex flex-row gap-2 items-center'>
                  <p>Posted On: </p>
                  <p><Skeleton animation="wave" width={100} height={30} /></p>
              </div>
              
            </div>
            <div className='flex p-12'>
              <div className='profile_image'>
                  <Skeleton variant="circular" animation="wave" width={250} height={250} />
              </div>
              <div className='px-10'>
                  <p className='text-3xl font-bold'><Skeleton animation="wave" width={350} height={55} /></p>
                  <p className='hover:underline my-6'><Skeleton animation="wave" width={200} height={30} /></p>
                <div className='flex items-center gap-2 my-6'>
                  <LocationOnIcon />
                  <p><Skeleton animation="wave" width={100} height={30} /></p>
                </div>
                <div className='flex items-center gap-2 my-6'>
                  <AccessTimeIcon />
                  <p><Skeleton animation="wave" width={80} height={30} /></p>
                  <p><Skeleton animation="wave" width={80} height={30} /></p>
                  <p><Skeleton animation="wave" width={80} height={30} /></p>
                </div>
                <div className='flex items-center gap-2 my-6'>
                  <AttachMoneyIcon />
                  <p><Skeleton animation="wave" width={70} height={30} /></p>
                </div>
                <div className='flex items-center gap-2 my-6'>
                  <PsychologyIcon />
                  <p><Skeleton animation="wave" width={70} height={30} /></p>
                  <p><Skeleton animation="wave" width={70} height={30} /></p>
                </div>
                <div className='flex items-center gap-2 my-6'>
                  <span>Apply before:</span>
                  <p><Skeleton animation="wave" width={100} height={30}/></p>
                </div>
                
                <div className='w-full'>
                <div className='pl-0 flex gap-[10px]'>
                  <Skeleton animation="wave" width={120} height={30} />
                  <Skeleton animation="wave" width={120} height={30} />
                  <Skeleton animation="wave" width={120} height={30} />
                  <Skeleton animation="wave" width={120} height={30} />
                </div>
                  
                </div>
              </div>
            </div>

            <br />
            <div className='mx-10'>
              <br />
              <Divider />
              <p className='text-3xl mt-5 font-bold'>Job Description</p>
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

      {/* SKELETON FOR MOBILE */}
      <div className="max-sm:blocked sm:hidden mt-24">
        <div className='flex flex-col'>
          <div className='flex justify-between pl-10 pr-5'>
            <div className='flex justify-between w-full'>
              <div className='flex items-center gap-2'>
                <p>Posted On: </p>
                <p><Skeleton animation="wave" width={70} height={30} /></p>
              </div>
              <p className='self-end pr-5'><span><Skeleton animation="wave" width={40} height={30} /></span></p>
          </div>
          </div>
          <div className='flex flex-col'>
            <br />
            <div className='px-10'>
              <p><Skeleton animation="wave" width={250} height={40} /></p>
                <p className='my-6'><Skeleton animation="wave" width={150} height={30} /></p>
              <div className='flex items-center gap-2 my-6'>
                <LocationOnIcon />
                <Skeleton animation="wave" width={50} height={30} />
                <Skeleton animation="wave" width={50} height={30} />
                <Skeleton animation="wave" width={50} height={30} />
              </div>
              <div className='flex items-center gap-2 my-6'>
                <AccessTimeIcon />
                <Skeleton animation="wave" width={50} height={30} />
                <Skeleton animation="wave" width={50} height={30} />
              </div>
              <div className='flex items-center gap-2 my-6'>
                <AttachMoneyIcon />
                <p><Skeleton animation="wave" width={50} height={30} /></p><span> / </span><p><Skeleton animation="wave" width={50} height={30} /></p>
              </div>
              <div className='flex items-center gap-2 my-6'>
                <PsychologyIcon />
                <p><Skeleton animation="wave" width={50} height={30} /></p>
              </div>
              <div className='flex items-center gap-2 my-6'>
                <span>Apply before:</span>
                <p><Skeleton animation="wave" width={60} height={30} /></p>
              </div>
              
              <div className='w-full'>
                  <ul className='pl-0 flex gap-[10px]'>
                  <Skeleton animation="wave" width={80} height={40} />
                  </ul>
              </div>
            </div>
          </div>
          <div className='mx-5'>
              
          </div>
          <div className='mx-10 mt-0'>
            <br />
            <Divider />
            <p className='text-3xl mt-5 font-bold'>Job Description</p>
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
    </>
  )
}

export default JobDetailSkeleton