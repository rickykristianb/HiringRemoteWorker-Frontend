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
      onLoadSubjectForMobile,
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
    <>
        <div className='max-md:hidden'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <h3 className='font-bold text-xl leading-10'>Sent Messages</h3>
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
                <p className='leading-10'>You have not sent any messages yet.</p>
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

        {/* SENT MESSAGES FOR MOBILE */}
        <div className='md:hidden max-md:block'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <h3 className='font-bold text-xl leading-10 max-md:pl-4 max-md:mt-[150px]'>Sent Messages</h3>
                {sentMessages.length !== 0 && 
                    <div className='max-md:mt-[150px] max-md:pr-6'>
                        {!refreshIsClicked ?
                            <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
                        :
                            <Refresh style={{backgroundColor: "white"}} />
                        }
                    </div>
                }
            </div>

            <div  className='h-[800px] max-md:px-4'>
                {sentMessages.length !== 0 ? 
                sentMessages.map((item, index) => (
                    <div key={index} className='bg-soft-basic border border-border-messages h-[160px] p-2'
                        onClick={deleteInProgress ? null : () => onMessageSentClicked(index)}
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
                                <Tooltip title="Delete" arrow onMouseEnter={() => onMouseHover()} onMouseLeave={() => onMouseLeave()}>
                                    <DeleteIcon onClick={() => onDeleteSentMessages(index)} sx={{fontSize: "40px", cursor: "pointer"}} />
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
                    <p className='leading-10'>You have not sent any messages yet.</p>
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
                <Pagination type="sent" totalData={totalSentMessage} />
            </div>
            
            {isVisible && (<MessageDetail data={{data: messageData, type: "sent"}} clickedClosed={onMessageDetailCloseClicked} />) }
            <AlertNotification alertData={alertDeleteSentMessage}/>
        </div>
        <br />
    </>
  )
}

export default SentMessages