import React, { useEffect, useRef, useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RateGenerator from './RateGenerator';
import Button from './Button';
import Pagination from './Pagination';
import Backdrop from './Backdrop';
import UserJobSkeleton from 'components/Skeleton/UserJobSkeleton';

const UsersList = (props) => {

  const [allUserData, setAllUserData] = useState([])
  const totalUser = useRef()
  const [isHover, setIsHover] = useState(false)
  const [noUserStatus, setNoUserStatus] = useState()
  const [resetPage, setResetPage] = useState(false)
  const [backdropActive, setBackdropActive] = useState(false)
  const [skeletonActive, setSkeletonActive] = useState(false)

  const onLoadAllUser = async(page) => {
    try{
      setBackdropActive(true)
      if (!page){
        page = 1
      }
      const response = await fetch(`/api/user/get_all_candidate_profile/?page=${page}`, {
        method: "GET",
        headers: {
          "content-type": "application/json"
        }
      })
      const data = await response.json()
      setAllUserData(data["data"])
      totalUser.current = data["total_user"]
      setBackdropActive(false)
    } catch (error){
      console.error("Encounter an error: ", error);
    } finally {
      setBackdropActive(false)
    }
    
  }

  useEffect(() => {
    const fetchData = async() => {
      setSkeletonActive(true)
      await onLoadAllUser()
      setSkeletonActive(false)
    }
    fetchData()
  }, [])

  const onMouseHover = (index) => {
    setIsHover(index)
  }

  const onMouseLeaveHover = () => {
    setIsHover(false)
  }

  const onSendMessageClicked = (data) => {
    window.open(`/messages/?email=${data}`)
  }

  const onProfileClicked = (data) => {
    window.open(`/profile/?id=${data}`)
  }

  const countExp = (exp_day) => {
    const year = exp_day / 365.25
    if (year < 1){
      return "Less than a year"
    } else if (year >= 1) {
      const testing = Math.ceil(year)
      return `Less than ${testing} year`
    }
  }

  useEffect(() => {
    if (props.searchData?.length === 0){
      console.log("MASK");
      setNoUserStatus(<p>No user at the moment.</p>)
    } else {
      setNoUserStatus()
    }
  }, [props.searchData])

  useEffect(() => {
    setResetPage(true)
    setTimeout(() => {
      setResetPage(false)
    }, 1)
  }, [props.paginationReset])

  return (
    <>
    { skeletonActive ?
      <UserJobSkeleton />
    :
      <div className={props.filterClicked ? "container-user-list-75vw" : 'container-user-list'} >
        <div className='user-list'>
          
          {props.searchData ? 
            props.searchData.length > 0  ? 
              props.searchData.map((item, index) => {
              return (
                <div className='user-card' key={index} >
                  <div className='user-image-name'>
                    <div className='user-image'>
                      <img className='user-image' src={item["profile_picture"]} alt="user" loading='lazy' />
                    </div>
                      <div className='user-name'>
                        <h3>{item.name}</h3>
                        <p>{item.short_intro && item.short_intro.length >= 40 ? `${item.short_intro.slice(0, 40)}...` : item.short_intro}</p>
                      </div>
                  </div>
                  <div className="user-info-skill-container" onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseLeaveHover()}>
                    <div className='user-info' >
                      {isHover === index &&
                      <div className='user-card-button'>
                        <Button clickedButton={() => onSendMessageClicked(item.email)} buttonType="button" label="Send Message"/>
                        <Button clickedButton={() => onProfileClicked(item.id)} buttonType="button" label="Profile"/>
                      </div> 
                      }
                      
                      <ul>
                        <li>
                            <LocationOnIcon className='icon-user-list'  /><span> {item.userlocation && item.userlocation.location.location}</span>
                        </li>
                        <li>
                            <AttachMoneyIcon />{item.expectedsalary && <span> {item.expectedsalary.nominal} / {item.expectedsalary.paid_period}</span>}
                        </li>
                        <li className='emp-type-user-list'>
                          <AccessTimeIcon />
                            {item.useremploymenttype.slice(0, 2).map((type, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <li>{type.employment_type.type}</li>
                                  {index < item.useremploymenttype.slice(0, 2).length - 1 && <span>/</span>}
                                </React.Fragment>
                              )
                            })}
                        </li>
                        <li><PsychologyIcon /><span> {countExp(item.experiences["total_exp"])}</span></li>
                      </ul>
                    </div>
                    <div className='user-skills' onMouseEnter={() => onMouseHover(index)}>
                      <li className='user-skills-list'>
                        <ul>
                          {item.skills.slice(0, 4).map((skill, index) => (
                            skill.skills.skill_name !== "Project Management" ? <li key={index}>{skill.skills.skill_name}</li> : null
                          ))}
                        </ul>
                      </li>
                    </div>                
                  </div>
                  
                  <div className='user-rate-status'>
                    <ul>
                        <div className='user-list-rating'>
                          <RateGenerator rating={Math.round(item.rate_ratio * 10)/10} />
                        </div>
                    </ul>
                  </div>
                </div>
                )}
                )
                :
                  <p>{noUserStatus}</p>
            :
            allUserData.length > 0 ?
              allUserData.map((item, index) => {
              return (
                <div className='user-card' key={index} >
                  <div className='user-image-name'>
                    <div className='user-image'>
                      <img className='user-image' src={item["profile_picture"]} alt="user" loading='lazy' />
                    </div>
                      <div className='user-name'>
                        <h3>{item.name}</h3>
                        <p>{item.short_intro && item.short_intro.length >= 40 ? `${item.short_intro.slice(0, 40)}...` : item.short_intro}</p>
                      </div>
                  </div>
                  <div className="user-info-skill-container" onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseLeaveHover()}>
                    <div className='user-info' >
                      {isHover === index &&
                      <div className='user-card-button'>
                        <Button clickedButton={() => onSendMessageClicked(item.email)} buttonType="button" label="Send Message"/>
                        <Button clickedButton={() => onProfileClicked(item.id)} buttonType="button" label="Profile"/>
                      </div> 
                      }
                      
                      <ul>
                        <li>
                            <LocationOnIcon className='icon-user-list'  /><span> {item.userlocation && item.userlocation.location.location}</span>
                        </li>
                        <li>
                            <AttachMoneyIcon />{item.expectedsalary && <span> {item.expectedsalary.nominal} / {item.expectedsalary.paid_period}</span>}
                        </li>
                        <li className='emp-type-user-list'>
                        <AccessTimeIcon /> 
                            {item.useremploymenttype.slice(0, 2).map((type, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <li>{type.employment_type.type}</li>
                                  {index < item.useremploymenttype.slice(0, 2).length - 1 && <span>/</span>}
                                </React.Fragment>
                              )
                            })}
                        </li>
                        <li><PsychologyIcon /><span> {countExp(item.experiences["total_exp"])}</span></li>
                      </ul>
                    </div>
                    <div className='user-skills' onMouseEnter={() => onMouseHover(index)}>
                      <li className='user-skills-list'>
                        <ul>
                          {item.skills.slice(0, 4).map((skill, index) => (
                            skill.skills.skill_name !== "Project Management" ? <li key={index}>{skill.skills.skill_name}</li> : null
                          ))}
                        </ul>
                      </li>
                    </div>                
                  </div>
                  
                  <div className='user-rate-status'>
                    <ul>
                        <div className='user-list-rating'>
                          <RateGenerator rating={Math.round(item.rate_ratio * 10)/10} />
                        </div>
                    </ul>
                  </div>
                </div>
                )
              })
              :
              <p>{noUserStatus}</p>
          }
        </div>

        <div className='container-pagination'>
            <Pagination 
              type={props.searchData ? "userSearchList" : "userList"} 
              totalData={props.searchData ? props.totalUser : totalUser.current} 
              loadUserList ={onLoadAllUser}
              loadUserSearchList={props.loadUserSearch}
              paginationReset={resetPage}
            />
        </div>
        {backdropActive && <Backdrop />}
      </div>
    }
    </>
   
  )
}

export default UsersList;