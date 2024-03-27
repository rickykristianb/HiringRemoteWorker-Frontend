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

    const onMenuClicked = (item, elementId) => {
        setIsClicked(item)
        // return props.menuClicked(item)
        // navigate(`/profile/?id=${props.userId}&tab=${item}`)
        const menuClicked = document.getElementById(elementId)
        menuClicked.scrollIntoView({behavior: "smooth"})
    }


    // MENU SELECTED WHILE SCROLLING
    const elementIds = ["skills-profile", "rate-profile", "experience-profile", "portfolio-profile", "education-profile", "employment-type-profile", "language-type"];

    const handleScroll = () => {
        let topElementId = null;
        let minTop = Number.POSITIVE_INFINITY;
    
        for (const id of elementIds) {
            const element = document.getElementById(id);
            if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                if (elementPosition >= 0 && elementPosition < minTop) {
                    minTop = elementPosition;
                    topElementId = id;
                }
            }
        }
    
        if (topElementId) {
            if (topElementId === "skills-profile"){
                setIsClicked("skills")
            } else if (topElementId === "rate-profile"){
                setIsClicked("rate")
            } else if (topElementId === "experience-profile"){
                setIsClicked("experience")
            } else if (topElementId === "portfolio-profile"){
                setIsClicked("portfolio")
            } else if (topElementId === "education-profile"){
                setIsClicked("education")
            } else if (topElementId === "employment-type-profile"){
                setIsClicked("emp-type")
            } else if (topElementId === "language-type"){
                setIsClicked("language")
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll);


  return (
    <div className=''>
        <ul className='flex flex-col gap-4'>
            <li onClick={() => onMenuClicked("skills", "skills-profile")} >
                <div className={isClicked === "skills" ? 'skills-menu-clicked flex justify-between items-center' :'skills-menu flex justify-between items-center'}>
                    {/* <GiSkills className='text-3xl' /> */}
                    <p>Skills</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("rate", "rate-profile")} >
                <div className={isClicked === "rate" ? 'rate-menu-clicked flex justify-between items-center' :'rate-menu flex justify-between items-center'}>
                    {/* <FaHandHoldingDollar className='text-3xl' /> */}
                    <p>Rate</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("experience", "experience-profile")} >
                <div className={isClicked === "experience" ? 'experience-menu-clicked flex justify-between items-center' :'experience-menu flex justify-between items-center'}>
                    {/* <MdWorkHistory className='text-3xl' /> */}
                    <p>Experience</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("portfolio", "portfolio-profile")} >
                <div className={isClicked === "portfolio" ? 'portfolio-menu-clicked flex justify-between items-center' :'portfolio-menu flex justify-between items-center'}>
                    {/* <IoGitNetwork className='text-3xl' /> */}
                    Portfolio
                </div>
            </li>
            <li onClick={() => onMenuClicked("education", "education-profile")} >
                <div className={isClicked === "education" ? 'education-menu-clicked flex justify-between items-center' :'education-menu flex justify-between items-center'}>
                    {/* <SiKnowledgebase className='text-3xl' /> */}
                    <p>Education</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("emp-type", "employment-type-profile")} >
                <div className={isClicked === "emp-type" ? 'emp-type-menu-clicked flex justify-between items-center' :'emp-type-menu flex justify-between items-center'}>
                    {/* <FaBusinessTime className='text-3xl' /> */}
                    <p>Employment Type</p>
                </div>
            </li>
            <li onClick={() => onMenuClicked("language", "language-type")} >
                <div className={isClicked === "language" ? 'language-menu-clicked flex justify-between items-center' : 'language-menu flex justify-between items-center'}>
                    {/* <FaLanguage className='text-3xl' /> */}
                    <p>Language</p>
                </div>
            </li>
        </ul>
    </div>
  )
}

export default ProfileMenu