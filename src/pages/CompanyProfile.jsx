import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


// Components
import CompanyProfileHeader from 'components/Profile/CompanyProfile/CompanyProfileHeader'
import EditBioForm from 'components/EditBioForm';
import CompanyBio from 'components/Profile/CompanyProfile/CompanyBio';
import AlertNotification from 'components/AlertNotification';
import AuthContext from 'Context/AuthContext';
import Backdrop from 'components/Backdrop';
import JobPosted from 'components/Profile/CompanyProfile/JobPosted';
import UserRatings from 'components/UserRatings';
import CompanyProfileSkeleton from 'components/Skeleton/CompanyProfileSkeleton';

const CompanyProfile = () => {
    const [clickedUserId, setClickedUserId] = useState()
    const [headerUserData, setHeaderUserData] = useState([])
    const [bioUserData, setBioUserData] = useState([])
    const [locationUserData, setLocationUserData] = useState([])
    const [locationFieldError, setLocationFieldError] = useState()
    const [tempSaveData, setTempSaveData] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [alertResponse, setAlertResponse] = useState()
    const [isBackDropActive, setIsBackdropActive] = useState(false)
    const [ratingData, setRatingData] = useState([])
    const [getProfileLoading, setGetProfileLoading] = useState(false)
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
          setGetProfileLoading(true)
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
        }catch (error) {
          console.error(error);
        } finally {
          setGetProfileLoading(false)
        }
    }

    useEffect(() => {
        onGetProfile()
    }, [clickedUserId])

    const openEditForm = () => {
        setIsEdit(true)
        document.body.classList.add('disable-scroll');
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
        setBioUserData({bio: tempSaveData["bio"]})
        setLocationFieldError()
      }
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
      } finally {
        setLocationFieldError()
        document.body.classList.remove('disable-scroll');
      }
    };   

    const loadUserRatings = async() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');

        const response = await fetch(`/api/rating/get_user_rating/?id=${id}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            }
        });
        const data = await response.json()
        if (response.ok){
            setRatingData(data)
        } else {
            setRatingData([])
        }
    }

    useEffect(() => {
        loadUserRatings()
    }, [])

  return (
    <>
      {getProfileLoading ?
        <CompanyProfileSkeleton />
      :
        <div className="flex flex-col gap-16 my-14 max-sm:mt-44 max-sm:mx-4 justify-center items-center">
          <div className='xl:w-[1000px] max-xl:px-12 max-sm:px-0 w-full max-sm:w-full flex flex-col gap-16'>
            <CompanyProfileHeader 
                userData={{headerData: headerUserData, bioData: bioUserData, locationData: locationUserData}} 
                clickedUserId={clickedUserId} 
                clickEdit={openEditForm} 
              />
              <CompanyBio userData={bioUserData} clickedUserId={clickedUserId} />
              <JobPosted clickedUserId={clickedUserId} />
              <UserRatings userId={clickedUserId} ratingData={ratingData} />

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
        </div>
      }
    </>
    
  )
}

export default CompanyProfile