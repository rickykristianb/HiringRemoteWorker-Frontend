import { ReactComponent as Logo } from "../assets/images/logo 90x90.svg"
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Link, useNavigate } from 'react-router-dom';
import Button from "./Button";
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import React, {useContext, useEffect, useState} from 'react'
import AuthContext from "../Context/AuthContext";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Divider, IconButton } from "@mui/material";
import EmailContext from "../Context/EmailContext";
import NotificationMessage from "./NotificationMessage";

const Headers = (props) => {   

  const [isProfileClicked, setIsProfileClicked] = useState(false)
  const [totalUnreadNotification, setTotalUnreadNotification] = useState(0)
  const [isNotificationContainerOpen, setIsNotificationContainerOpen] = useState(false)

  const [loginUserId, setLoginUserId] = useState()
  const navigate = useNavigate()
  let {user, logoutUser, authToken} = useContext(AuthContext)

  let userToken;
  if (authToken){
    userToken = authToken.access
  }

  let localDataUserName = localStorage.getItem("username")
  let localLoginUserId = localStorage.getItem("userId")
  let loginUserType = localStorage.getItem("userType")

  let localDataProfilePicture = localStorage.getItem("login_user_profile_picture")
  const [profilePicture, setProfilePicture] = useState(localDataProfilePicture) 

  useEffect(() => {
    setProfilePicture(localDataProfilePicture)
  }, [localDataProfilePicture])

  const {messageUnreadCount} = useContext(EmailContext)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#profile-menu')) {
        setIsProfileClicked(false);
      }
    }
    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const onLoadTotalUnreadNotification = async() => {
    const response = await fetch(`/api/job/get_total_unread_notification/`,{
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": `JWT ${userToken}`
      }
    });
    const data = await response.json()
    if (response.ok){
      setTotalUnreadNotification(data)
    }
  }

  useEffect(() => {
    onLoadTotalUnreadNotification()
  }, [])

  useEffect(() => {
    const onClickDocumentCloseNotificationBox = (e) => {
      if (!e.target.closest('#notification-menu')) {
        setIsNotificationContainerOpen(false)
      }
    }

    document.addEventListener("click", onClickDocumentCloseNotificationBox)

    return () => {
        document.removeEventListener("click", onClickDocumentCloseNotificationBox);
    };
  }, [])

  const onClickNotification = () => {
    setIsNotificationContainerOpen(!isNotificationContainerOpen)
  }

  return (
    <nav className="nav">
      <div>        
        <a href="#">
          <Logo className="logo-header" sx={{ alignSelf: "flex-end"}}/>
        </a>
      </div>
      <div>
        <ul className="navbar-menu">
        {user && 
        <>
        <li>
          <Link to={loginUserType === "personal" ? `/profile/?id=${localLoginUserId}` : `/profile/company/?id=${localLoginUserId}`} >
            <li><span className="user-name">{ localDataUserName }</span></li>   {/*//  <--- name Auth context */}
          </Link>
          </li>
          <li>
            <Link to="/messages/?tab=inbox">
              <Badge badgeContent={messageUnreadCount ? messageUnreadCount : null} color="error" >
                <MailIcon sx={{ width: 30, height: 30, color: "#4e6e81"}} />
              </Badge>
            </Link>
          </li>
          <li onClick={(e) => onClickNotification(e)} id="notification-menu">
            <Badge badgeContent={totalUnreadNotification ? totalUnreadNotification : null} color="error" >
              <NotificationsIcon sx={{ width: 30, height: 30, color: "#4e6e81"}} />
            </Badge>
            {isNotificationContainerOpen &&
              <div id="notification-message-container">
                <NotificationMessage onClickNotification={() => onLoadTotalUnreadNotification()} notificationType={loginUserType === "personal" ? "personal" : "company"} />
              </div>
            }
          </li>
          </>
        }
          <li>
            <Link to={loginUserType === "personal" ? "/jobs/" : "/users/"}>
              <HomeRoundedIcon sx={{ width: 30, height: 30, color: "#4e6e81" }} />
            </Link>
          </li>
          {user ? 
            (loginUserType === "personal" ?
              <>
                <div className="profile-menu-container">
                    <li id="profile-menu" onClick={() => setIsProfileClicked(!isProfileClicked)}>
                        <Avatar alt="Remy Sharp" src={profilePicture} sx={{ width: 30, height: 30, color: "#4e6e81" }} /> 
                    </li>
                  {isProfileClicked && 
                    <ul className="company-profile-menu">
                      <Link to={`/profile/?id=${localLoginUserId}`} >
                        <li>Profile</li>
                      </Link>
                      <Divider />
                      <Link to="/interested-jobs/" >
                        <li>Interested Jobs</li>
                      </Link>
                    </ul>
                  }
                </div>
              </>
              :
              <div className="profile-menu-container">
                  <li id="profile-menu" onClick={() => setIsProfileClicked(!isProfileClicked)}>
                      <Avatar alt="Remy Sharp" src={profilePicture} sx={{ width: 30, height: 30, color: "#4e6e81" }} /> 
                  </li>
                {isProfileClicked && 
                  <ul className="company-profile-menu">
                    <Link to={`/profile/company/?id=${localLoginUserId}`} >
                      <li>Profile</li>
                    </Link>
                    <Divider />
                    <Link to="/company-panel/?tabs=profile" >
                      <li>Manage</li>
                    </Link>
                    <Divider />
                    <Link to={"/add-job/"} >
                      <li id="post-job-menu"><AddIcon sx={{fontSize: "20px"}} /><>Post Job</></li>
                    </Link>
                  </ul>
                }
              </div>              
            )                  
          :
            <Link to={"/login/"} >
            <li>
              <AccountCircle sx={{ width: 30, height: 30, color: "#4e6e81" }} />    {/*If not login */}
            </li>
          </Link>
          }
          <li>
          { !user 
            ? 
            <Link to="/login/">
              <Button label="Login" buttonType="button" />
            </Link>
            :
            <Button label="Logout" buttonType="button" clickedButton={ logoutUser } />
          }
          </li>
          <li>
          { !user 
            &&
            <Link to="/register/">
              <Button label="Sign-up" buttonType="button" />
            </Link>
          }
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Headers