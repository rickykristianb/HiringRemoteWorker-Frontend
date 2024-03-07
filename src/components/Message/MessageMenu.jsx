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
    <>
        {/* MESSAGES MENU FOR LARGE DEVICE */}
        <div className='mr-5 px-14 pt-0 max-md:hidden '>
            <ul>
                <li onClick={() => onMenuClicked("send-message")} >
                    <div className='flex justify-center p-5 border border-dark-basic mb-8 rounded-2xl bg-dark-basic text-white cursor-pointer hover:bg-white hover:text-dark-basic transition-all duration-300'>
                        Send Message
                    </div>
                </li>
                <li onClick={() => onMenuClicked("inbox")} >
                    <div className={isClicked === "inbox" ? 'p-[10px] border border-b-0 bg-soft-basic' :'p-[10px] border border-b-0 border-[rgb(211,211,211)] hover:cursor-pointer hover:bg-soft-basic transition duration-300'}>
                        <div className='flex justify-between w-full h-[24px] '>
                            <p>Inbox</p>
                            <div className='self-center py-1 px-3 bg-dark-basic text-white rounded-md'>
                                {messageUnreadCount}
                            </div>
                        </div>
                    </div>
                </li>
                <li onClick={() => onMenuClicked("sent")} >
                    <div className={isClicked === "sent" ? 'p-[10px] border border-b-0 bg-soft-basic' :'p-[10px] border border-b-0 border-[rgb(211,211,211)] hover:cursor-pointer hover:bg-soft-basic transition duration-300'}>
                        Sent
                    </div>
                </li>
                <li onClick={() => onMenuClicked("deleted")} >
                    <div className={isClicked === "deleted" ? 'p-[10px] border bg-soft-basic border-b-0' : 'p-[10px] border border-[rgb(211,211,211)] hover:cursor-pointer hover:bg-soft-basic transition duration-300'}>
                        Deleted
                    </div>
                </li>
            </ul>
        </div>

        {/* MESSAGES MENU FOR MOBILE LAYOUT */}
        <div className='max-md:block md:hidden mt-20 fixed'>
            <ul className='flex justify-evenly w-screen '>
                <li onClick={() => onMenuClicked("send-message")} >
                    <div className='flex justify-center p-3 border-b border-dark-basic  bg-dark-basic text-white rounded-bl-2xl'>
                        Compose
                    </div>
                </li>
                <li onClick={() => onMenuClicked("inbox")} >
                    <div className={isClicked === "inbox" ? 'flex justify-center w-[100px] p-3 border-b border-soft-basic bg-soft-basic' :'flex justify-center w-[100px] p-3 border-b border-soft-basic bg-white'}>
                        <div className='flex justify-between w-full h-[24px]'>
                            <p>Inbox</p>
                            <div className='self-center py-1 px-2 bg-dark-basic text-white rounded-md'>
                                {messageUnreadCount}
                            </div>
                        </div>
                    </div>
                </li>
                <li onClick={() => onMenuClicked("sent")} >
                    <div className={isClicked === "sent" ? 'flex justify-center w-[100px] p-3 border-b border-soft-basic bg-soft-basic' :'flex justify-center w-[100px] p-3 border-b border-soft-basic bg-white'}>
                        Sent
                    </div>
                </li>
                <li onClick={() => onMenuClicked("deleted")} >
                    <div className={isClicked === "deleted" ? 'flex justify-center w-[100px] p-3 border-b border-soft-basic bg-soft-basic rounded-br-2xl' : 'flex justify-center w-[100px] p-3 border-b border-soft-basic bg-white rounded-br-2xl'}>
                        Deleted
                    </div>
                </li>
            </ul>
        </div>
    </>
  )
}

export default MessageMenu