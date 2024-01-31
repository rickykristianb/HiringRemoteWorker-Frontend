import React, { useContext, useEffect, useRef, useState } from 'react'
import AuthContext from 'Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import RateGenerator from 'components/RateGenerator'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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

  return (
      <div className='flex flex-col items-center justify-center bg-soft-basic  max-sm:mx-2 max-sm:h-[500px] rounded-3xl shadow-box-shadow'>
         <div className='profile-img relative bottom-10'>
              <img
              src={profilePicture} // Replace with the actual path or URL of your image
              alt={"profile-picture"}
              className="profile-img"
              loading='lazy'
              />
              <div className='flex self-end pl-[200px] max-sm:pl-[150px]'>
              {loginUserId === props.clickedUserId &&
              <>
                <div className='input-button-change-image' onClick={handleClickChange}>
                    Change
                </div>
                
                <input
                    type='file'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleChangeUploadImage}
                />
              </>
              }
            </div>
          </div>
          
          <div className='w-full px-12'>
            <div className='ml-20' onClick={() => navigate("/profile/company/#add-rating-company")}>
                <RateGenerator rating={Math.round(props.userData?.headerData.userRate * 10)/10} />
            </div>
            <div className='user-fullname'>
                <p className='text-[35px] font-bold'>{props.userData?.headerData.name}</p>
            </div>
            <Divider />
          </div>
          <br />
          <br />
          <div className='flex flex-wrap justify-between flex-row gap-4 w-full px-12'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-2'>
                <LocalPhoneIcon /><span>{props.userData?.headerData.phoneNumber}</span>
              </div>
              <div className='flex items-center gap-2'>
                <EmailIcon /><span className='break-all'>{props.userData?.headerData.email}</span>
              </div>
            </div>
            <div className='self-start'>
              <div className='flex items-center gap-2'>
                <LocationOnIcon /><span>{props.userData.locationData?.location}</span>
              </div>
              <br />
                {props.userData?.headerData.address}
              <br />
              <br />
              
            </div>
          </div>
        <div className='self-end pr-10 pb-10'>
          {loginUserId === props.clickedUserId && 
            <Button clickedButton={props.clickEdit} buttonType="button" label="Edit" />
          }
        </div>
      </div>
  )
}

export default CompanyProfileHeader