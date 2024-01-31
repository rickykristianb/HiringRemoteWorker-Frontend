import React, { useContext, useEffect, useRef, useState } from 'react'
import EmailContext from '../../Context/EmailContext';
import MessageDetail from './MessageDetail'
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import AlertNotification from '../AlertNotification';
import { ReactComponent as Refresh } from "../../assets/images/Refresh.svg"
import Pagination from '../Pagination';

const DeletedMessages = () => {

  const [hover, setHover] = useState()
    const [refreshIsClicked, setRefreshIsClicked] = useState(false)

    const type = useRef("deleted")
    let isHoverDeleteForeverIcon = useRef(false)

    const {
        onLoadMessages,
        messages,
        totalDeletedMessage,
        deletedMessages,
        isVisible,
        messageData,
        isRead,
        isReadDeletedMessage,
        onLoadBody,
        onLoadSubjectForMobile,
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
    <>
    {/* DELETED MESSAGES FOR LARGE SCREEN */}
        <div className='max-md:hidden'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <h3 className='font-bold text-xl leading-10'>Deleted Messages</h3>
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
                <p className='leading-10'>You do not have deleted messages yet.</p>
                <br />
                {!refreshIsClicked ?
                    <RefreshIcon onClick={() => onRefreshIconClicked()} className='refresh-icon' />
                :
                    <Refresh style={{backgroundColor: "white"}} />
                }
            </div>
            }
            <br />
            <Pagination type="deleted" totalData={totalDeletedMessage} />
            {isVisible && (<MessageDetail data={{data: messageData, type: "deleted-forever"}} clickedClosed={onMessageDetailCloseClicked} />) }
            <AlertNotification alertData={alertDeleteForeverResponse}/>
        </div>

        {/* DELETED MESSAGES FOR MOBILE SCREEN */}
        <div className='md:hidden max-md:block'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <h3 className='font-bold text-xl leading-10 max-md:pl-4 max-md:mt-[150px]'>Deleted Messages</h3>
                {deletedMessages.length !== 0 && 
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
                {deletedMessages.length !== 0 ? 
                deletedMessages.map((item, index) => (
                    <div key={index} className={(item.is_read === true || isReadDeletedMessage.includes(index)) ? "bg-read-messages border border-border-messages h-[160px] p-2" :'bg-soft-basic border border-border-messages h-[160px] p-2'} 
                        onClick={isHoverDeleteForeverIcon.current ? null : () => onMessageDeletedClicked(index)} 
                    >

                        <div className='sender-name-container'>
                            <p><b>{item.sender.name}</b></p>
                        </div>
                        <div className='h-[100px]'>
                            <p className='leading-10'><b>{onLoadSubjectForMobile(item.subject)}</b></p>
                            <p>{onLoadBody(item.body)}</p>
                        </div>
                        {hover === index ?
                            <div className='inbox-delete-button'>
                                <Tooltip title="Delete Forever" arrow onMouseEnter={() => onMouseHover()} onMouseLeave={() => onMouseLeave()} >
                                    <DeleteIcon onClick={() => onDeleteMessageForever(index)} sx={{fontSize: "40px", cursor: "pointer", color: "red"}} />
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
                    <p className='leading-10'>You do not have deleted messages yet.</p>
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
                <Pagination type="deleted" totalData={totalDeletedMessage} />
            </div>
            
            {isVisible && (<MessageDetail data={{data: messageData, type: "deleted-forever"}} clickedClosed={onMessageDetailCloseClicked} />) }
            <AlertNotification alertData={alertDeleteForeverResponse}/>
        </div>
        <br />
    </>
    
  )
}

export default DeletedMessages