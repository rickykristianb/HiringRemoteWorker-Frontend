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
  const [paginationLoadSkeletonActive, setPaginationLoadSkeletonActive] = useState(false)

  const onLoadAllUser = async(page = 1) => {
    try{
      setBackdropActive(true)
      const response = await fetch(`/api/user/get_all_candidate_profile/?page=${page}`, {
        method: "GET",
        headers: {
          "content-type": "application/json"
        }
      })
      const data = await response.json()
      setAllUserData(data["data"])
      totalUser.current = data["total_user"]
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
      <UserJobSkeleton filterClicked={props.filterClicked} />
    :
    <div>
      <div className={props.filterClicked ? "flex justify-center items-center flex-wrap gap-10 mt-10 md:mt-10 max-lg:mt-0 max-sm:mt-10" : 'flex justify-center flex-wrap gap-10 mt-10 md:mt-10 max-lg:mt-0 max-sm:mt-10'} >
         {/* FOR SEARCHING USER */}
          {
            props.searchData ? 
            props.searchData.length > 0  ? 
              props.searchData?.map((item, index) => {
              return (
                <div className='card-container' key={index} >
                  <div className='grid grid-cols-3 gap-4 m-5 h-[110] '>
                    <div className='bg-white col-start-1 rounded-full w-[100px] h-[100px] flex justify-center'>
                      <img className='bg-white rounded-full w-full h-full flex justify-center' src={item["profile_picture"]} alt="user" loading='lazy' />
                    </div>
                    <div className='flex col-span-2 flex-col gap-4 justify-center'>
                      <h3 className='text-lg font-bold bg-dar'>{item.name}</h3>
                      <p>{item.short_intro && item.short_intro.length >= 40 ? `${item.short_intro.slice(0, 40)}...` : item.short_intro}</p>
                    </div>
                  </div>
                  <div onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseLeaveHover()}>
                    <div className='bg-white flex' >
                      {isHover === index &&
                      <div className='flex justify-center items-center gap-10 z-1 w-[350px] h-[204px] absolute'
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
                        }}
                      >
                        <Button clickedButton={() => onSendMessageClicked(item.email)} buttonType="button" label="Send Message"/>
                        <Button clickedButton={() => onProfileClicked(item.id)} buttonType="button" label="Profile"/>
                      </div> 
                      }
                      
                      <ul className='flex flex-col gap-2 pl-5 mt-5'>
                        <li className='flex gap-3'>
                            <LocationOnIcon className='content-end'  /><span> {item.userlocation && item.userlocation.location.location}</span>
                        </li>
                        <li className='flex gap-3'>
                            <AttachMoneyIcon />{item.expectedsalary && <span> {item.expectedsalary.nominal} / {item.expectedsalary.paid_period}</span>}
                        </li>
                        <li className='flex gap-3'>
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
                        <li className='flex gap-3'><PsychologyIcon /><span> {countExp(item.experiences["total_exp"])}</span></li>
                      </ul>
                    </div>
                    <div className='bg-white' onMouseEnter={() => onMouseHover(index)}>
                      <li>
                        <ul className='flex justify-center flex-wrap pt-2 mt-0 gap-3 mb-0'>
                          {item.skills.slice(0, 4).map((skill, index) => (
                            skill.skills.skill_name !== "Project Management" ? <li className='p-[10px] bg-soft-basic rounded-lg mb-3' key={index}>{skill.skills.skill_name}</li> : null
                          ))}
                        </ul>
                      </li>
                    </div>                
                  </div>
                  
                  <div className='pl-24 py-1'>
                    <RateGenerator rating={Math.round(item.rate_ratio * 10)/10} />
                  </div>
                </div>
                )}
                )
                :
                  <p>{noUserStatus}</p>
            :
            // HOMEPAGE SHOWING ALL USER
            allUserData.length > 0 ?
              allUserData.map((item, index) => {
              return (
                <div className='card-container' key={index} >
                  <div className='grid grid-cols-3 gap-4 m-5 h-[110]'>
                    <div className='bg-white col-start-1 rounded-full w-[100px] h-[100px] flex justify-center'>
                      <img className='bg-white rounded-full w-full h-full flex justify-center' src={item["profile_picture"]} alt="user" loading='lazy' />
                    </div>
                      <div className='flex col-span-2 flex-col gap-4 justify-center'>
                        <h3 className='text-xl font-bold break-words'>{item.name}</h3>
                        <p>{item.short_intro && item.short_intro.length >= 40 ? `${item.short_intro.slice(0, 40)}...` : item.short_intro}</p>
                      </div>
                  </div>
                  <div onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseLeaveHover()}>
                    <div className='bg-white flex' >
                      {isHover === index &&
                      <div className='flex justify-center items-center gap-10 z-1 w-[350px] h-[204px] absolute'
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
                        }}
                      >
                        <Button clickedButton={() => onSendMessageClicked(item.email)} buttonType="button" label="Send Message"/>
                        <Button clickedButton={() => onProfileClicked(item.id)} buttonType="button" label="Profile"/>
                      </div> 
                      }
                      
                      <ul className='flex flex-col gap-2 pl-5 mt-5'>
                        <li className='flex gap-3'>
                            <LocationOnIcon className='content-end'  /><span> {item.userlocation && item.userlocation.location.location}</span>
                        </li>
                        <li className='flex gap-3'>
                            <AttachMoneyIcon />{item.expectedsalary && <span> {item.expectedsalary.nominal} / {item.expectedsalary.paid_period}</span>}
                        </li>
                        <li className='flex gap-3'>
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
                        <li className='flex gap-3'><PsychologyIcon /><span> {countExp(item.experiences["total_exp"])}</span></li>
                      </ul>
                    </div>
                    <div className='bg-white' onMouseEnter={() => onMouseHover(index)}>
                      <li>
                        <ul className='flex justify-center flex-wrap pt-2 mt-0 gap-3 mb-0'>
                          {item.skills.slice(0, 4).map((skill, index) => (
                            skill.skills.skill_name !== "Project Management" ? <li className='p-[10px] bg-soft-basic rounded-lg mb-3' key={index}>{skill.skills.skill_name}</li> : null
                          ))}
                        </ul>
                      </li>
                    </div>                
                  </div>
                  
                  <div className='pl-24 py-1'>
                      <RateGenerator rating={Math.round(item.rate_ratio * 10)/10} />
                  </div>
                </div>
                )
              })
              :
              <p>{noUserStatus}</p>
          }
        </div>
        <div className='my-12 flex justify-center'>
            <Pagination 
              type={props.searchData ? "userSearchList" : "userList"} 
              totalData={props.searchData ? props.totalUser : totalUser.current} 
              loadUserList={onLoadAllUser}
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