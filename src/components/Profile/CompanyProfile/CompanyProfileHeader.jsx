import React, { useContext, useEffect, useRef, useState } from 'react'
import AuthContext from 'Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import RateGenerator from 'components/RateGenerator'

import Zoom from '@mui/material/Zoom';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Divider, Tooltip } from '@mui/material';
import Button from 'components/Button';

const CompanyProfileHeader = (props) => {

  const navigate = useNavigate()

  const [loginUserId, setLoginUserId] = useState()
  useEffect(() => {
      setLoginUserId(localStorage.getItem("userId"))
  }, [])

  let  userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    } 

  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef();

  const localProfileImage = localStorage.getItem("profile_picture")
  const [profilePicture, setProfilePicture] = useState()

  useEffect(() => {
    setProfilePicture(props.userData?.headerData.profilePicture)
    localStorage.setItem("profile_picture", props.userData?.headerData.profilePicture)
  }, [props.userData?.headerData])

const handleChangeUploadImage = async (e) => {
    setUploadProgress(0)
    const formData = new FormData()
    const selectedFile = fileInputRef.current.files[0];

    if (selectedFile){
        formData.append('image', selectedFile)
        console.log(formData);
    }
    const response = await fetch("/api/user/save_user_image/", {
        
        method: "POST",
        headers: {
            "Authorization": `JWT ${userAuthToken}`
        },
        body: formData
    })
    const data = await response.json()
    if (response.status === 200){
        localStorage.setItem("profile_picture", data["profile_image"])
        localStorage.setItem("login_user_profile_picture", data["profile_image"])
        setProfilePicture(data["profile_image"])
    }
  };

  const handleClickChange = () => {
      fileInputRef.current.click();
  }

  const onButtonEditClicked = () => {

  }

  return (
      <div className='company-profile-header'>
        
        <div className='profile_picture'>
          <div className='profile_image'>
              <img
              src={profilePicture} // Replace with the actual path or URL of your image
              alt={"profile-picture"}
              className="profile_image"
              />
          </div>
          <div className='change-progress-image-button'>
              {loginUserId === props.clickedUserId &&
                  <div className='input-button-change-image' onClick={handleClickChange}>
                      Change
                  </div>
              }
              <input
                  type='file'
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleChangeUploadImage}
              />
          </div>
          <div className='rate-name-company-profile'>
                <div className='profile-rate'>
                    <RateGenerator rating={props.userData?.headerData.userRate} />
                </div>
                <div className='user-fullname'>
                    <h1>{props.userData?.headerData.name}</h1>
                </div>
                <Divider />
                <br />
                <div className='basic-company-info'>
                  <div className='company-phone-email'>
                    <div>
                      <LocalPhoneIcon /><span>{props.userData?.headerData.phoneNumber}</span>
                    </div>
                    <div>
                      <EmailIcon /><span>{props.userData?.headerData.email}</span>
                    </div>
                  </div>
                  <div className='company-address'>
                    <div>
                      <LocationOnIcon /><span>{props.userData?.locationData.location}</span>
                    </div>
                    <br />
                    {props.userData?.headerData.address}
                    <br />
                    <br />
                    {loginUserId === props.clickedUserId && 
                      <Button clickedButton={props.clickEdit} customClassName="company-bio-button" buttonType="button" label="Edit" />
                    }
                  </div>
                </div>
            </div>
        </div>
      </div>
  )
}

export default CompanyProfileHeader