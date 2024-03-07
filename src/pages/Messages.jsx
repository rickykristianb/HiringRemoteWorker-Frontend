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
    <>
      <div className='grid grid-cols-4 mt-20 mx-20 md:mx-10 h-[900px] max-md:hidden'>
        <div className='col-start-1 col-end-1'>
            <MessageMenu menuClicked={onMenuClicked} />
        </div>
        <div className='col-start-2 col-end-5'>
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

      {/* MESSAGES FOR MOBILE LAYOUT */}
      <div className='max-md:block md:hidden'>
        <div>
            <MessageMenu menuClicked={onMenuClicked} />
        </div>
        <div>
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
    </>
  )
}

export default Messages