import React, { useContext, useEffect, useRef, useState } from 'react'
import EmailContext from '../../Context/EmailContext';
import MessageDetail from './MessageDetail'
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import AlertNotification from '../AlertNotification';
import { ReactComponent as Refresh } from "../../assets/images/Refresh.svg"
import InboxPagination from '../Pagination';

const DeletedMesages = () => {

  const [hover, setHover] = useState()
    const [refreshIsClicked, setRefreshIsClicked] = useState(false)

    const type = useRef("deleted")
    let isHoverDeleteForeverIcon = useRef(false)

    const {
        onLoadMessages,
        messages,
        totalDeletedMessage,
        deletedMessages,
        isVisibile,
        messageData,
        isRead,
        isReadDeletedMessage,
        onLoadBody,
        onMessageClicked,
        onMessageDetailCloseClicked,
        onDeleteMessage,
        onDeleteMessageForever,
        deleteInProgress,
        onCheckSentMessages,
        onCheckDeletedMessages,
        alertDeleteForeverResponse,
        setAlertDeleteForeverResponse

    } = useContext(EmailContext)

    useEffect(() => {
      onCheckDeletedMessages()
      setAlertDeleteForeverResponse()
    }, [])

    const onHoverMouse = (index) => {
        setHover(index)
    }

    const onLeaveMouse = () => {
        setHover(null)
    }

    const onRefreshIconClicked = async() => {
        setRefreshIsClicked(!refreshIsClicked)
        await onCheckDeletedMessages()
        setRefreshIsClicked(false)
    }

    const onMessageDeletedClicked = (index) => {
        {!isHoverDeleteForeverIcon.current && onMessageClicked({index, type: type.current})}
    }

    const onMouseHover = () => {
        isHoverDeleteForeverIcon.current = true
    }

    const onMouseLeave = () => {
        isHoverDeleteForeverIcon.current = false
    }

  return (
    <div className='inbox-container'>
    <div className='inbox-header'>
        <h3>Deleted Messages</h3>
        {deletedMessages.length !== 0 && 
            <div>
                {!refreshIsClicked ?
                    <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
                :
                    <Refresh style={{backgroundColor: "white"}} />
                }
            </div>
        }        
    </div>
        {deletedMessages.length !== 0 ? 
          deletedMessages.map((item, index) => (
            <div key={index} className={(item.is_read === true || isReadDeletedMessage.includes(index)) ? "inbox-read" :'inbox'} 
                onClick={isHoverDeleteForeverIcon.current ? null : () => onMessageDeletedClicked(index)} 
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
                    <div className='inbox-delete-button'>
                        <Tooltip title="Delete Forever" arrow onMouseEnter={() => onMouseHover()} onMouseLeave={() => onMouseLeave()} >
                            <DeleteIcon onClick={() => onDeleteMessageForever(index)} sx={{fontSize: "40px", cursor: "pointer", color: "red"}} />
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
            <p>You do not have deleted messages yet.</p>
            <br />
            {!refreshIsClicked ?
                <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
            :
                <Refresh style={{backgroundColor: "white"}} />
            }
        </div>
        }
        <br />
        <InboxPagination type="deleted" totalData={totalDeletedMessage} />
        {isVisibile && (<MessageDetail data={{data: messageData, type: "deleted-forever"}} clickedClosed={onMessageDetailCloseClicked} />) }
        <AlertNotification alertData={alertDeleteForeverResponse}/>
    </div>
  )
}

export default DeletedMesages