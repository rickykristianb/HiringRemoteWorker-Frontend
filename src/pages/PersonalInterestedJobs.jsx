import React, { useContext, useEffect, useState } from 'react'
import { Divider } from '@mui/material';
import AuthContext from 'Context/AuthContext'
import Select from "react-select";
import Button from 'components/Button';
import DeleteConfirmation from 'components/DeleteConfirmation';

const PersonalInterestedJobs = () => {

    let userToken;
    const {authToken} = useContext(AuthContext)
    if (authToken){
        userToken = authToken.access
    }

    const [allInterestedJobs, setAllInterestedJobs] = useState([])
    const [filterData, setFilterData] = useState([])
    const [withdrawFetchedData, setWithdrawFetchedData] = useState([])
    const [openWithdrawConfirmation, setOpenWithdrawConfirmation] = useState(false)
    const [withdrawJobId, setWithdrawJobId] = useState()
    const [withdrawItemId, setWithdrawItemId] = useState()
    const [loadedStatus, setLoadedStatus] = useState([])
    const [statusFilterSelected, setStatusFilterSelected] = useState("Filter")
    const [isFilterActive, setIsFilterActive] = useState(false)

    const onLoadAllInterestedJobs = async() => {
        const response = await fetch(`/api/job/get_interested_job_by_user/`,{
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        if (response.ok){
            setAllInterestedJobs(data.filter((item) => (item.status.status !== "Withdraw")))
        }
    }

    const onLoadStatus = async() => {
        const response = await fetch("/api/job/get_all_job_status/", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });
        const data = await response.json()
        if (response.ok){
            setLoadedStatus(data)
        }
    }

    useEffect(() => {
        onLoadAllInterestedJobs()
        onLoadStatus()
    }, [])

    const statusProcessing = (status) => {
        let statusCovert = ""
        switch (status){
            case "Eliminated":
                return statusCovert = "I am sorry, you are rejected.";
                break;
            case "Applied":
                return statusCovert = "Thank you for liking our job posted.";
                break;
            case "Reviewed":
                return statusCovert = "Yours is being reviewed.";
                break;
            case "Whitelist":
                return statusCovert = "Hold on, you are on the queue.";
                break;
            case "Accepted":
                return statusCovert = "You got it, you have been accepted to work with us.";
                break;
            case "Withdraw":
                return statusCovert = "You have withdrawn from this job. You cannot reapply.";
                break;
        }
    }

    const statusClassName = (status) => {
        let statusClassName = ""
        switch (status){
            case "Eliminated":
                return statusClassName = "eliminated-status";
                break;
            case "Applied":
                return statusClassName = "applied-status";
                break;
            case "Reviewed":
                return statusClassName = "reviewed-status";
                break;
            case "Whitelist":
                return statusClassName = "whitelist-status";
                break;
            case "Accepted":
                return statusClassName = "accepted-status"
                break;
            case "Withdraw":
                return statusClassName = "withdraw-status"
                break;
            }
    }

    const onClickWithdraw = (id) => {
        const {jobId, dataId} = id
        setWithdrawJobId(jobId)
        setWithdrawItemId(dataId)
        setOpenWithdrawConfirmation(true)
        document.body.classList.add("disable-scroll")
    }

    const onClickYesWithdraw = async() => {
        await onWithdrawJob()
        setOpenWithdrawConfirmation(false)
    }

    const onClickNo = () => {
        setOpenWithdrawConfirmation(false)
        setWithdrawJobId()
        setWithdrawItemId()
        document.body.classList.remove("disable-scroll")
    }

    const onWithdrawJob = async() => {
        try{
            const response = await fetch(`/api/job/withdraw_job/?id=${withdrawJobId}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userToken}`
                }
            });
            const data = await response.json()
            if (response.ok){
                setAllInterestedJobs(allInterestedJobs.filter((item) => (item.status.status !== "Withdraw" && item.id !== withdrawItemId)))
                setOpenWithdrawConfirmation(false)
            }
        } catch (error){
            console.error(error);
        } finally{
            document.body.classList.remove("disable-scroll")
        }
    }

    const onChangeStatusFilter = (option) => {
        setStatusFilterSelected(option["value"])
        setIsFilterActive(true)
    }

    useEffect(() => {
        setFilterData(allInterestedJobs.filter((item) => (item.status.status === statusFilterSelected)))

        if (statusFilterSelected === "Withdraw"){
            onLoadWithdrawInterestedJob()
        }
        setWithdrawFetchedData([])
    }, [statusFilterSelected])

    const onLoadWithdrawInterestedJob = async() => {
        const response = await fetch(`/api/job/get_withdraw_job_by_user/`,{
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        if (response.ok){
            setWithdrawFetchedData(data)
        }
    }

    const onOpenJobDetail = (jobId) => {
        window.open(`/jobs/${jobId}/`)
    }

    const onOpenUserPostedJob = (companyId) => {
        window.open(`/profile/company/?id=${companyId}`)
    }

    const htmlLayout = (item) => {
        return (
            <div key={item.id} id='interested-job'>
                <div id='interested-job-detail'>
                    <h2 onClick={() => onOpenJobDetail(item.job.id)}>{item.job.job_title}</h2>
                    <span onClick={() => onOpenUserPostedJob(item.job.user_posted_id)}>{item.job.user_posted}</span>
                    <br />
                    <br />
                    <p><span className={statusClassName(item.status.status)}>{item.status.status}</span> {statusProcessing(item.status.status)}</p>
                </div>
                <div id='interested-job-date'>
                    <p>Applied On: {item.applied_on?.split("T")[0] + "," + item.applied_on?.split("T")[1].split(".")[0]}</p>
                    <p>Status Updated On: {item.last_status_updated_on?.split("T")[0] + "," + item.last_status_updated_on?.split("T")[1].split(".")[0]}</p>
                    <br />
                    {(item.status.status !== "Accepted" && item.status.status !== "Withdraw") &&
                        <Button clickedButton={() => onClickWithdraw({jobId:item.job.id, dataId:item.id})} buttonType="button" label="Withdraw" />
                    }
                </div>
            </div>
        )
    }

  return (
    <div id='interested-jobs-container'>
        <div id='interested-jobs-wrapper'>
            <h1>Interested Jobs</h1>
            <Divider />
            <br />
            <div id='interested-jobs-status-filter-wrapper'>
                <Select
                    id='interested-jobs-status-filter'
                    options={loadedStatus.map((item) => ({id: item.id, value: item.status, label: item.status}))}
                    value={{value: statusFilterSelected, label: statusFilterSelected}}
                    onChange={(selectedOption) => onChangeStatusFilter(selectedOption)}
                    placeholder="Filter"
                />
            </div>
            <br />
            {isFilterActive ?
                withdrawFetchedData.length > 0 ?
                    withdrawFetchedData.map((item) => {
                        return (
                            htmlLayout(item)
                        )
                    })
                :
                filterData.length > 0 ?
                    filterData.map((item) => {
                        return (
                            htmlLayout(item)
                        )
                    })
                :
                <div className='interested-job-no-data'>
                    <p>No interested jobs match with your filter.</p>
                </div>
            :
                allInterestedJobs.length > 0 ?
                    allInterestedJobs.map((item) => {
                        return (
                            htmlLayout(item)
                        )
                    })
                :
                <div className='interested-job-no-data'>
                    <p>No interested job at the moment. </p>
                </div>
            }
        </div>
        {openWithdrawConfirmation && <DeleteConfirmation deleteLabel="Are you sure want to withdraw this job?" onClickYes={onClickYesWithdraw} onClickNo={onClickNo} />}
    </div>
  )
}

export default PersonalInterestedJobs