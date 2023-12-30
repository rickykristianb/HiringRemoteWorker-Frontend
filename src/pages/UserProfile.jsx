import React, { useContext, useCallback, useEffect, useState } from 'react'
import Button from '../components/Button'
import Divider from '@mui/material/Divider';
import ProfileHeaders from '../components/Profile/UserProfile/ProfileHeaders';
import Education from '../components/Profile/UserProfile/Education';
import Language from '../components/Profile/UserProfile/Language';
import ProfileIntroduction from '../components/Profile/UserProfile/ProfileIntroduction';
import Experience from '../components/Profile/UserProfile/Experience';
import Skills from '../components/Profile/UserProfile/Skills';
import AuthContext from '../Context/AuthContext';
import EmploymentType from '../components/Profile/UserProfile/EmploymentType';
import Portfolio from '../components/Profile/UserProfile/Portfolio';
import Rate from '../components/Profile/UserProfile/Rate';
import WorkingHistory from '../components/Profile/UserProfile/WorkingHistory';
import EmailContext from '../Context/EmailContext';
import { useLocation } from 'react-router-dom';

const UserProfile = (props) => {

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
  const [skillsUserData, setSkillsUserData] = useState([])
  const [clickedUserId, setClickedUserId] = useState()

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    setClickedUserId(id)
  }, [location.search])

  const onGetProfile = async () => {
    const id = clickedUserId
    try {
        const response = await fetch(`/api/user/profile/${id.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
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

            setHeaderUserData({
              userRate: data.rate_ratio,
              name: data.name,
              shortIntro: data.short_intro,
              bio: data.bio,
              username: data.username,
              email: data.email,
              phoneNumber: data.phone_number,
              profilePicture: data.profile_picture,  // Use the correct method name
              location: data.userlocation ? data.userlocation["location"]["location"] : null
            });
            setLanguageUserData("profile_picture", data.profile_picture);
            setEmploymentTypeData(data.useremploymenttype)
            setPortfolioUserData(data.portfolios)
            setSkillsUserData(data.skills)
            setLanguageUserData(data.languages);
            setExperienceUserData([{
              "experience": data.experiences.data,
              "total_exp": data.experiences.total_exp
            }]);
            setEducationUserData(data.educations);
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
  }, [clickedUserId])

  return (
    <div className='profile_container'>
      <div className='profile-header'>
        <ProfileHeaders userData={headerUserData} clickedUserId={clickedUserId} />
      </div>
      <div className='profile-and-job-section'>
        <div className='profile-section'>
          <Skills userData={skillsUserData} clickedUserId={clickedUserId} />
          <Portfolio userData={portfolioUserData} clickedUserId={clickedUserId} />
          <Experience userData={experienceUserData} clickedUserId={clickedUserId} />
          <EmploymentType userData={employmentTypeData} clickedUserId={clickedUserId} />
          <Education userData={educationUserData} clickedUserId={clickedUserId} />
          <Language userData={languageUserData} clickedUserId={clickedUserId} />
        </div>
        <hr class="divider" />
        <div className='job-section'>
          <Rate userData={expectedRateUserData} clickedUserId={clickedUserId} />
          <WorkingHistory clickedUserId={clickedUserId} />
        </div>
      </div>
    </div>
  )
}

export default UserProfile