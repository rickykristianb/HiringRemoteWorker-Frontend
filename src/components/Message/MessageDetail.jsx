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

const MessageDetail = (props) => {

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

  return (
    <div className={isReply ? 'message-detail-container-reply' : 'message-detail-container' } >
        <div className={isReply ? (isExpanded ? "message-detail-reply-expanded" : "message-detail-reply") : prevEmailExpanded ? "message-detail-prevEmailExpanded" : 'message-detail'} >
            {/* HEADER DATA */}
            <CloseIcon className="message-detail-close-button" onClick={props.clickedClosed} />
            <h1>{props.data.data.data.subject}</h1>
            <div className='sender-date-message'>
                <div className='sender-message'>
                    <p id="sender-name" onClick={() => console.log(props.data.data.data.id)}>From: <u>{props.data.data.data.sender.name}</u></p>
                </div>
                <div className='date-message'>
                    <p>{props.data.data.data.created.date}</p>
                    <p>{props.data.data.data.created.time}</p>
                </div>      
            </div>

            {/* SHOWING BUTTON TO SHOW PREV EMAIL OF THE REPLY */}
            {isReply && 
                <p onClick={toggleExpanded}>
                    Show Email <KeyboardDoubleArrowDownIcon className={`rotating-button ${isRotate ? "show-email-rotated": ""}`} sx={{fontSize: "18px"}} />
                </p>
            }
            
            {!isReply && props.data.data.data.prev_reply_message &&
                <p onClick={togglePrevEmailExpanded}>
                    Prev Email <KeyboardDoubleArrowDownIcon className={`rotating-button ${isRotate ? "show-email-rotated": ""}`} sx={{fontSize: "18px"}} />
                </p>
            }

            {prevEmailExpanded && 
                <div className="sender-body-message" >
                    <p className='body-content'>{props.data.data.data.prev_reply_message.split('\n').map((line, i) => (
                        <Fragment key={i}>
                            {i > 0 && <br />}
                            {line}
                        </Fragment>
                    ))}</p>
                </div>
            }

            <br />
            
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
                    <div className='sender-body-message'>
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
                        <textarea {...register("message_body", {required: "Please specify your message subject"})} rows="30" className="send-message-textarea-reply" placeholder='Message' disabled={ isSubmitting }/> 
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