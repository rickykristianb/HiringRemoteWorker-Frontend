import React, { useEffect, useState, Fragment, useMemo } from 'react'
import Select from "react-select";
import CloseIcon from '@mui/icons-material/Close';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Button from './Button';
import Backdrop from '@mui/material';
import { Divider } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RateGenerator from './RateGenerator';
import { useNavigate } from 'react-router-dom';


const ViewInterestedUserProfile = (props) => {

    const navigate = useNavigate()

    const [loadedStatus, setLoadedStatus] = useState()
    const [status, setStatus] = useState({
        id: "",
        name: props.defaultStatusSelection?.status
    })
    const [isSavingStatus, setIsSavingStatus] = useState(false)
    const [isChangeStatus, setIsChangeStatus] = useState(false)
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        location: "",
        shortBio: "",
        bio: "",
        skills: [],
        portfolio: [],
        experience: [],
        totalExperience: "",
        empType: [],
        education: [],
        language: [],
        expectedSalary: "",
        rating: ""
    })

    const onLoadUserProfile = async() => {
        const response = await fetch(`/api/user/profile/${props.userId}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });
        const data = await response.json()
        if (response.ok){
            setUserData({
                name: data["name"],
                email: data["email"],
                profilePicture: data["profile_picture"],
                phoneNumber: data["phone_number"],
                location: data["userlocation"]["location"]["location"],
                shortBio: data["short_intro"],
                bio: data["bio"],
                skills: data["skills"],
                portfolio: data["portfolios"],
                experience: data["experiences"]["data"],
                totalExperience: data["experiences"]["total_exp"],
                empType: data["useremploymenttype"],
                education: data["educations"],
                language: data["languages"],
                expectedSalary: data["expectedsalary"],
                rating: data["rate_ratio"]
            })
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
            setLoadedStatus(data.filter((item) => (item.status !== "Withdraw")))
        }
    }

    useEffect(() => {
        onLoadStatus()
        onLoadUserProfile()
    }, [])

    const onClickChangeStatusButton = () => {
        setIsChangeStatus(true)
    }

    const onClickCancelStatusButton = () => {
        setIsChangeStatus(false)
        setStatus({
            id: "",
            name: props.defaultStatusSelection?.status
        })
    }

    const onChangeSelectField = (options) => {
        console.log(options);
        setStatus({
            id: options.id,
            name: options.value
        })
    }

    const onClickSave = async() => {
        setIsSavingStatus(true)
        await props.selectedStatus({itemId: status.id, userId: props.defaultStatusSelection?.id})
        setIsSavingStatus(false)
        setIsChangeStatus(false)
    }

    const onLoadTotalExp = useMemo(() => {
        const year = (userData.totalExperience / 365.25).toString();
        const year_dec = year.split(".")[0];
        const month = Math.round((year - year_dec) * 12);
        return <span>{year_dec} year {month === 0 ? null : `${month} ${month === 1 ? 'month' : 'months'}`}</span>;
      });

    const statusClassName = () => {
    let statusClassName = ""
        switch (status.name){
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
            }
    }

    const sendMessage = () => {
        window.open(`/messages/?email=${userData.email}`)
    }

  return (
    <div id='interested-user-profile-container'>
        <div id='interested-user-profile-wrapper'>
            <div id='interested-user-profile-action-wrapper'>
                <div id='interested-user-profile-action-button'>
                    <h2>Status</h2>
                    {isChangeStatus ?
                    <>
                        <Select
                            id="job-status"
                            name="jobStatus"
                            options={loadedStatus.map((item) => ({id: item.id, value: item.status, label: item.status}))}
                            value={{id:status.id, value: status.name, label: status.name}}
                            onChange={(selectedOption) => onChangeSelectField(selectedOption)}
                        />
                        <Button clickedButton={() => onClickSave()} buttonType="button" label={isSavingStatus ? "Saving..." : "Save"} />
                        <Button clickedButton={() => onClickCancelStatusButton()} customClassName="cancel-button" buttonType="button" label="Cancel" />
                    </>
                    
                    :
                    <>
                        <span className={statusClassName()}>{status.name}</span>
                        <Button clickedButton={() => onClickChangeStatusButton()} buttonType="button" label="Change" />
                    </>
                    }                    
                </div>
                <CloseIcon onClick={props.close} />
            </div>
            <br />
            <Divider />
            <div id='interested-user-profile-detail-wrapper'>
                <div id='interested-user-profile-detail-header'>
                    <div className='interested-user-profile-image-container'>
                        <img
                            src={userData?.profilePicture} // Replace with the actual path or URL of your image
                            alt={"profile-picture"}
                            className="interested-user-profile-image"
                        />
                    </div>
                    <div id='interested-user-profile-name'>
                        <h1>{userData?.name}</h1>
                        <div id="interested-user-table-rate">
                            <RateGenerator id="interested-user-profile-rating" rating={userData?.rating} />
                        </div>
                    </div>
                </div>
                <br />
                <div id='interested-user-profile-detail-container'>
                    <br />
                    <div id='interested-user-profile-detail'>
                        <Button clickedButton={() => sendMessage()} buttonType="button" label="Send Message" />
                    </div>
                    <br />
                    <br />
                    <div id='interested-user-profile-detail'>
                        <p><b>Email:</b></p>
                        <p>{userData.email}</p>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Phone Number:</b></p>
                        <p>{userData?.phoneNumber}</p>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Location:</b></p>
                        <p>{userData?.location}</p>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Short Bio: </b></p>
                        <p>{userData?.shortBio}</p>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Bio: </b></p>
                        <p>{userData?.bio}</p>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Expected Salary: </b></p>
                        <p>${userData?.expectedSalary.nominal}/{userData?.expectedSalary.paid_period}</p>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Employment Type: </b></p>
                        <ul>
                            {userData?.empType.map((item) => {
                                return <li key={item.employment_type.id}>{item.employment_type.type}</li>
                            })}
                        </ul>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Skills: </b></p>
                        <ul>
                            {userData?.skills.map((item) => {
                                return <li key={item.skills.id}>{item.skills.skill_name}</li>
                            })}
                        </ul>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Total Experience: </b></p>
                        <p>{onLoadTotalExp}</p>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Experience: </b></p>
                        <div id='interested-user-profile-detail-experiences'>
                            {userData.experience?.map((experience, index) => {
                                return(
                                    <div key={index} className='experience-container'>
                                    <Accordion sx={{color: "#4e6e81", width: "100%"}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            sx={{backgroundColor: "rgba(216, 230, 239, 1)", boxShadow: "0 2px 5px 0px rgba(78, 110, 110, 0.3)"}}
                                        >
                                            <Typography>
                                            <div className='experience-detail'>
                                            <div className='jobTitle'>
                                                <p>{experience.job_name}</p>
                                            </div>
                                                <div className='experience-date-list'>
                                                <p><i>{experience.start_date}</i></p>
                                                <p id='date-dash'>-</p>
                                                <p><i>{experience.end_date ? experience.end_date : "present"}</i></p>
                                                </div>                 
                                            </div>
                                        </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{boxShadow: "0 2px 5px 0px rgba(78, 110, 110, 0.3)"}}>
                                            <p><b><u>{experience.company_name}</u></b></p>
                                            <p>
                                            {experience.details.split('\n').map((line, i) => (
                                                <Fragment key={i}>
                                                {i > 0 && <br />}
                                                {line}
                                                </Fragment>
                                            ))}
                                            </p>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                                )
                            })}
                        </div>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Portfolio: </b></p>
                        <ul>
                            {userData.portfolio?.map((item) => (
                                <li key={item.id} id="interested-user-profile-detail-portfolio-list">
                                    <a href={`https://${item.portfolio_link}`} target='_blank' rel="noopener noreferrer" >
                                        {item.portfolio_name}
                                        <OpenInNewIcon />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Language: </b></p>
                        <ul id="interested-user-profile-detail-language-list">
                            {userData.language?.map((language, i) => {
                                return (
                                    <li key={i} id='interested-user-profile-detail-language-wrapper'>
                                        <span><b>{language.language}</b></span>
                                        <br />
                                        <Divider />
                                        <div className='item-interested-user-profile-detail'>
                                            <span>{language.proficiency}</span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div id='interested-user-profile-detail'>
                        <p><b>Education: </b></p>
                        <ul>
                            {userData.education?.map((item, i) => {
                                return (
                                    <li key={i}>
                                        <span><b>{item.school_name}</b></span>
                                        <br />
                                        <Divider />
                                        <div className='item-interested-user-profile-detail'>
                                            <span>{item.major}</span><br/>
                                            <span>{item.degree}</span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewInterestedUserProfile