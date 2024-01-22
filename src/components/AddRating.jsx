import React, { useContext, useEffect, useState } from 'react'
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import Button from './Button';
import AuthContext from 'Context/AuthContext';
import AlertNotification from './AlertNotification';
import { Divider } from '@mui/material';

const AddRating = (props) => {

    const {jobData, personAccepted} = props.jobRatingData

    const { user, authToken } = useContext(AuthContext)
    let userToken = null
    if (authToken){
      userToken = authToken.access
    }

    const [alertRating, setAlertRating] = useState()
    const [alertResponse, setAlertResponse] = useState()

    const { register, handleSubmit, setError, reset, formState, formState: {
        isDirty, dirtyFields, errors, isValid, isSubmitSuccessful, isSubmitting
    }} = useForm({
        mode: "onChange",
        defaultValues:{
            comment: ""
        }
    });

    const [ratingValue, setRatingValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);

    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    }

    function getLabelText(value) {
        return `${ratingValue} Star${ratingValue !== 1 ? 's' : ''}, ${labels[ratingValue]}`;
      }

    const onSubmitCompanyRating = async(comment, e) => {
        if (ratingValue === 0){
            setAlertRating("Rating still empty")
        } else {
            let sendData = "";
            if (props.notificationType === "personal"){
                sendData = {
                    "rating": ratingValue,
                    "comment": comment["comment"],
                    "to_user_id": jobData.user_posted_id
                }
            } else if (props.notificationType === "company"){
                sendData = {
                    "rating": ratingValue,
                    "comment": comment["comment"],
                    "to_user_id": personAccepted
                }
            }
            const response = await fetch(`/api/rating/add_rating/?id=${jobData.job_id}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userToken}`
                },
                body: JSON.stringify(sendData)
            });
            const data = await response.json()
            if (response.ok){
                props.alertResponse({"success": data.success})
                props.close()
            }
        }
    }

  return (
    <div id="add-rating-wrapper">
        <CloseIcon onClick={props.close} id="close-icon-add-rating" />
        <div id='rating-title-close-icon'>
            <p><span>This job has finished. Please add the rating.</span></p>
        </div>
        <Divider />
        <br />
        <div id='rating-selection'>
            <Box
                sx={{
                    width: 200,
                    display: 'flex',
                    alignItems: 'center',
                }}
                >
                <Rating
                    name="hover-feedback"
                    value={ratingValue}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                        setRatingValue(newValue);
                        if(ratingValue){
                            setAlertRating("")
                        }
                    }}
                    onChangeActive={(event, newHover) => {
                        setHover(newHover);
                    }}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                {ratingValue !== null && (
                    <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : ratingValue]}</Box>
                )}
            </Box>
            {alertRating && <span className='error-field' >{alertRating}</span>}
        </div>
        <p><b>{jobData.job_title}</b></p>
        <form onSubmit={handleSubmit(onSubmitCompanyRating)}>
            <textarea {...register("comment", {required: "Comment is required"})} 
                className='rating-comment-input'
                rows={5}
                disabled={isSubmitting ? true : false}
            ></textarea>
            <br />
            {errors.comment && <span className='error-field' >{errors.comment.message}</span>}
            <Button buttonType="input" label={isSubmitting ? "Sending..." : "Send"} />
        </form>
    </div>
  )
}

export default AddRating