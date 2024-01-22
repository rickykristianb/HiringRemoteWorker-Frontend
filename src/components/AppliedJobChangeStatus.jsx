import React, { useEffect, useState } from 'react'
import { Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AppliedJobStatus = (props) => {

    const [status, setStatus] = useState([])

    const onLoadStatus = async() => {
        const response = await fetch("/api/job/get_all_job_status/", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });
        const data = await response.json()
        if (response.ok){
            setStatus(data.filter((item) => (item.status !== "Withdraw")));
        }
    }

    useEffect(() => {
        onLoadStatus()
    }, [])

  return (
    <div id="applied-job-status-container">
        <div id='applied-job-status-wrapper'>
            <CloseIcon id='close-icon-change-status' onClick={props.close} />
            <p>CHANGE USER STATUS</p>
            <Divider />
            <ul>
                {status.map((item, i) => {
                    return <li 
                                key={i}
                                onClick={() => props.selectedStatus({itemId: item.id, userId: props.defaultSelection.id})}
                                id={props.defaultSelection.status === item.status ? "default-selected-status" : "list-status"} 
                            >{item.status}</li>
                })}
            </ul>
        </div>
    </div>
  )
}

export default AppliedJobStatus