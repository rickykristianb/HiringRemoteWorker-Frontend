import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Button from '../Button'
import EmailContext from '../../Context/EmailContext';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AlertNotification from '../AlertNotification'
import AuthContext from 'Context/AuthContext';

const MessageDetail = (props) => {

    const {authToken} = useContext(AuthContext)
    let userToken = null;
    if (authToken){
        userToken = authToken.access
    }

    const { 
        onDeleteMessage,
        onDeleteMessageForever, 
        onSendReplyMessage, 
        alertResponse,
        setAlertResponse,
        isReply, 
        setIsReply } = useContext(EmailContext)

    const [messageData, setMessageData] = useState()
    const [isExpanded, setIsExpanded] = useState(false)
    const [isRotate, setIsRotate] = useState(false)
    const [prevEmailExpanded, setPrevEmailExpanded] = useState(false)

    const {register, handleSubmit, setError, reset,
        formState: {
          errors, isSubmitting, isSubmitSuccessful
        }} = useForm({
          defaultValues: {
            "message_body": "",
          }
        })

    useEffect(() => {
        console.log(props.data);
        setMessageData(() => (props.data))
    }, [])

    const onClickReply = () => {
        setPrevEmailExpanded(false)
        setIsReply(!isReply)
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
        setIsRotate(!isRotate)
    };

    const togglePrevEmailExpanded = () => {
        setPrevEmailExpanded(!prevEmailExpanded)
    }

    const onCancelReply = () => {
        setIsReply(!isReply)
        setIsRotate(!isRotate)
    }

    const onClickSendReply = (formData) => {
        const reply_data = props.data.data.data
        const data = {formData, reply_data}
        onSendReplyMessage(data)
    }

    const onClickFromSender =async(senderId) => {
        const response = await fetch(`/api/user/check_user_type/?id=${senderId}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        if (response.ok){
            if (data === "company"){
                window.open(`/profile/company/?id=${senderId}`)
            } else if (data === "personal"){
                window.open(`/profile/?id=${senderId}`)
            }
        }
    }

  return (
    <div className={isReply ? 'message-detail-container-reply max-sm:w-full max-sm:h-[100%] rounded-lg' : 'message-detail-container max-sm:w-full max-sm:h-[100%] rounded-lg' } >
        <div className={isReply ? (isExpanded ? "message-detail-reply-expanded max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[1305px] rounded-lg" : "message-detail-reply max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[853px] rounded-lg") : prevEmailExpanded ? "message-detail-prevEmailExpanded max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[1310px] rounded-lg" : 'message-detail max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[853px] rounded-lg'} >
            {/* HEADER DATA */}
            <div className='max-sm:flex max-sm:items-center max-sm:justify-end max-sm:pr-2 max-sm:w-[100%] max-sm:mb-4 max-sm:bg-dark-basic max-sm:mx-0 max-sm:rounded-t-xl'>
                <CloseIcon className="message-detail-close-button max-sm:static max-sm:my-2 max-sm:text-white" onClick={props.clickedClosed} />
            </div>
            
            <div className='w-full flex flex-wrap'>
                <p className='text-3xl max-w-full max-sm:max-w-sm break-all leading-8 mb-5'>{props.data.data.data.subject}</p>
            </div>
            <hr className='mb-8' />

            <div className='flex justify-between'>
                <div className='flex gap-20'>
                    <p id="sender-name" onClick={() => console.log(props.data.data.data.id)}>From: <u onClick={() => onClickFromSender(props.data.data.data.sender.id)}>{props.data.data.data.sender.name}</u></p>
                </div>
                <div className='flex gap-5 max-sm:hidden sm:flex'>
                    <p>{props.data.data.data.created.date}</p>
                    <p>{props.data.data.data.created.time}</p>
                </div>      
            </div>
            {/* FOR MOBILE */}
            <div className='flex justify-end w-full max-sm:flex sm:hidden max-sm:relative max-sm:mt-4'>
                <div className='flex gap-5'>
                    <p>{props.data.data.data.created.date}</p>
                    <p>{props.data.data.data.created.time}</p>
                </div>
            </div> 

            {/* SHOWING BUTTON TO SHOW PREV EMAIL OF THE REPLY */}
            {isReply && 
                <p onClick={toggleExpanded} className='cursor-pointer my-5'>
                    Show Email <KeyboardDoubleArrowDownIcon className={`rotating-button ${isRotate ? "show-email-rotated": ""}`} sx={{fontSize: "18px"}} />
                </p>
            }
            
            {!isReply && props.data.data.data.prev_reply_message &&
                <p onClick={togglePrevEmailExpanded} className='cursor-pointer my-5'>
                    Prev Email <KeyboardDoubleArrowDownIcon className={`rotating-button ${isRotate ? "show-email-rotated": ""}`} sx={{fontSize: "18px"}} />
                </p>
            }

            {prevEmailExpanded && 
                <div className="sender-body-message max-sm:mb-4" >
                    <p className='body-content'>{props.data.data.data.prev_reply_message.split('\n').map((line, i) => (
                        <Fragment key={i}>
                            {i > 0 && <br />}
                            {line}
                        </Fragment>
                    ))}</p>
                </div>
            }

            <br className='max-sm:hidden sm:block' />
            
            {/* SHOWING MESSAGE BODY IN FRONT PAGE (NOT CLICKING REPLY) */}
            {!isReply && !isExpanded &&
                <div className="sender-body-message" >
                    <p className='body-content'>{props.data.data.data.body.split('\n').map((line, i) => (
                        <Fragment key={i}>
                            {i > 0 && <br />}
                            {line}
                        </Fragment>
                    ))}</p>
                </div>
            }

            {isExpanded && 
                <div className={`expandable ${isExpanded ? 'show' : ''}`} id="nav">
                    <div className='sender-body-message max-sm:mt-0'>
                        <p className='body-content'>{props.data.data.data.body.split('\n').map((line, i) => (
                            <Fragment key={i}>
                                {i > 0 && <br />}
                                {line}
                            </Fragment>
                        ))}</p>
                    </div>
                </div>
            }
            
            <br />
            {/* SHOWING BUTTON DELETE OR DELETE FOREVER BASED ON MESSAGE TYPE == INBOX OR SENT */}
            {(props.data.type === "inbox" || props.data.type === "sent") && !isReply &&
                <div className='message-replay'>
                    <>
                        <Tooltip title="Delete" arrow>
                            <DeleteIcon 
                                onClick={props.data.type === "deleted-forever" ? () => onDeleteMessageForever(props.data.data.index) : () => onDeleteMessage(props.data.data.index)} 
                                sx={{fontSize: "40px", cursor: "pointer"}} />
                        </Tooltip>

                        {/* REPLY MESSAGE CURRENTLY ON INBOX ONLY */}
                        {props.data.type === "inbox" &&
                            <Button buttonType="button" label="Reply" clickedButton={() => onClickReply()} />
                        } 
                    </>
                </div>
            }

            {/* SHOWING BUTTON DELETE OR DELETE FOREVER BASED ON MESSAGE TYPE == DELETE FOREVER */}
            {props.data.type === "deleted-forever" &&
                <div className='message-replay'>
                    <>
                        <Tooltip title="Delete Forever" arrow>
                            <DeleteIcon 
                                onClick={props.data.type === "deleted-forever" ? () => onDeleteMessageForever(props.data.data.index) : () => onDeleteMessage(props.data.data.index)} 
                                sx={{fontSize: "40px", cursor: "pointer", color: "red"}} />
                        </Tooltip>
                    </>
                </div>
            }
            
            {/* SHOWING REPLAY FORM IF USER CLICK REPLY */}
            {isReply && 
                <div className='form-replay-container'>
                    <form onSubmit={handleSubmit(onClickSendReply)} className='form-replay' >
                        <textarea {...register("message_body", {required: "Please specify your message subject"})} rows="18" className="send-message-textarea-reply" placeholder='Message' disabled={ isSubmitting }/> 
                        {errors.message_body && <span className='error-field'>{errors.message_body.message}</span>}
                        <br />
                        <Button buttonType="button" label={isSubmitting ? "Sending ..." : "Send"} />
                    </form>
                    <Button clickedButton={() => onCancelReply()} label="Cancel" buttonType="button" customClassName="reply-cancel-button" customStyle={{backgroundColor: "red", color: "white", border: "1px solid red"}} />
                </div>
            }
        </div>
        <AlertNotification alertData={alertResponse}/>
        </div>
  )
}

export default MessageDetail