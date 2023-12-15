import React, { useContext, useEffect, useRef, useState } from 'react'
import EmailContext from '../../Context/EmailContext'
import MessageDetail from './MessageDetail'
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ReactComponent as Refresh } from "../../assets/images/Refresh.svg"
import AlertNotification from '../AlertNotification';
import Pagination from '../Pagination';

const Inbox = () => {

    const [hover, setHover] = useState()
    const [refreshIsClicked, setRefreshIsClicked] = useState(false)

    let isHoverDeleteIcon = useRef(true)
    let type = useRef("inbox")

    let {
        onLoadMessages,
        messages,
        isVisibile,
        messageData,
        isRead,
        setIsRead,
        onLoadBody,
        onMessageClicked,
        onMessageDetailCloseClicked,
        onDeleteMessage,
        alertDeleteResponse, 
        setAlertDeleteResponse,
        setAlertResponse,
        // getTotalInbox,
        totalInboxMessage,
        unreadMessageCount
        
    } = useContext(EmailContext)

    useEffect(() => {
        onLoadMessages()
        setIsRead([])
        setAlertDeleteResponse()
        unreadMessageCount()
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
        // getTotalInbox()
        unreadMessageCount()
    }

    const onInboxMessageClicked = (index) => {
        setAlertResponse(null)
        {!isHoverDeleteIcon.current && onMessageClicked({index, type: type.current})}
    }

    const onMouseHover = () => {
        isHoverDeleteIcon.current = true
    }

    const onMouseLeave = () => {
        isHoverDeleteIcon.current = false
    }

  return (
    <div className='inbox-container'>
    <div className='inbox-header'>
        <h3>Inbox</h3>
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
            <p>There is no new message yet.</p>
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
        {isVisibile && (<MessageDetail data={{data: messageData, type: "inbox"}} clickedClosed={onMessageDetailCloseClicked} />) }
        <AlertNotification alertData={alertDeleteResponse}/>
    </div>
  )
}

export default Inbox