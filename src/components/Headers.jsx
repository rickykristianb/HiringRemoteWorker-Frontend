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
import ProfileContext from "../Context/ProfileContext";
import { Divider, IconButton } from "@mui/material";
import EmailContext from "../Context/EmailContext";

const Headers = (props) => {   

  const [isProfileClicked, setIsProfileClicked] = useState(false)

  const [loginUserId, setLoginUserId] = useState()
  const navigate = useNavigate()
  let {user, logoutUser} = useContext(AuthContext)

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
            <li><a className="user-name">{ localDataUserName }</a></li>   {/*//  <--- name Auth context */}
          </Link>
          </li>
          <li>
            <Link to="/messages/">
              <Badge badgeContent={messageUnreadCount ? messageUnreadCount : null} color="error" >
                <MailIcon sx={{ width: 30, height: 30, color: "#4e6e81"}} />
              </Badge>
            </Link>
          </li>
          </>
        }
          <li>
            <Link to={"/users/"}>
              <HomeRoundedIcon sx={{ width: 30, height: 30, color: "#4e6e81" }} />
            </Link>
          </li>
          {user ? 
            (loginUserType === "personal" ?
              <Link to={`/profile/?id=${localLoginUserId}` } >
                <li>
                    <Avatar alt="Remy Sharp" src={profilePicture} sx={{ width: 30, height: 30, color: "#4e6e81" }} /> 
                </li>
              </Link>  
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
                    <li>Jobs Posted</li>
                    <Divider />
                    <li id="post-job-menu"><AddIcon sx={{fontSize: "20px"}} /><>Post Job</></li>
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