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
    <div className='menu-list'>
        <ul className='menu-ul'>
            <li>
                <div className='company-panel-title'>
                    Panel
                </div>
            </li>
            <li onClick={() => onMenuClicked("profile")}>
                <div className={isClicked === "profile" ? 'panel-profile-menu-clicked' :'panel-profile-menu'}>
                    Profile
                </div>
            </li>
            <li onClick={() => onMenuClicked("jobs")}>
                <div className={isClicked === "jobs" ? 'panel-jobs-menu-clicked' :'panel-jobs-menu'}>
                    Jobs
                </div>
            </li>
        </ul>
    </div>
    
  )
}

export default PanelMenu