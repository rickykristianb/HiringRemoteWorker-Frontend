import React, { useEffect, useState, useContext } from 'react'
import Button from '../../Button'
import AuthContext from '../../../Context/AuthContext'
import AlertNotification from '../../AlertNotification';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileIntroduction = (props) => {
    const [loginUserId, setLoginUserId] = useState()

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    const navigate = new useNavigate()
    const [userData, setUserData] = useState(null)
    const [isSaved, setIsSaved] = useState(true)
    const [alertResponse, setAlertResponse] = useState()

    let { authToken, user } = useContext(AuthContext)
    const userToken = authToken?.access

    const [profileChange, setProfileChange] = useState({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
        shortIntro: "",
        bio: ""
    })

    const [profile, setProfile] = useState({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
        shortIntro: "",
        bio: "",
        image: null,
        userRate: ""
    })
    
    const onLoadProfile = () => {
        setProfile({
            name: props.userData.name,
            username: props.userData.username,
            email: props.userData.email,
            phoneNumber: props.userData.phoneNumber,
            shortIntro: props.userData.shortIntro,
            bio: props.userData.bio,
        })

        setProfileChange({
            name: props.userData.name,
            username: props.userData.username,
            email: props.userData.email,
            phoneNumber: props.userData.phoneNumber,
            shortIntro: props.userData.shortIntro,
            bio: props.userData.bio,
        })
    }
   
    useEffect(() => {
        onLoadProfile()
    }, [props.userData])

    const updateUserData = (newUpdateUser) => {
        setUserData(newUpdateUser)
    };

    const onSaveProfile = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch("/api/user/save_profile/", {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userToken}`
                },
                body: JSON.stringify(profileChange)
                
            })
            const data = await response.json()
            if (response.status === 201){
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    ...profileChange
                }))
                setIsSaved(true)
                updateUserData(profileChange)
                setAlertResponse({"success": data.success})
            } else if (response.status === 401){
                localStorage.removeItem("authToken")
                navigate("/login")
            } else if (response.status === 400){
                setAlertResponse({"error": data.error})
            }
        } catch (errors){
            console.error(errors);
        }
    }

    const onChangeProfileInput = (e) => {
        const {name, value} = e.target
        setProfileChange((prevProfileChange) => ({
            ...prevProfileChange,
            [name]: value
        }))
    }

    const onClickCancel = () => {
        setProfileChange(() => ({
            ...profile
        }))
        setIsSaved(true)
    } 
    
  return (
    <div className='profile-container'>
        {isSaved ? 
            <div className='profile-detail'>
                <h2>{profile.shortIntro}</h2>
                <Divider />
                <br />
                <div className='profile-detail-bio'>
                <label><b>Bio</b></label>
                <p className='profile-content'>{profile.bio}</p>
                </div>
                <label><b>Username</b></label>
                <p className='profile-content'>{profile.username}</p>
                <label><b>Email</b></label>
                <p className='profile-content'>{profile.email}</p>
                <label><b>Phone Number</b></label>
                <p className='profile-content'>{profile.phoneNumber}</p>

                {loginUserId === props.clickedUserId && 
                    <Button buttonType="button" label="Edit" clickedButton={() => setIsSaved(false)} />
                }
                

            </div>
        :
            <div className='profile-input'>
                <form onSubmit={onSaveProfile}>
                    <div className='profile-input-field'>
                        <label>Name</label>
                        <input className='input-field' 
                            onChange={(e) => onChangeProfileInput(e)}
                            name='name'
                            value={profileChange.name}
                        ></input>
                    </div>
                    <div className='profile-input-field'>
                        <label>Short Intro</label>
                        <input className='input-field' 
                            onChange={(e) => onChangeProfileInput(e)}
                            name='shortIntro'
                            value={profileChange.shortIntro}
                        ></input>
                    </div>
                    <div className='profile-input-field'>
                        <label>Bio</label>
                    <textarea rows="10" className='profileTextArea' 
                        onChange={(e) => onChangeProfileInput(e)}
                        name='bio'
                        value={profileChange.bio}
                    ></textarea>
                    </div>          
                    <div className='profile-input-field'>
                        <label>Username</label>
                        <input className='input-field' 
                            onChange={(e) => onChangeProfileInput(e)}
                            name='username'
                            value={profileChange.username}
                            disabled
                        ></input>
                    </div>
                    <div className='profile-input-field'>
                        <label>Email</label>
                        <input className='input-field' 
                            onChange={(e) => onChangeProfileInput(e)}
                            name='email'
                            value={profileChange.email}
                            disabled
                        ></input>
                    </div>
                    <div className='profile-input-field'>
                        <label>Phone Number</label>
                        <input className='input-field' 
                            onChange={(e) => onChangeProfileInput(e)}
                            name='phoneNumber'
                            value={profileChange.phoneNumber}
                        ></input>
                    </div>
                    <br />
                    <div id='profile-introduction-save-cancel-button'>
                        <Button buttonType="input" label="Save" customClassName="profile-introduction-save-button" />
                        <Button buttonType="button" label="Cancel" customClassName="profile-introduction-cancel-button" clickedButton={onClickCancel} />
                    </div>
                </form>
                
            </div>
        }  
        <AlertNotification alertData={alertResponse}/>     
    </div>       
  )
}

export default ProfileIntroduction