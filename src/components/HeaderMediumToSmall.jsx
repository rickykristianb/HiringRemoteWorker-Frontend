import { Badge } from '@mui/material'
import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import TuneIcon from '@mui/icons-material/Tune';
import AuthContext from 'Context/AuthContext';
import AdvanceFilterContext from 'Context/AdvanceFilterContext';

const HaveUserHeader = ({messageUnreadCount, totalUnreadNotification, profilePicture, loginUserType, onClickNotification, onClickProfile}) => {

    const location = useLocation()

    const {
        onAdvanceFilterUserClick,
        onAdvanceFilterJobClick,
    } = useContext(AdvanceFilterContext)

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

  return (
    <div className='w-full h-full flex justify-start items-center overflow-hidden'>
        <ul className='flex flex-row w-full h-full justify-evenly items-center z-10'>
            <li>
                <Link to="/messages/?tab=inbox">
                    <Badge badgeContent={messageUnreadCount ? messageUnreadCount : null} color="error" >
                        <MailIcon sx={{ width: 30, height: 30, color: "#ffff"}} />
                    </Badge>
                </Link>
            </li>
            <li onClick={user ? onClickNotification : () => navigate("/login/")}>
                <Badge badgeContent={totalUnreadNotification ? totalUnreadNotification : null} color="error" >
                    <NotificationsIcon sx={{ width: 30, height: 30, color: "#ffff"}} />
                </Badge>
            </li>
            {/* ADVANCE FILTER FOR PERSONAL */}
            {location.pathname === "/" &&
                <>
                    <li className='mx-4'>
                        {/* Empty */}
                    </li>
                    <li onClick={onAdvanceFilterJobClick}
                        className='absolute flex justify-center items-center border border-dark-basic rounded-full bg-dark-basic w-[70px] h-[70px] bottom-2'>
                        <div className='w-[60px] h-[60px] bg-white rounded-full flex justify-center items-center'>
                            <TuneIcon sx={{width: 40, height: 40, color: "#4e6e81"}} />
                        </div>
                    </li>
                </>
            }
            {/* ADVANCE FILTER FOR COMPANY */}
            {location.pathname === "/users/" &&
                <>
                    <li className='mx-4'>
                        {/* Empty */}
                    </li>
                    <li onClick={onAdvanceFilterUserClick}
                        className='absolute flex justify-center items-center border border-dark-basic rounded-full bg-dark-basic w-[70px] h-[70px] bottom-2'>
                        <div className='w-[60px] h-[60px] bg-white rounded-full flex justify-center items-center'>
                            <TuneIcon sx={{width: 40, height: 40, color: "#4e6e81"}} />
                        </div>
                    </li>
                </>
            }
            
            <li>
                <Link to={!loginUserType ? "/": loginUserType === "personal" ? "/" : "/users/"}>
                    <HomeRoundedIcon sx={{ width: 32, height: 32,  color: "#ffff" }} />
                </Link>
            </li>
            <li onClick={onClickProfile}>
                {profilePicture ?
                <div className='p-1 bg-white rounded-full'>
                    <Avatar alt="Remy Sharp" src={profilePicture} sx={{ width: 30, height: 30, color: "#4e6e81" }} /> 
                </div>
                    :
                <Link to={"/login/"} >
                    <AccountCircle sx={{ width: 30, height: 30, color: "#ffff" }} />    {/*If not login */}
                </Link>
                }
                                
            </li>
        </ul>
    </div>
  )
}

export default HaveUserHeader