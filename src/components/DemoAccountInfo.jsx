import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';

const DemoAccountInfo = () => {

    const [openCredential, setOpenCredential] = useState(false)

    const onClickDemoTitle = () => {
        setOpenCredential(!openCredential)
    }



  return (
    <div id='demo-account-info-container'>
        {openCredential &&
            <div id='demo-account-info-content'>
                <div className='account-wrapper'>
                    <div id='account-name-close-button'>
                        <h3>Candidate</h3>
                        <CloseIcon onClick={() => setOpenCredential(false)} />
                    </div>
                    <div className='account-credential'>
                        <span>Email: contact@rickykristianbutarbutar.com</span>
                        <span>Password: Bdba7649</span>
                    </div>
                </div>
                <div className='account-wrapper'>
                    <h3>Company</h3>
                    <div className='account-credential'>
                        <span>Email: learnpythn@gmail.com</span>
                        <span>Password: Bdba7649</span>
                    </div>
                </div>
            </div>
        }
        <div id='demo-account-info-title' onClick={() => onClickDemoTitle()}>
            <p>Demo account</p>
        </div>
    </div>
  )
}

export default DemoAccountInfo