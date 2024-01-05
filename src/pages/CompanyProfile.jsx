import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


// Components
import CompanyProfileHeader from 'components/Profile/CompanyProfile/CompanyProfileHeader'
import EditBioForm from 'components/EditBioForm';
import CompanyBio from 'components/Profile/CompanyProfile/CompanyBio';
import AlertDialog from 'components/AlertDialog';
import AlertNotification from 'components/AlertNotification';
import AuthContext from 'Context/AuthContext';
import Backdrop from 'components/Backdrop';
import JobPosted from 'components/Profile/CompanyProfile/JobPosted';

const CompanyProfile = () => {
    const [clickedUserId, setClickedUserId] = useState()
    const [headerUserData, setHeaderUserData] = useState([])
    const [bioUserData, setBioUserData] = useState([])
    const [locationUserData, setLocationUserData] = useState([])
    const [locationChangeUserData, setLocationChangeUserData] = useState([])
    const [locationFieldError, setLocationFieldError] = useState()
    const [tempSaveData, setTempSaveData] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [alertResponse, setAlertResponse] = useState()
    const [isBackDropActive, setIsBackdropActive] = useState(false)
    const location = useLocation();

    const navigate = useNavigate()

    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setClickedUserId(id)
      }, [location.search])

    const onGetProfile = async () => {
        const id = clickedUserId
        try {
          if (id !== null){
            const response = await fetch(`/api/user/profile/${id.toString()}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              }
            });

            try{
              const data = await response.json()
              if (response.status === 200){
                    setHeaderUserData({
                      userRate: data?.rate_ratio,
                      name: data?.name,
                      email: data?.email,
                      phoneNumber: data?.phone_number,
                      address: data?.address,
                      profilePicture: data?.profile_picture,  // Use the correct method name
                      // location: data.userLocation ? data.userLocation["location"]["location"]: null
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
              } else if (response.status === 404){
                navigate("/user-not-found/")
              }
            } catch (error){
              navigate("/user-not-found/")
            }
          } 
          else {
            navigate("/user-not-found/")
          }
        }catch {
        }  
    }

    useEffect(() => {
        onGetProfile()
    }, [clickedUserId])

    const openEditForm = () => {
        setIsEdit(true)
    }
     
    const onClickCancelEdit = (e) => {

      if(e.target.classList.contains("edit-company-profile-container") || e.target.classList.contains("company-profile-cancel-button")){
        setIsEdit(false)
        setHeaderUserData({
          userRate: tempSaveData.userRate,
          name: tempSaveData.name,
          email: tempSaveData.email,
          phoneNumber: tempSaveData.phoneNumber,
          address: tempSaveData.address,
          profilePicture: tempSaveData.profilePicture  // Use the correct method name
        })
        setLocationUserData(tempSaveData.location)
        console.log(tempSaveData["bio"]);
        setBioUserData({bio: tempSaveData["bio"]})
        setLocationFieldError()
      }
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

      setLocationChangeUserData({
        location: option["id"]
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
              onGetProfile();
              setIsBackdropActive(false); // Deactivate backdrop after onGetProfile
              setAlertResponse({ "success": "Profile saved" });
            }, 1000);
            
          } else {
            setAlertResponse({ "error": data["error"] });
          }
        }
        
      } catch (error){
        setAlertResponse({ "error": error.toString() });
      }
      setLocationFieldError()
    };   

  return (
    <div className="company-profile-container">
        <CompanyProfileHeader 
          userData={{headerData: headerUserData, bioData: bioUserData, locationData: locationUserData}} 
          clickedUserId={clickedUserId} 
          clickEdit={openEditForm} 
        />
        <CompanyBio userData={bioUserData} clickedUserId={clickedUserId} />
        <JobPosted clickedUserId={clickedUserId} />
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

export default CompanyProfile