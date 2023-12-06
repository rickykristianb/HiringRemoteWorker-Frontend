import { ReactComponent as Logo } from "../assets/images/logo 90x90.svg"
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Link, useNavigate } from 'react-router-dom';
import Button from "./Button";
import Avatar from '@mui/material/Avatar';

import React, {useContext, useEffect, useState} from 'react'
import AuthContext from "../Context/AuthContext";
import ProfileContext from "../Context/ProfileContext";
import { IconButton } from "@mui/material";
import EmailContext from "../Context/EmailContext";

const Headers = (props) => {   

  const navigate = useNavigate()
  let {user, logoutUser} = useContext(AuthContext)
  let {profile} = useContext(ProfileContext)

  let localDataUserName = localStorage.getItem("username")
  const [userName, setUsername] = useState(() => localDataUserName)

  let localDataProfilePicture = localStorage.getItem("profile_picture")
  const [profilePicture, setProfilePicture] = useState(() => localDataProfilePicture) 

  useEffect(() => {
    setProfilePicture(localStorage.getItem("profile_picture"))
  }, [localDataProfilePicture])

  const {messageUnreadCount} = useContext(EmailContext)

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
          <Link to="/profile/" >
            <li><a className="user-name">{ userName }</a></li>   {/*//  <--- name Auth context */}
          </Link>
          </li>
          <li>
            <Link to="/messages/">
              <Badge badgeContent={messageUnreadCount} color="error" >
                <MailIcon sx={{ width: 30, height: 30, color: "#4e6e81"}} />
              </Badge>
            </Link>
          </li>
          <li>
            <Link to={"/"}>
              <a href="/home">
                  <HomeRoundedIcon sx={{ width: 30, height: 30, color: "#4e6e81" }} />
              </a>
            </Link>
          </li>
        </>
        }
          
          {user ? 
            <Link to="/profile/" >
            <li>
                <Avatar alt="Remy Sharp" src={profilePicture} sx={{ width: 30, height: 30, color: "#4e6e81" }} /> 
            </li>
          </Link>
          :
            <Link to="/profile/" >
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