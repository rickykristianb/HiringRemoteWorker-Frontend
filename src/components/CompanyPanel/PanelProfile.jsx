import AuthContext from 'Context/AuthContext'
import ProfileContext from 'Context/ProfileContext'
import Button from 'components/Button'
import EditBioForm from 'components/EditBioForm'
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import Backdrop from 'components/Backdrop'
import AlertNotification from 'components/AlertNotification'

const PanelProfile = () => {

  let  userAuthToken
  let { authToken } = useContext(AuthContext)
  if (authToken){
      userAuthToken = authToken.access
  } 

  const [panelProfileData, setPanelProfileData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [headerUserData, setHeaderUserData] = useState([])
  const [bioUserData, setBioUserData] = useState([])
  const [locationUserData, setLocationUserData] = useState([])
  const [tempSaveData, setTempSaveData] = useState([])
  const [locationFieldError, setLocationFieldError] = useState()
  const [isBackDropActive, setIsBackdropActive] = useState(false)
  const [alertResponse, setAlertResponse] = useState()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    let loginUserId =localStorage.getItem('userId');
    if (loginUserId) {
      onLoadUserProfile(loginUserId);
    }
  };

  const onLoadUserProfile = async(id) => {
    try{
      const response = await fetch(`/api/user/profile/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
      });
      const data = await response.json()
      if (response.ok){
        setPanelProfileData(data)
        
        setHeaderUserData({
          userRate: data?.rate_ratio,
          name: data?.name,
          email: data?.email,
          phoneNumber: data?.phone_number,
          address: data?.address,
          profilePicture: data?.profile_picture,  // Use the correct method name
        })

        setBioUserData({
          bio: data?.bio,
        })

        setLocationUserData(data?.userlocation?.location)

        setTempSaveData({
          userRate: data?.rate_ratio,
          name: data?.name,
          email: data?.email,
          phoneNumber: data?.phone_number,
          address: data?.address,
          profilePicture: data?.profile_picture,  // Use the correct method name
          location: data?.userlocation?.location,
          bio: data?.bio,
        })
      }
    } catch (error){
    
    }
  }

  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef();

  const localProfileImage = localStorage.getItem("profile_picture")
  const [profilePicture, setProfilePicture] = useState()

  useEffect(() => {
      setProfilePicture(panelProfileData?.profile_picture)
      localStorage.setItem("profile_picture", panelProfileData?.profile_picture)
  }, [panelProfileData])

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

const onClickEditButton = () => {
  setIsEdit(true)

  document.body.classList.add('disable-scroll');
}

const onClickCancelEdit = () => {
  setIsEdit(false)

  document.body.classList.remove('disable-scroll');
}

const onChangeHeaderFormInput = (e) => {
  const {name, value} = e.target
  setHeaderUserData((prevValue) => {
    return {
      ...prevValue,
      [name]: value
    }
  })
  console.log(headerUserData);
}

const onChangeBioFormInput = (e) => {
  const {name, value} = e.target
  setBioUserData((prevValue) => {
    return {
      ...prevValue,
      [name]: value
    }
  })
}

const onChangeLocationForm = (option) => {
  console.log(option);
  setLocationUserData({
    id: option["id"],
    location: option["value"]
  })
}

const onSaveEditProfile = async (e) => {
  try{
    if (locationUserData === null){
      return setLocationFieldError({"error": "Please select location"})
    } else {
      const response = await fetch("/api/user/save_company_profile/", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userAuthToken}`,
        },
        body: JSON.stringify({
          name: headerUserData["name"],
          email: headerUserData["email"],
          phoneNumber: headerUserData["phoneNumber"],
          location: locationUserData?.id ? locationUserData["id"] : null,
          address: headerUserData["address"],
          bio: bioUserData["bio"],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        
        setIsEdit(false);
        // ADD LOADING ASYNC HERE
        setIsBackdropActive(true);
        setTimeout(() => {
          fetchData();
          setIsBackdropActive(false); // Deactivate backdrop after onGetProfile
          setAlertResponse({ "success": "Profile saved" });
        }, 1000);
        
      } else {
        setAlertResponse({ "error": data["error"] });
      }
    }
    
  } catch (error){
    setAlertResponse({ "error": error.toString() });
  } finally {
    setLocationFieldError()
    document.body.classList.remove('disable-scroll');
  }
  
};   

  return (
    <div id='panel-profile-content-container'>
      <div id="panel-profile-content-image-edit-button">
        <div className='profile_picture'>
          <div className='profile_image'>
            <img
            src={profilePicture} // Replace with the actual path or URL of your image
            alt={"profile.name"}
            className="profile_image"
            />
          </div>
          <div className='change-progress-image-button'>
            <div className='input-button-change-image' onClick={handleClickChange}>
                Change
            </div>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleChangeUploadImage}
            />
          </div>
        </div>
        <div>
          <Button buttonType="button" label="Edit" clickedButton={() => onClickEditButton()} />
        </div>
      </div>
      <br />
      <br />
      <div id="panel-profile-info-container">
        <div className='profile-info'>
          <div className='profile-info-name'>
            <p><b>Name</b></p>
          </div>
          <div className='profile-info-data'>
            <p>{panelProfileData?.name}</p>
          </div>
        </div>
        <div className='profile-info'>
          <div className='profile-info-name'>
            <p><b>Email</b></p>
          </div>
          <div className='profile-info-data'>
            <p>{panelProfileData?.email}</p>
          </div>
        </div>
        <div className='profile-info'>
          <div className='profile-info-name'>
            <p><b>Phone</b></p>
          </div>
          <div className='profile-info-data'>
            <p>{panelProfileData?.phone_number}</p>
          </div>
        </div>
        <div className='profile-info'>
          <div className='profile-info-name'>
            <p><b>Location</b></p>
          </div>
          <div className='profile-info-data'>
            <p>{panelProfileData?.userlocation?.location.location}</p>
          </div>
        </div>
        <div className='profile-info'>
          <div className='profile-info-name'>
            <p><b>Address</b></p>
          </div>
          <div className='profile-info-data'>
            <p>{panelProfileData?.address}</p>
          </div>
        </div>
        <div className='profile-info'>
          <div className='profile-info-name'>
            <p><b>Profile</b></p>
          </div>
          <div className='profile-info-data'>
            <p>{panelProfileData?.bio?.split("\n").map((line, i) => {
              return (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              )
            })}</p>
          </div>
        </div>
      </div>
      {isEdit && 
      <EditBioForm 
        userData={{headerData: headerUserData, bioData: bioUserData, locationData: locationUserData}} 
        locationFieldError={locationFieldError}
        onChangeHeaderFormInput={onChangeHeaderFormInput}
        onChangeBioForm={onChangeBioFormInput}
        onChangeLocationForm={onChangeLocationForm}
        saveEditProfile={onSaveEditProfile} 
        onClickCancel={onClickCancelEdit}  
      />}
      <AlertNotification alertData={alertResponse} />
      { isBackDropActive && <Backdrop /> }
    </div>
  )
}

export default PanelProfile