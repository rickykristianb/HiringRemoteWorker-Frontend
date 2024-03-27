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
import UserProfileSkeleton from 'components/Skeleton/UserProfileSkeleton';
import ProfileInfo from 'components/Profile/UserProfile/ProfileInfo';

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
  const [getProfileLoading, setGetProfileLoading] = useState(false)

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
    try {
      setGetProfileLoading(true);
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
      }catch (error) {
        console.error(error);
    } finally {
      setGetProfileLoading(false);
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
      setMenuClicked("skills")
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
    <>
      {getProfileLoading
         ?
        <div className='flex flex-col mx-20 max-sm:mx-2 gap-10 my-10'>
          <UserProfileSkeleton />
        </div>
      :
        <div className='flex flex-col mx-20 max-sm:mx-2 gap-10 my-10'>
          <div className='flex flex-wrap bg-soft-basic rounded-lg p-10 max-sm:p-5 shadow-box-shadow max-sm:mt-16'>
            <ProfileHeaders userData={headerUserData} clickedUserId={clickedUserId} />
          </div>
          <div className='flex flex-row gap-5 rounded-lg shadow-box-shadow p-10 max-sm:p-0 max-sm:py-10 max-sm:px-w'>
            <div className='flex justify-center w-[20%] h-full sticky top-10 max-sm:hidden' >
              <ProfileMenu menuClicked={onMenuClicked} userId={clickedUserId} />
            </div>
            <Divider />
            <div className='w-[80%] max-sm:w-full'>
              <ProfileInfo
                skillsUserData={skillsUserData}
                expectedRateUserData={expectedRateUserData}
                experienceUserData={experienceUserData}
                portfolioUserData={portfolioUserData}
                educationUserData={educationUserData}
                employmentTypeData={employmentTypeData}
                languageUserData={languageUserData}
                clickedUserId={clickedUserId}
              />
            </div>
          </div>
          <div className='rounded-lg shadow-box-shadow p-10 '>
              <UserRatings ratingData={ratingData} />
          </div>
        </div>
      }
    </>
    
  )
}

export default UserProfile