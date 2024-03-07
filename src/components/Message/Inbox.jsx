import React, { useContext, useEffect, useRef, useState } from 'react'
import EmailContext from '../../Context/EmailContext'
import MessageDetail from './MessageDetail'
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ReactComponent as Refresh } from "../../assets/images/Refresh.svg"
import AlertNotification from '../AlertNotification';
import Pagination from '../Pagination';
import NotificationContext from 'Context/NotificationContext';

const Inbox = () => {

    const [hover, setHover] = useState()
    const [refreshIsClicked, setRefreshIsClicked] = useState(false)

    let isHoverDeleteIcon = useRef(true)
    let type = useRef("inbox")

    let {
        onLoadMessages,
        messages,
        isVisible,
        messageData,
        isRead,
        setIsRead,
        onLoadBody,
        onLoadSubjectForMobile,
        onMessageClicked,
        onMessageDetailCloseClicked,
        onDeleteMessage,
        alertDeleteResponse, 
        setAlertDeleteResponse,
        setAlertResponse,
        totalInboxMessage,
        unreadMessageCount
        
    } = useContext(EmailContext)

    const {
        onLoadTotalUnreadNotification
    } = useContext(NotificationContext)

    useEffect(() => {
        onLoadMessages()
        setIsRead([])
        setAlertDeleteResponse()
        unreadMessageCount()
        onLoadTotalUnreadNotification()
    }, [])

    const onHoverMouse = (index) => {
        isHoverDeleteIcon.current = false
        setHover(index)
    }

    const onLeaveMouse = () => {
        setHover(null)
    }

    const onRefreshIconClicked = async() => {
        setRefreshIsClicked(!refreshIsClicked)
        await onLoadMessages()
        setRefreshIsClicked(false)
        setIsRead([])
        unreadMessageCount()
    }

    const onInboxMessageClicked = (index) => {
        setAlertResponse(null)
        {!isHoverDeleteIcon.current && onMessageClicked({index, type: type.current})}
    }

    const onInboxMessageClickedMobile = (index) => {
        setAlertResponse(null)
        onMessageClicked({index, type: type.current})
    }

    const onMouseHover = () => {
        isHoverDeleteIcon.current = true
    }

    const onMouseLeave = () => {
        isHoverDeleteIcon.current = false
    }

  return (
    <>
        {/* INBOX FOR LARGE DEVICE */}
        <div className='max-md:hidden'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <h3 className='font-bold text-xl leading-10'>Inbox</h3>
                {messages.length !== 0 && 
                    <div>
                        {!refreshIsClicked ?
                            <Tooltip title="Refresh" placement='top' arrow>
                                <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
                            </Tooltip>
                        :
                            <Refresh style={{backgroundColor: "white"}} />
                        }
                    </div>
                }
            </div>
            {messages.length !== 0 ? 
            messages.map((item, index) => (
                <div key={index} className={(item.is_read === true || isRead.includes(index)) ? "inbox-read" :'inbox'} 
                    onClick={isHoverDeleteIcon.current ? null : () => onInboxMessageClicked(index)} 
                    onMouseEnter={() => onHoverMouse(index)}
                    onMouseLeave={() => onLeaveMouse()} >
                    
                    <div className='sender-name-container'>
                        <p><b>{item.sender.name}</b></p>
                    </div>
                    <div>
                        <p><b>{item.subject}</b></p>
                        <p>{onLoadBody(item.body)}</p>
                    </div>
                    {hover === index ?
                        <div className='inbox-delete-button' >
                            <Tooltip title="Delete" arrow onMouseEnter={() => onMouseHover()} onMouseLeave={() => onMouseLeave()} >
                                <DeleteIcon onClick={() => onDeleteMessage(index)} sx={{fontSize: "40px", cursor: "pointer"}} />
                            </Tooltip>
                        </div>
                    :
                    <div className='date-container'>
                        <p>{item.created.date}</p>
                    </div>
                    }
                </div>
            ))
            :
            <div>
                <p className='leading-10'>There is no new message yet.</p>
                <br />
                {!refreshIsClicked ?
                    <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
                :
                    <Refresh style={{backgroundColor: "white"}} />
                }
            </div>
            }
            <br />
            <Pagination type="inbox" totalData={totalInboxMessage} />
            {isVisible && (<MessageDetail data={{data: messageData, type: "inbox"}} clickedClosed={onMessageDetailCloseClicked} />) }
            <AlertNotification alertData={alertDeleteResponse}/>
        </div>
        
        {/* INBOX FOR MOBILE LAYOUT */}
        <div className='md:hidden max-md:block'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <h3 className='font-bold text-xl leading-10 max-md:pl-4 max-md:mt-[150px]'>Inbox</h3>
                {messages.length !== 0 && 
                    <div className='max-md:mt-[150px] max-md:pr-6'>
                        {!refreshIsClicked ?
                            <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
                        :
                            <Refresh style={{backgroundColor: "white"}} />
                        }
                    </div>
                }
            </div>

            <div className='h-[800px] max-md:px-4'>
                {messages.length !== 0 ? 
                messages.map((item, index) => (
                    <div key={index} className={(item.is_read === true || isRead.includes(index)) ? "bg-read-messages border border-border-messages h-[160px] p-2" :'bg-soft-basic border border-border-messages h-[160px] p-2'} 
                        onClick={() => onInboxMessageClickedMobile(index)} 
                    >
                        
                        <div className='sender-name-container'>
                            <p><b>{item.sender.name}</b></p>
                        </div>
                        <div className='h-[100px]'>
                            <p className='leading-10'><b>{onLoadSubjectForMobile(item.subject)}</b></p>
                            <p>{onLoadBody(item.body)}</p>
                        </div>
                        {hover === index ?
                            <div className='inbox-delete-button' >
                                <Tooltip title="Delete" arrow onMouseEnter={() => onMouseHover()} onMouseLeave={() => onMouseLeave()} >
                                    <DeleteIcon onClick={() => onDeleteMessage(index)} sx={{fontSize: "40px", cursor: "pointer"}} />
                                </Tooltip>
                            </div>
                        :
                        <div className='flex justify-end mr-2 items-center'>
                            <p>{item.created.date}</p>
                        </div>
                        }
                    </div>
                ))
                :
                <div>
                    <p className='leading-10'>There is no new message yet.</p>
                    <br />
                    {!refreshIsClicked ?
                        <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
                    :
                        <Refresh style={{backgroundColor: "white"}} />
                    }
                </div>
                }
            </div>

            <br />
            <div className='max-md:px-4'>
                <Pagination type="inbox" totalData={totalInboxMessage} />
            </div>
            
            {isVisible && (<MessageDetail data={{data: messageData, type: "inbox"}} clickedClosed={onMessageDetailCloseClicked} />) }
            <AlertNotification alertData={alertDeleteResponse}/>
        </div>
        <br />
    </>
    
  )
}

export default Inbox