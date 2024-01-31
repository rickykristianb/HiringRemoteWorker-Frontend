import React, { useState, useContext, useEffect, useRef, Fragment } from 'react'
import Button from '../../Button'
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm } from 'react-hook-form';
import AuthContext from '../../../Context/AuthContext';
import AlertNotification from '../../AlertNotification';
import AddExperience from './AddExperience';
import DeleteConfirmation from 'components/DeleteConfirmation';

const Experience = (props) => {
  const [experience, setExperience] = useState([])
  const [experienceList, setExperienceList] = useState([])
  const [disableEndDate, setDisableEndData] = useState(true)
  const [disableEndDateEdit, setDisableEndDataEdit] = useState(true)
  const [isAdded, setIsAdded] = useState(false)
  const [isEdit, setIsEdit] = useState(null)
  const [alertResponse, setAlertResponse] = useState()
  const [totalExp, setTotalExp] = useState()
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)

  const [loginUserId, setLoginUserId] = useState()

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    }

  const {register, handleSubmit, reset,
    formState: {
      errors
    }} = useForm({
      defaultValues: {
        "id": "",
        "companyName": "",
        "jobTitle": "",
        "jobStartDate": null,
        "jobEndDate": null,
        "jobDescription": "",
      }
    })

    const onLoadExperience = async () => {
      try {
        console.log("APE NIH",props.userData[0]["experience"]);
        const experiencesData = await props.userData[0]["experience"];
        setExperienceList(
          experiencesData.map((experience, index) => ({
            id: experience.id,
            companyName: experience.company_name,
            jobTitle: experience.job_name,
            jobStartDate: experience.start_date,
            jobEndDate:
              experience.end_date === "9999-12-31" ? "present" : experience.end_date,
            jobDescription: experience.details,
          }))
        );
        setTotalExp(props.userData[0]["total_exp"]);
      } catch (error) {
        console.error("Error loading experience:", error);
      }
    };
    
    useEffect(() => {
      onLoadExperience();
    }, [props.userData]);
        
    const onAddMoreExperienceSection = () => {
      setIsAdded(true)
      document.body.classList.add("disable-scroll");
    }


    const onDisableEndDateEdit = (index) => {
      setDisableEndDataEdit(!disableEndDateEdit)

      if (disableEndDate){
        setExperience([{
          "id": "",
          "companyName": experienceList[index].companyName,
          "jobTitle": experienceList[index].jobTitle,
          "jobStartDate": experienceList[index].jobStartDate,
          "jobDescription": experienceList[index].jobDescription
        }])
      }
    }

    const onEditExperience = (index) => {
      setIsEdit(index)
    }

    const onChangeEditExperience = (e, index) => {
      const {name, value} = e.target
      console.log(name, value);
      setExperienceList((prevExperience) => {
        const updatedExperienceList = [...prevExperience];
        updatedExperienceList[index][name]= value
        return updatedExperienceList
      })
    }

    const onOpenDeleteConfirmation = () => {
      setOpenDeleteConfirmation(true)
      document.body.classList.add("disable-scroll");
    }

    const onCloseDeleteConfirmation = () => {
      setOpenDeleteConfirmation(false)
      document.body.classList.remove("disable-scroll");
    }

  const onDeleteExperience = async (index) => {
    const allExperience = [...experienceList]
    const id = allExperience[index]["id"]
    try{
      const response = await fetch(`/api/user/delete_experience/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userAuthToken}`
        },
      })
  
      const data = await response.json()
      if (response.status === 200) {
        allExperience.splice(index, 1)
        setExperienceList(allExperience)
        setOpenDeleteConfirmation(false)
        document.body.classList.remove("disable-scroll");
        setAlertResponse({"success": data.success})
      } else {
        setAlertResponse({"error": data.error})
      }
    } catch (errors) {
      setAlertResponse({"error": errors})
    }
  }
  
  const onSaveEditExperience = async (index) => {
    const id = experienceList[index].id
    try{
      const response = await fetch(`/api/user/save_experience/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userAuthToken}`
        },
        body: JSON.stringify(experienceList[index])
      })
  
      const data = await response.json()
      if (response.status === 200){
        setIsEdit(false)
        setAlertResponse({"success": data.success})
      } else {
        setAlertResponse({"error": data.error})
      }
    }catch (errors){
      setAlertResponse({"error": errors})
    }
  }
  
  const onClickCloseForm = (index) => {
    setIsAdded(false)
    document.body.classList.remove("disable-scroll")
  }

  const onClickCloseEditForm = () => {
    return setIsEdit(false)
  }

  const onLoadTotalExp = () => {
    const year = (totalExp / 365.25).toString();
    const year_dec = year.split(".")[0];
    const month = Math.round((year - year_dec) * 12);
    return <span>{year_dec} year {month === 0 ? null : `${month} ${month === 1 ? 'month' : 'months'}`}</span>;
  };


  return (
    <div>
      <p className='text-[32px] font-bold'>Experience</p>
      <br />
      <p>Total Experience:  {totalExp < 365 && totalExp > 0 ? <span>&nbsp;&nbsp;&lt; 1 year</span> : (totalExp === 0 ? `${totalExp} year` : <span>{onLoadTotalExp()}</span>)}  </p>
      <br />
      {/* LIST OF EXPERIENCE */}
      <div className='w-full px-1 flex flex-col gap-2'>
        {experienceList.map((experience, index) => (        
            <div key={index} >
            {isEdit === index ?
              <div className='experience-edit-form'>
                <CloseIcon className='addExperience-close-button' onClick={() => onClickCloseEditForm(index)} />
                <input 
                  value={experienceList[index].companyName}
                  name="companyName"
                  onChange={(e) => onChangeEditExperience(e, index)}
                  className='input-field' 
                  placeholder='Company' />
                <input 
                  value={experienceList[index].jobTitle}
                  name="jobTitle"
                  onChange={(e) => onChangeEditExperience(e, index)}
                  className='input-field' 
                  placeholder='Job Title' />
                <div className='experience-date'>
                  <input
                    value={experienceList[index].jobStartDate}
                    onChange={(e) => onChangeEditExperience(e, index)}
                    type="date" 
                    id="since-date" 
                    name="jobStartDate" 
                    className='input-field-experience-startend-date' />
                  {(disableEndDateEdit && experienceList[index].jobEndDate !== null) &&
                    <input
                      value={!disableEndDateEdit ? "9999-12-31" : experienceList[index].jobEndDate}
                      onChange={(e) => onChangeEditExperience(e, index)}
                      type="date"
                      id="end-date"
                      name="jobEndDate"
                      className='input-field-experience-startend-date' />
                  }
                  <div className='checkbox-input'>
                    <input type="checkbox" name="task1" onClick={() => onDisableEndDateEdit(index)}></input><label>Still Working</label>
                  </div>
                </div>
                <textarea
                  value={experienceList[index].jobDescription}
                  name="jobDescription"
                  onChange={(e) => onChangeEditExperience(e, index)}
                  className='experience-textArea' 
                  rows="10" 
                  placeholder='Job Description' />
                <Button buttonType="input" label="Save" clickedButton={() => onSaveEditExperience(index)} />
              </div>
            :
            <Accordion sx={{color: "#4e6e81", width: "100%"}} >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{height: "80px", backgroundColor: "rgba(216, 230, 239, 1)", boxShadow: "0 2px 5px 0px rgba(78, 110, 110, 0.3)"}}
                >
                  <Typography>
                  <div className='flex xl:w-[1300px] lg:w-[650px] max-md:w-[320px] justify-between items-center'>
                    <div className='jobTitle'>
                      <p>{experience.jobTitle}</p>
                    </div>
                    <div className='flex gap-2'>
                      <p><i>{experience.jobStartDate}</i></p>
                      <p>-</p>
                      <p><i>{experience.jobEndDate ? experience.jobEndDate : "present"}</i></p>
                    </div>                 
                  </div>
                </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{boxShadow: "0 2px 5px 0px rgba(78, 110, 110, 0.3)"}}>
                  <p><b><u>{experience.companyName}</u></b></p>
                  <p>
                    {experience.jobDescription.split('\n').map((line, i) => (
                      <Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </p>
                  {loginUserId === props.clickedUserId &&
                  <div className='edit-delete-exp-button'>
                    <Button buttonType="button" label="Edit" clickedButton={() => onEditExperience(index)} />
                    <Button buttonType="button" label="Delete" clickedButton={() => onOpenDeleteConfirmation()} customStyle={{backgroundColor: "red", color: "white", border: "1px solid red"}} />
                  </div>
                  }
                </AccordionDetails>
              </Accordion>
            }  
            {openDeleteConfirmation && 
              <DeleteConfirmation deleteLabel="Do you want to delete this experience." onClickYes={() => onDeleteExperience(index)} onClickNo={onCloseDeleteConfirmation} />
            }
            </div>
          ))
        }
      </div>
      
      {/* FORM ADD EXPERIENCE */}
      {isAdded &&
        <div className='fixed z-6 bg-pop-up-bg w-screen h-screen top-0 left-0 flex justify-center items-center'>
          <AddExperience experience={experience} close={onClickCloseForm} setExperienceList={setExperienceList} setAlertResponse={setAlertResponse}/>
        </div>
      }
      <br />
      {loginUserId === props.clickedUserId && 
        <>
          <Button buttonType="button" label="Add Experience" clickedButton={() => onAddMoreExperienceSection()} />
        </>
       }
      <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default Experience