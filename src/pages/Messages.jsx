import React, { useContext, useState } from 'react'
import MessageMenu from '../components/MessageMenu'
import SendMessage from '../components/SendMessage'
import Inbox from '../components/Inbox'
import SentMessages from '../components/SentMessages'
import DeletedMesages from '../components/DeletedMesages'


const Messages = () => {

  const [menuClicked, setMenuClicked] = useState()

  const onMenuClicked = (item) => {
    setMenuClicked(item)
  }

  return (
    <div className='messages-container'>
        <div className='message-menu'>
            <MessageMenu menuClicked={onMenuClicked} />
        </div>
        <div className='message-action'>
        {(() => {
          switch(menuClicked){
            case "send-message":
              return <SendMessage />;
            case "inbox":
              return <Inbox />;
            case "sent":
              return <SentMessages />;
            case "deleted":
              return <DeletedMesages />;
            default:
              return <Inbox />;
          }
        })()}
        </div>
    </div>
  )
}

export default Messages