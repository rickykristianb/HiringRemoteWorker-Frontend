import CloseIcon from '@mui/icons-material/Close';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { useContext } from 'react';
import AuthContext from 'Context/AuthContext';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import LogoutIcon from '@mui/icons-material/Logout';

const HeaderMobile = ({closeHeader, menuOpen}) => {

  let localLoginUserId = localStorage.getItem("userId")
  let loginUserType = localStorage.getItem("userType")

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
    <div className={`flex flex-col h-screen bg-white absolute z-7  ${menuOpen ? 'right-0' : '-right-[200px] top-0'} shadow-box-shadow w-[200px] transition-all duration-300 ease-in origin-right`}>
      <CloseIcon className="self-end relative top-5 right-3" sx={{ fontSize: "30px" }} onClick={closeHeader} />
      <br /> 
      <div >
      {
        mobileMenu.map((item) => {
        return (
          <Link key={item} to={item.link} >
            
                {
                  (item.label === "Login" || item.label === "Home" || item.label === "Sign Up") && !user 
                ?
                  <div className='flex justify-between p-4 font-montserrat text-xl' onClick={closeHeader}>
                    <p>{item.label}</p>
                    <p>{item.icon}</p>
                  </div>
                :
                (loginUserType === "personal" && (item.label === "Profile" || item.label === "Interested Job"))
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
      {user &&
        <div 
          className='w-full flex p-4 justify-between items-center text-xl 6 '
          onClick={logoutUser}
        >
          <p>Logout</p>
          <p><LogoutIcon /></p>
        </div>
      }
      </div>
    </div>
  )
}

export default HeaderMobile