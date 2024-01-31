import EmailContext from 'Context/EmailContext'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GiSkills } from "react-icons/gi";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdWorkHistory } from "react-icons/md";
import { IoGitNetwork } from "react-icons/io5";
import { SiKnowledgebase } from "react-icons/si";
import { FaBusinessTime } from "react-icons/fa6";
import { FaLanguage } from "react-icons/fa6";

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
    <div className='overflow-x-auto w-full'>
        <ul className='flex justify-center items-center text-l h-16 gap-5 m-0 p-0 max-xl:justify-start max-xl:px-2'>
            <li onClick={() => onMenuClicked("skills")} >
                <div className={isClicked === "skills" ? 'skills-menu-clicked flex justify-between items-center' :'skills-menu flex justify-between items-center'}>
                    <GiSkills className='text-3xl' />
                    <p>Skills</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("rate")} >
                <div className={isClicked === "rate" ? 'rate-menu-clicked flex justify-between items-center' :'rate-menu flex justify-between items-center'}>
                    <FaHandHoldingDollar className='text-3xl' />
                    <p>Rate</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("experience")} >
                <div className={isClicked === "experience" ? 'experience-menu-clicked flex justify-between items-center' :'experience-menu flex justify-between items-center'}>
                    <MdWorkHistory className='text-3xl' />
                    <p>Experience</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("portfolio")} >
                <div className={isClicked === "portfolio" ? 'portfolio-menu-clicked flex justify-between items-center' :'portfolio-menu flex justify-between items-center'}>
                    <IoGitNetwork className='text-3xl' />
                    Portfolio
                </div>
            </li>
            <li onClick={() => onMenuClicked("education")} >
                <div className={isClicked === "education" ? 'education-menu-clicked flex justify-between items-center' :'education-menu flex justify-between items-center'}>
                    <SiKnowledgebase className='text-3xl' />
                    <p>Education</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("emp-type")} >
                <div className={isClicked === "emp-type" ? 'emp-type-menu-clicked flex justify-between items-center' :'emp-type-menu flex justify-between items-center'}>
                    <FaBusinessTime className='text-3xl' />
                    <p>Employment Type</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("language")} >
                <div className={isClicked === "language" ? 'language-menu-clicked flex justify-between items-center' : 'language-menu flex justify-between items-center'}>
                    <FaLanguage className='text-3xl' />
                    <p>Language</p>
                </div>
            </li>
        </ul>
    </div>
  )
}

export default ProfileMenu