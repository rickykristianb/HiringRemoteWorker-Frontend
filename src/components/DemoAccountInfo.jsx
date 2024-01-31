import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';

const DemoAccountInfo = () => {

    const [openCredential, setOpenCredential] = useState(false)

    const onClickDemoTitle = () => {
        setOpenCredential(!openCredential)
    }

  return (
    <div className='fixed flex flex-col items-start gap-5 bottom-8 left-8 max-sm:bottom-5 max-sm:left-1 transition-all duration-300'>
        {openCredential &&
            <div className='bg-dark-basic text-white max-sm:w-[376px] p-4 rounded-lg'>
                <div>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-xl font-bold mb-2'>Candidate</h3>
                        <CloseIcon className='mb-3' onClick={() => setOpenCredential(false)} />
                    </div>
                    <div className='flex flex-col pl-3'>
                        <span>Email: candidate.demo@rickykristianbutarbutar.com</span>
                        <span>Password: C4nD1d4te1234</span>
                    </div>
                </div>
                <br />
                <div>
                    <h3 className='text-xl font-bold mb-2'>Company</h3>
                    <div className='flex flex-col pl-3'>
                        <span>Email: company.demo@rickykristianbutarbutar.com</span>
                        <span>Password: C0mp4ny1234</span>
                    </div>
                </div>
            </div>
        }
        <div className='bg-dark-basic text-white px-6 py-3 rounded-md border-dark-basic border cursor-pointer transition-all duration-300 hover:bg-white hover:text-dark-basic max-md:hover:bg-dark-basic max-md:hover:text-white ' onClick={() => onClickDemoTitle()}>
            <p>Demo account</p>
        </div>
    </div>
  )
}

export default DemoAccountInfo