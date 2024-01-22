import { Divider } from '@mui/material'
import AuthContext from 'Context/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import AddRating from './AddRating';
import AlertNotification from './AlertNotification';

const NotificationMessage = (props) => {

    const navigate = useNavigate()

    const [notificationMessage, setNotificationMessage] = useState([])
    const [isNotificationLoadingOpen, setIsNotificationLoadingOpen] = useState(false)
    const [openRating, setOpenRating] = useState(false)
    const [ratingJobData, setRatingJobData] = useState()
    const [alertResponse, setAlertResponse] = useState()
    const {authToken} = useContext(AuthContext)
    let userToken;
    if (authToken){
        userToken = authToken.access
    }

    const onLoadNotification = async() => {
        props.onClickNotification()
        setIsNotificationLoadingOpen(true)
        const response = await fetch(`/api/job/get_notification/`,{
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        if (response.ok){
            setNotificationMessage(data)
        }
        setIsNotificationLoadingOpen(false)
    }

    useEffect(() => {
        onLoadNotification()
    }, [])

    const onProcessNotificationMessage = (message) => {
        const splitArray = message.split(/[\[\]]/);
        splitArray[1] = <b>{splitArray[1]}</b>
        return splitArray
    }

    const onClickNotificationMessage = async(jobIdStatus) => {
        const {notificationId, jobId, jobData, personAccepted} = jobIdStatus;
        const response = await fetch(`/api/job/update_is_read_notification/${notificationId}/`,{
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        if (response.ok){
            if (jobData.job_status === "Finished"){
                const isAlreadyAddRating = await checkRatingIsExist({jobId: jobData.job_id, userPostedId: jobData.user_posted_id, personAccepted: personAccepted})
                if (!isAlreadyAddRating){
                    setOpenRating(true)
                    setRatingJobData({jobData: jobData, personAccepted: personAccepted})
                } else {
                    window.location.href = `/jobs/${jobId}/`
                }
            } else {
                window.location.href = `/jobs/${jobId}/`
            }
        }
    }

    const checkRatingIsExist = async(checkData) => {
        const {jobId, userPostedId, personAccepted} = checkData
        let toUser;
        if(props.notificationType === "personal"){
            toUser = userPostedId
        } else if (props.notificationType === "company"){
            toUser = personAccepted
        }
        const response = await fetch(`/api/rating/check_rating_is_exist/?jobId=${jobId}&toUser=${toUser}`,{
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        return data
    }

    const addAlertResponse = (alert) => {
        if (alert) {
            setAlertResponse(alert)
        } else {
            setAlertResponse()
        }
        
    }

  return (
    <div onClick={(e) => e.stopPropagation()} >
        {isNotificationLoadingOpen ?
            <div id="notification-message-loading-wrapper">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        :
        notificationMessage.length > 0 ?
        <div id="notification-message-wrapper">
            <ul >
                {notificationMessage.map((item) => {
                    return (
                        <div key={item.id} id={!item.is_read && 'notification-message-unread'}>
                            <li id="notification-message-list" onClick={() => onClickNotificationMessage({notificationId: item.id, jobId:item.job.job_id, jobData: item.job, personAccepted: item.user_accepted})}>
                                <p id='notification-message'>{onProcessNotificationMessage(item.message)}</p>
                                <br />
                                <span id='notification-message-created-date'>{item.created_at?.split("T")[0]}</span>
                            </li>
                            <Divider />
                        </div>
                    )
                })}
            </ul>
        </div>
        :
        <div id="notification-message-loading-wrapper">
            <p>No notification at the moment.</p>
        </div>
        }
        {openRating && 
        <div id='add-rating-container'>
            <AddRating jobRatingData={ratingJobData} close={() => setOpenRating(false)} alertResponse={addAlertResponse} notificationType={props.notificationType} />
        </div>
        }
        {alertResponse && <AlertNotification alertData={alertResponse}/>}
    </div>
  )
}

export default NotificationMessage