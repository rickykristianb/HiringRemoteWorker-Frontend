import Button from 'components/Button'
import EditJob from 'components/EditJob'
import AlertNotification from 'components/AlertNotification'
import React, { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InterestedUsers from 'components/CompanyPanel/InterestedUsers'
import { format } from 'date-fns';

const JobDetailPanel = () => {

    const [jobData, setJobData] = useState()
    const [isSeeMoreClicked, setIsSeeMoreClicked] = useState(false)
    const [isEditJob, setIsEditJob] = useState(false)
    const [editJobData, setEditJobData] = useState()
    const [alertResponse, setAlertResponse] = useState()

    const { jobId } = useParams()
    const navigate = useNavigate()

    const onLoadJobData = async() => {
        const response = await fetch(`/api/job/get_job_detail/${jobId}/`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            }
        });
        const data = await response.json()
        if (data.error){
            navigate("/job-not-found/")
        } else {
            if (response.ok){
                setJobData(data)
            }
        }
    }

    useEffect(() => {
        onLoadJobData()
    }, [])

    const onClickSeeMore = () => {
        setIsSeeMoreClicked(true)
    }

    const onClickSeeLess = () => {
        setIsSeeMoreClicked(false)
    }

    const onClickEditJobButton = (data) => {
        setIsEditJob(true)
        setEditJobData(data)

        document.body.classList.add("disable-scroll")
    }

    const onClickCancelEditButton = () => {
        setIsEditJob(false)

        document.body.classList.remove('disable-scroll');
    }
    
    const onClickSeeAllJobs = () => {
        navigate("/company-panel/?tab=jobs")
    }

  return (
    <div id='job-detail-panel-container'>
        <div id="job-detail-panel-layout">
            <div id="job-detail-panel-content">
                <div id='job-detail-panel-back-button' >
                    <div onClick={() => onClickSeeAllJobs()}>
                        <ArrowBackIcon  />
                        <p>See all posted jobs</p>
                    </div>
                    <div id='job-detail-panel-edit'>
                        <Button buttonType="button" label="Edit" 
                            clickedButton={() => onClickEditJobButton({
                                data: {
                                    id: jobData.id, 
                                    jobTitle: jobData.job_title,
                                    jobDetail: jobData.job_detail,
                                    skills: jobData.jobskills,
                                    jobLocation: jobData.joblocation,
                                    jobEmploymentType: jobData.jobemploymenttype,
                                    jobSalary: jobData.jobsalaryrates,
                                    jobExperienceLevel: jobData.experience_level,
                                    jobStatus: jobData.status,
                                    jobDeadline: jobData.deadline
                                }
                            })} />
                    </div>
                </div>
                <br />
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Job Title</span>
                    <span>{jobData?.job_title}</span>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Status</span>
                    <span>{jobData?.status}</span>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Job Skills</span>
                    <ul>
                        {jobData?.jobskills.map((item, i) => (
                            <li key={item.skill.id}>
                                {item.skill.skill_name} {i < jobData?.jobskills.length-1 && <span>&nbsp;/&nbsp;</span>}
                            </li>
                        ))}
                    </ul>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Location</span>
                    <ul>
                        {jobData?.joblocation?.map((item, i) => (
                            <li key={item.location?.id}>
                                {item.location?.location} {i < jobData?.joblocation.length-1 && <span>&nbsp;/&nbsp;</span>}
                            </li>
                        ))}
                    </ul>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Job Type</span>
                    <ul>
                        {jobData?.jobemploymenttype?.map((item, i) => (
                            <li key={item.employment_type.id}>
                                {item.employment_type.type} {i < jobData?.jobemploymenttype.length-1 && <span>&nbsp;/&nbsp;</span>}
                            </li>
                        ))}
                    </ul>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Job Salary</span>
                    <span>${jobData?.jobsalaryrates?.nominal} / {jobData?.jobsalaryrates.paid_period}</span>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Job Experience</span>
                    <span>{jobData?.experience_level}</span>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Created At</span>
                    <span>{jobData?.created_at}</span>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Updated At</span>
                    <span>{jobData?.updated_at}</span>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Deadline</span>
                    <span>{jobData?.deadline && format(new Date(jobData?.deadline), 'MM-dd-yyyy')}</span>
                </div>
                <br />
                <div id="job-label-data-container">
                    <span className='job-detail-label'>Job Detail</span>
                    {!isSeeMoreClicked 
                    ?
                        <span>{jobData?.job_detail.slice(0, 300)}{jobData?.job_detail.length > 300 && <span onClick={onClickSeeMore} style={{cursor: "pointer"}}><b>... See more</b></span>}</span>
                    :
                        <span>{jobData.job_detail?.split("\n").map((line, i) => (
                            <Fragment key={i}>
                                {i > 0 && <br />}
                                {line}
                            </Fragment>
                        ))}
                        <span onClick={onClickSeeLess} style={{cursor: "pointer"}}><b> See less</b></span>
                        </span>
                    }
                </div>
                <br />
                <br />
                <br />
                <div>
                    <InterestedUsers jobId={jobId} />
                </div>
            </div>
        </div>
        {isEditJob && 
          <div id='posted-page-edit-job-form-container'>
            <EditJob 
              editData={editJobData} 
              clickedCancel={() => onClickCancelEditButton()}
              closeForm={() => onClickCancelEditButton()} 
              notification={setAlertResponse}
              onLoadJobPosted={onLoadJobData}
              needPagination={false}
            />
          </div>
        }
        {alertResponse && <AlertNotification alertData={alertResponse}/>}
    </div>
  )
}

export default JobDetailPanel