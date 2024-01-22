import React, { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider';
import ProfileHeaders from '../components/Profile/UserProfile/ProfileHeaders';
import Education from '../components/Profile/UserProfile/Education';
import Language from '../components/Profile/UserProfile/Language';
import Experience from '../components/Profile/UserProfile/Experience';
import Skills from '../components/Profile/UserProfile/Skills';
import EmploymentType from '../components/Profile/UserProfile/EmploymentType';
import Portfolio from '../components/Profile/UserProfile/Portfolio';
import Rate from '../components/Profile/UserProfile/Rate';
import ProfileMenu from 'components/Profile/UserProfile/ProfileMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import UserRatings from 'components/UserRatings';

const UserProfile = (props) => {

  const navigate = useNavigate()
  const [languageUserData, setLanguageUserData] = useState([])
  const [experienceUserData, setExperienceUserData] = useState([])
  const [educationUserData, setEducationUserData] = useState([])
  const [headerUserData, setHeaderUserData] = useState([])
  const [employmentTypeData, setEmploymentTypeData] = useState([])
  const [portfolioUserData, setPortfolioUserData] = useState([])
  const [expectedRateUserData, setExpectedRateUserData] = useState([])
  const [skillsUserData, setSkillsUserData] = useState([])
  const [clickedUserId, setClickedUserId] = useState()
  const [ratingData, setRatingData] = useState([])
  const [menuClicked, setMenuClicked] = useState()

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedTab = params.get('tab');

    setMenuClicked(selectedTab);
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    setClickedUserId(id)
  }, [location.search])

  const onGetProfile = async () => {
    const id = clickedUserId
    console.log("ID");
    try {
      if (id !== null){
        const response = await fetch(`/api/user/profile/${id.toString()}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          }
        });
        try{
          const data = await response.json();
          if (response.ok) {

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
            } else if (response.status === 404){
              navigate("/user-not-found/")
            }
          } catch (error){
            navigate("/user-not-found/")
          }
        } 
        else {
          navigate("/user-not-found/")
        }
      }catch {
        
    }
};

    useEffect(() => {
      onGetProfile()
    }, [clickedUserId, menuClicked])

    const loadUserRatings = async() => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get('id');

      const response = await fetch(`/api/rating/get_user_rating/?id=${id}`, {
          method: "GET",
          headers: {
              "content-type": "application/json",
          }
      });
      const data = await response.json()
      if (response.ok){
          setRatingData(data)
      } else {
          setRatingData([])
      }
  }

  useEffect(() => {
      loadUserRatings()
  }, [])

  const onMenuClicked = (item) => {
    setMenuClicked(item)
  }

    const menuAppear = (selected) => {
      if (selected){
        const content = {
          "skills": <Skills userData={skillsUserData} clickedUserId={clickedUserId} />,
          "rate": <Rate userData={expectedRateUserData} clickedUserId={clickedUserId} />,
          "experience": <Experience userData={experienceUserData} clickedUserId={clickedUserId} />,
          "portfolio": <Portfolio userData={portfolioUserData} clickedUserId={clickedUserId} />,
          "education": <Education userData={educationUserData} clickedUserId={clickedUserId} />,
          "emp-type": <EmploymentType userData={employmentTypeData} clickedUserId={clickedUserId} />,
          "language": <Language userData={languageUserData} clickedUserId={clickedUserId} />
        }
        return content[selected];
      } else {
        return <Skills userData={skillsUserData} clickedUserId={clickedUserId} />;
      }
    }

  return (
    <div className='profile_container'>
      <div className='profile-header'>
        <ProfileHeaders userData={headerUserData} clickedUserId={clickedUserId} />
      </div>
      <br />
      <br />
      <br />
      <br />
      <div className='profile-menu-content-container'>
        <div id='profile-menu-wrapper'>
          <ProfileMenu menuClicked={onMenuClicked} userId={clickedUserId} />
        </div>
        <Divider />
        <div className='profile-menu-action'>
          {menuAppear(menuClicked)}
        </div>
      </div>

      <div id='user-profile-rating'>
          <UserRatings ratingData={ratingData} />
        </div>
    </div>
  )
}

export default UserProfile