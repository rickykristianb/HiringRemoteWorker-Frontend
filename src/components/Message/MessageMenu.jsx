import React, { useContext, useEffect, useState } from 'react'
import EmailContext from '../../Context/EmailContext'
import { useNavigate, useLocation } from 'react-router-dom'

const MessageMenu = (props) => {
    const {messageUnreadCount} = useContext(EmailContext)
    const navigate = useNavigate()
    const [isClicked, setIsClicked] = useState()
    const location = useLocation()
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedTab = params.get('tab');

        setIsClicked(selectedTab)
      }, [location.search]);

    const onMenuClicked = (item) => {
        setIsClicked(item)
        navigate(`/messages/?tab=${item}`)
    }

  return (
    <div className='menu-list'>
        <ul className='menu-ul'>
            <li onClick={() => onMenuClicked("send-message")} >
                <div className='send-message-menu'>
                    Send Message
                </div>
            </li>
            <li onClick={() => onMenuClicked("inbox")} >
                <div className={isClicked === "inbox" ? 'inbox-menu-clicked' :'inbox-menu'}>
                    <div className='inbox-menu-content'>
                        <p>Inbox</p>
                        <div className='unread-message'>
                            {messageUnreadCount}
                        </div>
                    </div>
                </div>
            </li>
            <li onClick={() => onMenuClicked("sent")} >
                <div className={isClicked === "sent" ? 'sent-menu-clicked' :'sent-menu'}>
                    Sent
                </div>
            </li>
            <li onClick={() => onMenuClicked("deleted")} >
                <div className={isClicked === "deleted" ? 'deleted-menu-clicked' : 'deleted-menu'}>
                    Deleted
                </div>
            </li>
        </ul>
    </div>
  )
}

export default MessageMenu