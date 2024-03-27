import { ReactComponent as Logo } from "../assets/images/rwm.svg"
import { ReactComponent as Hamburger } from "../assets/images/hamburger.svg"
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Link, useLocation } from 'react-router-dom';
import Button from "./Button";
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import React, {useContext, useEffect, useState} from 'react'
import AuthContext from "../Context/AuthContext";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Divider, IconButton } from "@mui/material";
import NotificationMessage from "./NotificationMessage";
import NotificationContext from "../Context/NotificationContext";
import EmailContext from "../Context/EmailContext";
import SearchBox from "./SearchBoxPersonal";
import HeaderMobile from "./HeaderMobile";
import RwmLogoPng from "../assets/images/rwm.png"
import HeaderMediumToSmall from "./HeaderMediumToSmall";
import SearchBoxPersonal from "./SearchBoxPersonal";
import SearchBoxCompany from "./SearchBoxCompany";

const Headers = (props) => {   

  const [isProfileClicked, setIsProfileClicked] = useState(false)
  const [isNotificationContainerOpen, setIsNotificationContainerOpen] = useState(false)
  const [isSearchBarFocus, setIsSearchBarFocus] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileNotificationContainerOpen, setIsMobileNotificationContainerOpen] = useState(false)

  const location = useLocation()
  let { onLoadTotalUnreadNotification, totalUnreadNotification } = useContext(NotificationContext)

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

  useEffect(() => {
    if (loginUserType){
      onLoadTotalUnreadNotification()
    }
  }, [])

  const onClickNotification = () => {
    setIsNotificationContainerOpen(!isNotificationContainerOpen)
  }

  const onFocusInSearchBarSmallDevice = () => {
    setIsSearchBarFocus(true)
  }

  const onFocusOutSearchBarSmallDevice = () => {
    setIsSearchBarFocus(false)
  }

  const onOpenMobileHeaderMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.classList.add('disable-scroll');
  }

  const onCloseMobileHeaderMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.classList.remove('disable-scroll');
  }

  const onCloseMobileHeaderMenuFromBackground = (event) => {
    if (event.target.classList.contains('bg-mobile-menu-bg')) {
      onCloseMobileHeaderMenu();
    }
  }

  const onClickMobileNotification = () => {
    setIsMobileNotificationContainerOpen(!isMobileNotificationContainerOpen)
    onLoadTotalUnreadNotification()
  }

  return (
    <section id="nav">
      <nav className="max-md:hidden w-full flex justify-between items-center py-1 px-20 border-dark-basic shadow-box-shadow">
        <div>        
            <Logo className="logo-header" sx={{ alignSelf: "flex-end"}}/>
        </div>
        <div>
          <ul className="flex justify-center items-center gap-6">
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
                <div id="notification-message-container" 
                  className="w-[300px] h-[450px] max-sm:w-screen max-sm:h-screen absolute top-[80px] list-none p-0 m-0 bg-white border border-white shadow-box-shadow z-10 overflow-y-scroll">
                  <NotificationMessage onClickNotification={() => onLoadTotalUnreadNotification()} notificationType={loginUserType === "personal" ? "personal" : "company"} />
                </div>
              }
            </li>
            </>
          }
            <li>
              <Link to={!loginUserType ? "/": loginUserType === "personal" ? "/" : "/users/"}>
                <HomeRoundedIcon sx={{ width: 32, height: 32,  color: "#4e6e81" }} />
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
                        <Divider />
                        <Link to="/saved-jobs/" >
                          <li>Saved Jobs</li>
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

      {/* HEADER FOR MOBILE */}
      <nav className="md:hidden flex justify-between items-center px-5 border-dark-basic shadow-box-shadow h-20 z-6 fixed top-0 w-screen bg-white">
        <div>   
            <img src={RwmLogoPng} className={`${isSearchBarFocus ? "w-0" : "w-[100px]" } transition-all duration-300 ease-in`} />
        </div>
        <div className="flex gap-5 absolute right-5">
          {location.pathname === "/" &&
            <SearchBoxPersonal focus={onFocusInSearchBarSmallDevice} blur={onFocusOutSearchBarSmallDevice} />
          }

          {location.pathname === "/users/" &&
            <SearchBoxCompany focus={onFocusInSearchBarSmallDevice} blur={onFocusOutSearchBarSmallDevice} />
          }

          {!user &&
            <Hamburger className="h-10 w-10" onClick={onOpenMobileHeaderMenu} />
          }

        </div>
        <nav
          className={isMobileMenuOpen ? `w-screen h-screen absolute top-0 left-0 bottom-0 bg-mobile-menu-bg z-6 ` : "md:hidden"}
          onClick={onCloseMobileHeaderMenuFromBackground}
        >
          <HeaderMobile closeHeader={onCloseMobileHeaderMenu} menuOpen={isMobileMenuOpen} user={user} />
        </nav>
      </nav>

      {/* MOBILE HEADER IF HAVE USER */}
      {user &&
        <nav className="md:hidden fixed z-5 bottom-0 bg-dark-basic h-16 w-screen">
        <HeaderMediumToSmall 
          messageUnreadCount={messageUnreadCount} 
          totalUnreadNotification={totalUnreadNotification} 
          profilePicture={profilePicture} 
          loginUserType={loginUserType}
          onClickNotification={onClickMobileNotification}
          onClickProfile={onOpenMobileHeaderMenu}
        />
          
          <div
            id="notification-message-container" 
            className={`${isMobileNotificationContainerOpen ? "absolute bottom-16 w-screen h-[550px] transition-all duration-200 origin-bottom ease-in-out z-8" : "absolute bottom-16 w-screen h-0 z-8 transition-all duration-300 origin-top" } overflow-y-scroll bg-white rounded-t-2xl border-white shadow-box-shadow`}
          >
            <div className="sticky top-0 bg-dark-basic text-white flex justify-end items-center pr-2 font-bold h-10 border-b" onClick={onClickMobileNotification}>
              Close Notification
            </div>
            {isMobileNotificationContainerOpen &&
              <NotificationMessage onClickNotification={() => onLoadTotalUnreadNotification()} notificationType={loginUserType === "personal" ? "personal" : "company"} />
            }
          </div>          
        </nav>
      }


    </section>
  )
}

export default Headers