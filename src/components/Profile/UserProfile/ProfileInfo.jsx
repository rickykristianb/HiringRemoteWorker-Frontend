import React from 'react'
import Skills from './Skills'
import Rate from './Rate'
import Experience from './Experience'
import Portfolio from './Portfolio'
import Education from './Education'
import EmploymentType from './EmploymentType'
import Language from './Language'
import { Divider } from '@mui/material'

const ProfileInfo = (props) => {
  return (
    <div className='flex flex-col gap-10 max-sm:w-[90%]'>
        <div id="skills-profile">
            <Skills userData={props.skillsUserData} clickedUserId={props.clickedUserId} />
        </div>
        <div id="skills-profile">
            <Skills userData={props.skillsUserData} clickedUserId={props.clickedUserId} />
        </div>
        <Divider />
        <div id="rate-profile">
            <Rate userData={props.expectedRateUserData} clickedUserId={props.clickedUserId} />
        </div>
        <Divider />
        <div id="experience-profile">
            <Experience userData={props.experienceUserData} clickedUserId={props.clickedUserId} />
        </div>
        <Divider />
        <div id="portfolio-profile">
            <Portfolio userData={props.portfolioUserData} clickedUserId={props.clickedUserId} />
        </div>
        <Divider />
        <div id="education-profile">
            <Education userData={props.educationUserData} clickedUserId={props.clickedUserId} />
        </div>
        <Divider />
        <div id="employment-type-profile">
            <EmploymentType userData={props.employmentTypeData} clickedUserId={props.clickedUserId} />
        </div>
        <Divider />
        <div id="language-type">
            <Language userData={props.languageUserData} clickedUserId={props.clickedUserId} />
        </div>
    </div>
  )
}

export default ProfileInfo