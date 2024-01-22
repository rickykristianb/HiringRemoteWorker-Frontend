import EmailContext from 'Context/EmailContext'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ProfileMenu = (props) => {

    const navigate = useNavigate()
    const location = useLocation()
    const [isClicked, setIsClicked] = useState()

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedTab = params.get("tab")
        if (selectedTab){
            setIsClicked(selectedTab)
        } else {
            setIsClicked("skills")
        }
        
    }, [location.search])

    const {messageUnreadCount} = useContext(EmailContext)

    const onMenuClicked = (item) => {
        setIsClicked(item)
        // return props.menuClicked(item)
        navigate(`/profile/?id=${props.userId}&tab=${item}`)
    }

  return (
    <div className='profile-menu-list'>
        <ul className='profile-menu'>
            <li onClick={() => onMenuClicked("skills")} >
                <div className={isClicked === "skills" ? 'skills-menu-clicked' :'skills-menu'}>
                    Skills
                </div>
            </li>
            <li onClick={() => onMenuClicked("rate")} >
                <div className={isClicked === "rate" ? 'rate-menu-clicked' :'rate-menu'}>
                    Rate
                </div>
            </li>
            <li onClick={() => onMenuClicked("experience")} >
                <div className={isClicked === "experience" ? 'experience-menu-clicked' :'experience-menu'}>
                    Experience
                </div>
            </li>
            <li onClick={() => onMenuClicked("portfolio")} >
                <div className={isClicked === "portfolio" ? 'portfolio-menu-clicked' :'portfolio-menu'}>
                    Portfolio
                </div>
            </li>
            <li onClick={() => onMenuClicked("education")} >
                <div className={isClicked === "education" ? 'education-menu-clicked' :'education-menu'}>
                    Education
                </div>
            </li>
            <li onClick={() => onMenuClicked("emp-type")} >
                <div className={isClicked === "emp-type" ? 'emp-type-menu-clicked' :'emp-type-menu'}>
                    Employment Type
                </div>
            </li>
            <li onClick={() => onMenuClicked("language")} >
                <div className={isClicked === "language" ? 'language-menu-clicked' : 'language-menu'}>
                    Language
                </div>
            </li>
        </ul>
    </div>
  )
}

export default ProfileMenu