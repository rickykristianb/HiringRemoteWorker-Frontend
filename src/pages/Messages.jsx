import React, { useContext, useEffect, useState } from 'react'
import MessageMenu from '../components/Message/MessageMenu'
import SendMessage from '../components/Message/SendMessage'
import Inbox from '../components/Message/Inbox'
import SentMessages from '../components/Message/SentMessages'
import DeletedMesages from '../components/Message/DeletedMesages'
import { useLocation, useParams } from 'react-router-dom'

const Messages = () => {

  const [email, setEmail] = useState()

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    setEmail(emailParam)
    console.log('Email from URL:', emailParam);

  }, [location.search])


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
              return email ? <SendMessage recipient={email} /> :<Inbox />
          }
        })()}
        </div>
    </div>
  )
}

export default Messages