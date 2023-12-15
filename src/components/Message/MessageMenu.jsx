import React, { useContext, useState } from 'react'
import EmailContext from '../../Context/EmailContext'

const MessageMenu = (props) => {

    const [isClicked, setIsClicked] = useState("inbox")

    const {messageUnreadCount} = useContext(EmailContext)

    const onMenuClicked = (item) => {
        setIsClicked(item)
        return props.menuClicked(item)
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