import React, {useState, useRef, useContext, useEffect} from 'react'
import Button from '../components/Button'
import AuthContext from '../Context/AuthContext';
import ProfileContext from '../Context/ProfileContext';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import ProfileIntroduction from './ProfileIntroduction';

const ProfileHeaders = (props) => {

    let { authToken } = useContext(AuthContext)
    let { profile } = useContext(ProfileContext)

    const userToken = authToken.access

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
                "Authorization": `JWT ${userToken}`
            },
            body: formData
        })
        const data = await response.json()
        if (response.status === 200){
            localStorage.setItem("profile_picture", data["profile_image"])
            setProfilePicture(data["profile_image"])
        }
      };

    const handleClickChange = () => {
        fileInputRef.current.click();
    }

    const generateStars = () => {
        const stars = []
        const userRate = props.userData.userRate

        for (let i=1; i< 6; i++){
            if ( i === userRate ){
                const starClass = 'fa fa-star'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            } else if ( i < userRate ){
                const starClass = 'fa fa-star'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            } else if (i > userRate && i - 1 < userRate){
                // const starClass = 'fa fa-star-o'
                const starClass = 'fa-solid fa-star-half-stroke'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            } else if (i < userRate < i+1){
                const starClass = 'fa fa-star-o'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            } else {
                const starClass = 'fa fa-star-o'
                // const starClass = 'fa-solid fa-star-half-stroke'
                stars.push(<li key={i}><p><i className={starClass}></i></p></li>);
            }
        }
        return stars
    }

  return (
    <div className='profile_detail_header'>
        <div className='profilepicture-rate-name'>
            <div className='profile_picture'>
                <div className='profile_image'>
                    <img
                    src={profilePicture} // Replace with the actual path or URL of your image
                    alt={profile.name}
                    className="profile_image"
                    />
                </div>
                <div className='change-progress-image-button'>
                    <div className='input-button-change-image' onClick={handleClickChange}>
                        Change
                    </div>
                    {/* {uploadProgress !== 0 && <progress value={uploadProgress} max="100"></progress> } */}
                    <input
                        type='file'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleChangeUploadImage}
                    />
                </div>
            </div>
            <div className='rate-name'>
                <div className='profile-rate'>
                    <Tooltip className='tooltip'  TransitionComponent={Zoom} placement="right" title={props.userData.userRate} arrow>
                        <ul className='rate-stars'>{generateStars()}</ul>
                    </Tooltip>
                </div>
                <div className='user-fullname'>
                    <h1>{props.userData.name}</h1>
                </div>
            </div>
            <div className='profile_action'>
                <Button label="Send Message" buttonType="button" />
                <Button label="Eliminate" buttonType="button" customStyle={{backgroundColor: "red", color: "white", border: "1px solid red"}} />
            </div>
        </div>
        <ProfileIntroduction userData={props.userData} />
        
        
        {/* <div className='total_payment_summary_container'>
            <div className='total_payment'>
                <p>Total Payment Received</p>
                <Divider />
                <p>$100.000</p>
                <Button buttonType="button" label="download total payment"/>
            </div>
        </div> */}
    </div>
  )
}

export default ProfileHeaders