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
    <div className='flex justify-center items-center z-10 fixed top-0 left-0 w-screen h-screen bg-pop-up-bg'>
        <div className='flex flex-col h-[190px] bg-white p-10 rounded-xl shadow-box-shadow'>
            <CloseIcon className='self-end' onClick={props.close} />
            <p className='self-center'>CHANGE USER STATUS</p>
            <Divider />
            <br />
            <ul className='flex gap-4'>
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