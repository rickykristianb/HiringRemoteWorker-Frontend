import React, { useContext, useEffect, useRef, useState } from 'react'
import EmailContext from '../../Context/EmailContext'
import MessageDetail from './MessageDetail'
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ReactComponent as Refresh } from "../../assets/images/Refresh.svg"
import AlertNotification from '../AlertNotification'
import Pagination from '../Pagination';

const SentMessages = () => {

  const [hover, setHover] = useState()
  const [refreshIsClicked, setRefreshIsClicked] = useState(false)
  let isHoverDeleteIcon = useRef(false)
  let type = useRef("sent")
  
  let {
      onLoadMessages,
      messages,
      sentMessages,
      isVisible,
      messageData,
      totalSentMessage,
      onLoadBody,
      onMessageClicked,
      onMessageDetailCloseClicked,
      onDeleteMessage,
      onDeleteSentMessages,
      alertDeleteSentMessage,
      deleteInProgress,
      onCheckSentMessages,
      setAlertDeleteSentMessage
  } = useContext(EmailContext)

  useEffect(() => {
    onCheckSentMessages()
    setAlertDeleteSentMessage()
  }, [])

  const onHoverMouse = (index) => {
      setHover(index)
  }

  const onLeaveMouse = () => {
      setHover(null)
  }

  const onRefreshIconClicked = async() => {
      setRefreshIsClicked(!refreshIsClicked)
      await onCheckSentMessages()
      setRefreshIsClicked(false)
  }

  const onMessageSentClicked = (index) => {
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
        <h3>Sent Messages</h3>
        {sentMessages.length !== 0 && 
            <div>
                {!refreshIsClicked ?
                    <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
                :
                    <Refresh style={{backgroundColor: "white"}} />
                }
            </div>
        }
        
        
    </div>
        {sentMessages.length !== 0 ? 
          sentMessages.map((item, index) => (
            <div key={index} className='inbox'
                onClick={deleteInProgress ? null : () => onMessageSentClicked(index)}
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
                        <Tooltip title="Delete" arrow onMouseEnter={() => onMouseHover()} onMouseLeave={() => onMouseLeave()}>
                            <DeleteIcon onClick={() => onDeleteSentMessages(index)} sx={{fontSize: "40px", cursor: "pointer"}} />
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
            <p>You have not sent any messages yet.</p>
            <br />
            {!refreshIsClicked ?
                <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
            :
                <Refresh style={{backgroundColor: "white"}} />
            }
        </div>
        }
        <br />
        <Pagination type="sent" totalData={totalSentMessage} />
        {isVisible && (<MessageDetail data={{data: messageData, type: "sent"}} clickedClosed={onMessageDetailCloseClicked} />) }
        <AlertNotification alertData={alertDeleteSentMessage}/>
    </div>
  )
}

export default SentMessages