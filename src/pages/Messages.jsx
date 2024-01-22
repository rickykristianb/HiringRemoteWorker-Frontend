import React, { useContext, useEffect, useState } from 'react'
import MessageMenu from '../components/Message/MessageMenu'
import SendMessage from '../components/Message/SendMessage'
import Inbox from 'components/Message/Inbox'
import SentMessages from '../components/Message/SentMessages'
import DeletedMessages from '../components/Message/DeletedMessages'
import { useLocation, useParams } from 'react-router-dom'

const Messages = () => {

  const [email, setEmail] = useState()
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedTab = params.get('tab');

    setMenuClicked(selectedTab);
  }, [location.search]);

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
              return <DeletedMessages />;
            default:
              return email ? <SendMessage recipient={email} /> :<Inbox />
          }
        })()}
        </div>
    </div>
  )
}

export default Messages