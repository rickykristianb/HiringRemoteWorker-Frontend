import React, { useContext, useCallback, useEffect, useState } from 'react'
import Button from '../components/Button'
import Divider from '@mui/material/Divider';
import ProfileHeaders from '../components/ProfileHeaders';
import Education from '../components/Education';
import Language from '../components/Language';
import ProfileIntroduction from '../components/ProfileIntroduction';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import AuthContext from '../Context/AuthContext';
import EmploymentType from '../components/EmploymentType';
import Portfolio from '../components/Portfolio';
import Rate from '../components/Rate';
import WorkingHistory from '../components/WorkingHistory';
import EmailContext from '../Context/EmailContext';

const UserProfile = (props) => {

  const {authToken} = useContext(AuthContext)
  const userToken = authToken.access

  const {onLoadMessages} = useContext(EmailContext)

  const [loading, setLoading] = useState(true)
  const [profileUserData, setProfileUserData] = useState([])
  const [languageUserData, setLanguageUserData] = useState([])
  const [experienceUserData, setExperienceUserData] = useState([])
  const [educationUserData, setEducationUserData] = useState([])
  const [headerUserData, setHeaderUserData] = useState([])
  const [employmentTypeData, setEmploymentTypeData] = useState([])
  const [portfolioUserData, setPortfolioUserData] = useState([])
  const [expectedRateUserData, setExpectedRateUserData] = useState([])

  useEffect(() => {
    onLoadMessages()
  },[])

  const onGetProfile = async () => {
    try {
        const response = await fetch("/api/user/profile/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("INI DATA",data);
            setProfileUserData({
                name: data.name,
                shortIntro: data.short_intro,
                bio: data.bio,
                username: data.username,
                email: data.email,
                phoneNumber: data.phone_number
            });
            localStorage.setItem("profile", JSON.stringify({
              name: data.name,
              shortIntro: data.short_intro,
              bio: data.bio,
              username: data.username,
              email: data.email,
              phoneNumber: data.phone_number
          }))

            setHeaderUserData({
              userRate: data.rate_ratio,
              name: data.name,
              shortIntro: data.short_intro,
              bio: data.bio,
              username: data.username,
              email: data.email,
              phoneNumber: data.phone_number,
              profilePicture: data.profile_picture  // Use the correct method name
            });
            setLanguageUserData("profile_picture", data.profile_picture);
            setEmploymentTypeData(data.useremploymenttype)
            setPortfolioUserData(data.portfolios)
            localStorage.setItem("userRate", JSON.stringify({userRate: data.rate_ratio}))
            setLanguageUserData(data.languages);
            localStorage.setItem("language", JSON.stringify(data.languages))
            setExperienceUserData(data.experiences);
            localStorage.setItem("experience", JSON.stringify(data.experiences))
            setEducationUserData(data.educations);
            localStorage.setItem("education", JSON.stringify(data.educations))
            setExpectedRateUserData(data.expectedsalary)
            setLoading(false);
        } else {
            console.error('Failed to fetch profile:', response.status);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};

  useEffect(() => {
    onGetProfile()
  }, [userToken.access])

  return (
    <div className='profile_container'>
      <div className='profile-header'>
        <ProfileHeaders userData={headerUserData} />
      </div>
      <div className='profile-and-job-section'>
        <div className='profile-section'>
          <Skills />
          <Portfolio userData={portfolioUserData} />
          <Experience userData={experienceUserData} />
          <EmploymentType userData={employmentTypeData}/>
          <Education userData={educationUserData} />
          <Language userData={languageUserData} />
        </div>
        <hr class="divider" />
        <div className='job-section'>
          <Rate userData={expectedRateUserData} />
          <WorkingHistory />
        </div>
      </div>
    </div>
  )
}

export default UserProfile