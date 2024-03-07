import EmailContext from 'Context/EmailContext'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PanelMenu = (props) => {

    const navigate = useNavigate()
    const [isClicked, setIsClicked] = useState()

    useEffect(() => {
        setIsClicked(props.params ? props.params : "profile")
    }, [props.params])

    const {messageUnreadCount} = useContext(EmailContext)

    const onMenuClicked = (item) => {
        setIsClicked(item)
        navigate(`/company-panel/?tab=${item}`)
    }

  return (
    <div className='mr-5 px-14 pt-0'>
        <ul >
            <li>
                <div className='flex justify-center p-5 border-dark-basic mb-8 rounded-3xl transition-all duration-300 bg-dark-basic text-white'>
                    Panel
                </div>
            </li>
            <li onClick={() => onMenuClicked("profile")}>
                <div className={isClicked === "profile" ? 'p-[10px] border border-b-0 bg-soft-basic' :'p-[10px] border border-[rgb(211,211,211)] hover:cursor-pointer hover:bg-soft-basic transition duration-300'}>
                    Profile
                </div>
            </li>
            <li onClick={() => onMenuClicked("jobs")}>
                <div className={isClicked === "jobs" ? 'p-[10px] border border-b-0 bg-soft-basic' :'p-[10px] border border-[rgb(211,211,211)] hover:cursor-pointer hover:bg-soft-basic transition duration-300'}>
                    Jobs
                </div>
            </li>
        </ul>
    </div>
    
  )
}

export default PanelMenu