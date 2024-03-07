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
        <p className='text-[32px] font-bold'>Ratings</p>
        <br />
        <div className='w-full'>
            {props.ratingData.length > 0 ?
            props.ratingData.map((item) => {
                return (
                    <div key={item.id} id='rating-detail-container' className='flex flex-col gap-5 p-10'>
                        <p className='pl-20'><RateGenerator rating={item.rate_value} /></p>
                        <div id='job-name-date-wrapper'>
                            <p className='text-2xl font-bold'>{item.job_name}</p>
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
    </div>
  )
}

export default UserRatings