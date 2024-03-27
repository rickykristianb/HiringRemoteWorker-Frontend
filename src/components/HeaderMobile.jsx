import CloseIcon from '@mui/icons-material/Close';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Avatar from '@mui/material/Avatar';
import { useContext, useEffect } from 'react';
import AuthContext from 'Context/AuthContext';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider } from '@mui/material';

const HeaderMobile = ({closeHeader, menuOpen}) => {

  let localLoginUserId = localStorage.getItem("userId")
  let loginUserType = localStorage.getItem("userType")
  let localLoginProfilePicture = localStorage.getItem("login_user_profile_picture")
  let localUserName = localStorage.getItem("username")
  let {user, logoutUser} = useContext(AuthContext)

  const mobileMenu = [
    {
      label: "Home",
      icon: <HomeIcon />,
      link: "/"
    },
    {
      label: "Login",
      icon: <LoginIcon />,
      link: "/login/",
    }, 
    {
      label: "Sign Up",
      icon: <AppRegistrationIcon />,
      link: "/register",
    },
    {
      label: "Profile",
      icon: <PersonIcon />,
      link: loginUserType === "personal" ? `/profile/?id=${localLoginUserId}` : `/profile/company/?id=${localLoginUserId}`,
    },
    {
      label: "Interested Job",
      icon: <WorkHistoryIcon />,
      link: "/interested-jobs/",
    },
    {
      label: "Saved Job",
      icon: <BookmarkAddedIcon />,
      link: "/saved-jobs/",
    },
    {
      label: "Manage",
      icon: <ManageHistoryIcon />,
      link: "/company-panel/?tabs=profile",
    },
    {
      label: "Post Job",
      icon: <PlaylistAddIcon />,
      link: "/add-job/",
    },
  ]


  return (
    <div className={`flex flex-col h-screen bg-white absolute z-7  ${menuOpen ? 'right-0' : '-right-[300px] top-0'} shadow-box-shadow w-[300px] transition-all duration-300 ease-in origin-right`}>     
      <CloseIcon className="self-end relative top-5 right-3" sx={{ fontSize: "30px" }} onClick={closeHeader} />
      <br /> 
      {user &&
        <>
        <div className=' flex flex-col gap-3 px-8 bg-white rounded-full'>
          <div className='w-[52.5px] h-[52.5px] rounded-full border-1.5'>
            <Avatar alt="Remy Sharp" src={localLoginProfilePicture} sx={{ width: 50, height: 50, color: "#4e6e81" }} /> 
          </div>
          <p>{localUserName}</p>
        </div>
        <div className='px-6 my-4'>
          <Divider className='px-8' />
        </div>
        </>
      }
      
      <div className='p-4 pt-0'>
      {
        mobileMenu.map((item) => {
        return (
          <Link key={item} to={item.link} >
            
                {
                  (item.label === "Login" || item.label === "Home" || item.label === "Sign Up") && !user 
                ?
                <>
                  <div className='flex justify-between p-4 font-montserrat text-xl' onClick={closeHeader}>
                    <p>{item.label}</p>
                    <p>{item.icon}</p>
                  </div>
                  {item.label === "Home" &&
                  <div className='my-4 px-2'>
                    <Divider />
                  </div>
                  }
                </>
                :
                (loginUserType === "personal" && (item.label === "Profile" || item.label === "Interested Job" || item.label === "Saved Job" ))
                ?
                  <div className='flex justify-between p-4 font-montserrat text-xl' onClick={closeHeader}>
                    <p>{item.label}</p>
                    <p>{item.icon}</p>
                  </div>
                :
                (loginUserType === "company" && (item.label === "Profile" || item.label === "Manage" || item.label === "Post Job"))
                &&
                  <div className='flex justify-between p-4 font-montserrat text-xl' onClick={closeHeader}>
                    <p>{item.label}</p>
                    <p>{item.icon}</p>
                  </div>
                }
            
          </Link>
        )})
      }
      
      </div>
      {user &&
        <div className='px-4'>
        <div className='my-4 px-2'>
          <Divider />
        </div>
        <div 
          className='w-full flex p-4 justify-between items-center text-xl 6 '
          onClick={logoutUser}
        >
          <p>Logout</p>
          <p><LogoutIcon /></p>
        </div>
        </div>
      }
    </div>
  )
}

export default HeaderMobile