import React, {useState, useRef, useContext, useEffect} from 'react'
import Button from '../../Button'
import AuthContext from '../../../Context/AuthContext';
import ProfileContext from '../../../Context/ProfileContext';
import ProfileIntroduction from './ProfileIntroduction';
import RateGenerator from '../../RateGenerator';
import Location from './Location';
import { useNavigate } from 'react-router-dom';

const ProfileHeaders = (props) => {
    const navigate = useNavigate()
    const [newSetSavedName, setNewSetSavedName] = useState(null)

    const [loginUserId, setLoginUserId] = useState()
    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    let  userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    } 
    
    let { profile } = useContext(ProfileContext) 

    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef();

    const localProfileImage = localStorage.getItem("profile_picture")
    const [profilePicture, setProfilePicture] = useState()
    

    useEffect(() => {
        setProfilePicture(props.userData.profilePicture)
        localStorage.setItem("profile_picture", props.userData.profilePicture)
    }, [props.userData])
    
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

    const sendMessage = (data) => {
        navigate(`/messages/?email=${data}`)
    }

    const onSavedNewName = (name) => {
        setNewSetSavedName(name)
    }
    
  return (
    <>
        <div className='p-10 pl-0 max-sm:pl-0 max-sm:pt-0 xl:w-[30%] md:w-[40%]'>
            <div className='flex items-center w-full'>
                <div className='profile-img'>
                    <img
                    src={profilePicture} // Replace with the actual path or URL of your image
                    alt={profile.name}
                    className="profile-img"
                    loading='lazy'
                    />
                </div>
                <div className='change-progress-image-button'>
                    {loginUserId === props.clickedUserId &&
                        <div className='input-button-change-image' onClick={handleClickChange}>
                            Change
                        </div>
                    }
                    
                    {/* {uploadProgress !== 0 && <progress value={uploadProgress} max="100"></progress> } */}
                    <input
                        type='file'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleChangeUploadImage}
                    />
                </div>
            </div>
            <div className='flex flex-col mt-10 w-full'>
                <div className='flex pl-20 h-[40px]'>
                    <RateGenerator rating={Math.round(props.userData?.userRate * 10) / 10} />
                </div>
                <p className='text-3xl font-bold mb-4 break-words'>{newSetSavedName ? newSetSavedName : props.userData.name}</p>
            </div>
            <Location userData={props.userData.location} clickedUserId={props.clickedUserId} />
            {loginUserId !== props.clickedUserId && 
                <div className='profile_action'>
                    <Button clickedButton={() => sendMessage(props.userData.email)} label="Send Message" buttonType="button" />
                </div>
            }
        </div>
        <div className='xl:w-[70%] md:w-[60%] max-sm:w-full'>
            <ProfileIntroduction userData={props.userData} clickedUserId={props.clickedUserId} setNewName={onSavedNewName} />
        </div>
    </>
  )
}

export default ProfileHeaders