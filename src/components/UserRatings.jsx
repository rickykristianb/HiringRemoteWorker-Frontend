import React, { useContext, useEffect, useState } from 'react'
import RateGenerator from './RateGenerator'
import { Divider } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import AuthContext from 'Context/AuthContext'

const UserRatings = (props) => {

    const { authToken } = useContext(AuthContext)
    let userToken;
    if (authToken){
        userToken = authToken.access
    } 

    const clickUserName = async(userId) => {
        const response = await fetch(`/api/user/check_user_type/?id=${userId}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        if (response.ok){
            if (data === "company"){
                window.location.href = `/profile/company/?id=${userId}`
            } else if (data === "personal"){
                window.location.href = `/profile/?id=${userId}`
            }
        }
    }

  return (
    <div>
        <h1>Ratings</h1>
        <br />
        {props.ratingData.length > 0 ?
        props.ratingData.map((item) => {
            return (
                <div key={item.id} id='rating-detail-container'>
                    <p id="user-rating"><RateGenerator rating={item.rate_value} /></p>
                    <div id='job-name-date-wrapper'>
                        <h2>{item.job_name}</h2>
                        <p>{item.created_at.split("T")[0]}</p>
                    </div>
                    <p onClick={() => clickUserName(item.from_user.id)}><b>{item.from_user.name}</b></p>
                    <div id='comment-wrapper'>
                        <p>Comment:</p>
                        <p>{item.comment}</p>
                    </div>
                </div>
            )
        })
        :
        <p>No Rating at the moment</p>
        }
        
    </div>
  )
}

export default UserRatings