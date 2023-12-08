import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from './AuthContext';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const navigate = new useNavigate()
    const [userData, setUserData] = useState(null)
    const [isSaved, setIsSaved] = useState(true)

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
            } else if (response.status === 401){
                localStorage.removeItem("authToken")
                navigate("/login")
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

  const contextData = {
    userData:userData,
    updateUserData:updateUserData,
    profileChange:profileChange,
    profile:profile,
    onSaveProfile:onSaveProfile,
    onChangeProfileInput:onChangeProfileInput,
    isSaved:isSaved, 
    setIsSaved:setIsSaved,
    onClickCancel:onClickCancel
  };

  return (
    <ProfileContext.Provider value={contextData}>
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileContext;