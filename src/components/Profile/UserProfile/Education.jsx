import React, { useState, useContext, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import Button from '../../Button';
import Divider from '@mui/material/Divider';
import AuthContext from '../../../Context/AuthContext';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import AlertNotification from '../../AlertNotification';
import DeleteConfirmation from 'components/DeleteConfirmation';

const Education = (props) => {
    const [ education, setEducation ] = useState([])
    const [ educationList, setEducationList ] =useState([])
    const [ isHovered, setIshovered ] = useState(null)
    const [ isSaved, setIsSaved ] = useState(null)
    const [ isEdit, setIsEdit ] = useState(false)
    const [ alert, setAlert ] = useState()
    const [ alertResponse, setAlertResponse ] = useState()
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
    const [deleteLabel, setDeleteLabel] = useState("")
    const [tempDeleteDataIndex, setTempDeleteDataIndex] = useState()

    const [loginUserId, setLoginUserId] = useState()

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    }

  const loadEducation = () => {
    const dataList = props.userData.map((item) => {
      return {
        id: item.id,
        major: item.major,
        schoolName: item.school_name,
        degree: item.degree
      }})
      setEducationList(dataList)
  }

  useEffect(() => {
    loadEducation()
  }, [props.userData])


  const onAddMoreEducationSection = () => {
    setEducation([{
        id: "",
        major: "",
        schoolName: "",
        degree: ""
    }])
    setIsSaved(false)
  };

  const onChangeEducation = (e, index) => {
    const {name, value} = e.target;
    
    setEducation((prevEducation) => {
      const updateEducation = [...prevEducation];
      updateEducation[index][name] = value;
      return updateEducation;
    });
  }

  const onAddEducation = async (index) => {
    if (education[index].schoolName === "" && education[index].major === ""){
      setAlert({
        "message": "School name and Major are required"
      })
    } else if (education[index].schoolName === "") {
      setAlert({
        "message": "School name is required",
      })
    } else if (education[index].major === ""){
      setAlert({
        "message": "Major is required"
      })
    } else {
      try{
        const response = await fetch("/api/user/add_education/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `JWT ${userAuthToken}`
          },
          body: JSON.stringify(education[index])
        })
        
        let data = await response.json()
        if (response.ok){
  
          const newEducation = {
            ...education[index],
            id: data.id
          }
          setEducationList((prevEducation) => [...prevEducation, newEducation])
          setIsSaved(true)
          setAlert(null)
          setAlertResponse({"success": data.success})
        } else {
          setAlertResponse({"error": data.error})
        }
      } catch (errors){
        console.log({"error": String(errors)});
        setAlertResponse({"error": errors})
      }
    }   
  }

  const onRemoveEducation = async () => {
    const educationId = educationList[tempDeleteDataIndex].id
    try{
      const response = await fetch(`/api/user/delete_education/${educationId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `JWT ${userAuthToken}`
        }
      })
      const data = await response.json()
      if (response.status === 200){
        const educations = [...educationList];
        educations.splice(tempDeleteDataIndex, 1)
        setEducationList(educations)
        setAlertResponse({"success": data.success})
      } else {
        setAlertResponse({"error": data.error})
      }
    } catch (errors){
      console.log(String(errors));
      setAlertResponse({"error": errors})
    } finally{
      setOpenDeleteConfirmation(false)
      document.body.classList.remove("disable-scroll")
    }
  };

  const onClickCancel = (index) => {
    // FIX THIS!! .............................................................................................
    setIsEdit(null)
  }

  const onClickCancelAdd = () => {
    setIsSaved(true)
    setAlert(null)
  }

  const onClickedEdit = (index) => {
    setIsEdit(index)
  }

  const onChangeEditEducation = (e, index) => {
    const {name, value} = e.target;

    console.log(name, value);

    setEducationList((prevEducationList) => {
      const updatedEducationList = [...prevEducationList];
      updatedEducationList[index][name] = value;
      return updatedEducationList;
    });   
  }
  
  const onSaveEdit =async(index) => {
    const educationId = educationList[index].id
    try{
      const response = await fetch(`/api/user/edit_education/${educationId}/`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userAuthToken}`
        },
        body: JSON.stringify({
          id: educationList[index].id,
          major: educationList[index].major,
          school_name: educationList[index].schoolName,
          degree: educationList[index].degree
        })
      })
      const data = await response.json()
      if (response.status === 200){
        setIsEdit(false)
        setAlertResponse({"success": data.success})
      } else {
        setAlertResponse({"error": data.error})
      }
    } catch (errors){
      console.error(errors)
      setAlertResponse({"error": errors})
    }
  }

  const onMouseHover = (index) => {
    setIshovered(index)
  }

  const onMouseLeaveHover = () => {
    setIshovered(null)
  }
  
  const onOpenDeleteConfirmation = (index) => {
    setTempDeleteDataIndex(index)
    setDeleteLabel(`Do you want to delete ${educationList[index].schoolName}?`)
    setOpenDeleteConfirmation(true)
    document.body.classList.add("disable-scroll")
  }

  const onCloseDeleteConfirmation = () => {
      setOpenDeleteConfirmation(false)
      document.body.classList.remove("disable-scroll")
  }


  return (
    <div>
        <p className='text-[32px] font-bold'>Education</p>
        <br />
        {/* DISPLAY ALL EDUCATION. ADD FORM TO EDIT THE EDUCATION */}
        {educationList.map((item, index) => {
              return (
                <div key={index} className='education-list px-1' onMouseEnter={() => onMouseHover(index)} onMouseLeave={onMouseLeaveHover}>
                {isEdit === index ? (
                  <div className='add-education max-sm:w-full'>
                    <div>
                      <CloseIcon onClick={() => onClickCancel(index)} className='addEducation-close-button' />
                    </div>
                    <input
                      onChange={(e) => onChangeEditEducation(e, index)}
                      name="major"
                      value={educationList[index].major}
                      className='input-field'
                      placeholder='Major'
                    ></input>
                    <input
                      onChange={(e) => onChangeEditEducation(e, index)}
                      name="schoolName"
                      value={educationList[index].schoolName}
                      className='input-field'
                      placeholder='School Name'
                    ></input>
                    <input
                      onChange={(e) => onChangeEditEducation(e, index)}
                      name="degree"
                      value={educationList[index].degree}
                      className='input-field'
                      placeholder='Degree'
                    ></input>
                    <Button buttonType="button" label="Save" clickedButton={() => onSaveEdit(index)} />
                  </div>
                ) : (
                  <div className='education-edit-button'>
                    <RadioButtonCheckedIcon className='education-list-icon' sx={{width: "30px", height: "30px"}} />
                    <div className='education-item'>
                      <li><p className='text-xl font-bold'>{item.schoolName}</p></li>
                      <li>{item.major}</li>
                      <li>{item.degree}</li>
                    </div>
                    {loginUserId === props.clickedUserId && isHovered === index && (
                      <div className='profile-edit-delete-button'>
                        <Button buttonType="button" label="Edit" clickedButton={() => onClickedEdit(index)} />
                        <Button buttonType="button" label="Delete" clickedButton={() => onOpenDeleteConfirmation(index)} customStyle={{backgroundColor: "red", color: "white", border: "1px solid red"}}  />
                      </div>
                    )}
                  </div>
                )}
                </div> 
              )
            })}     

        {/* ADD NEW EDUCATION (NEW FORM) */}
        {!isSaved && (education.length > 0) && 
        education.map((educationItem, index) => (
            <div key={index} className='education-container px-1'>
                <div className='add-education max-sm:w-full'>
                    <div>
                        <CloseIcon onClick={() => onClickCancelAdd()} className='addEducation-close-button' />
                    </div>
                    <input onChange={(e) => onChangeEducation(e, index)} name="major" value={educationItem.major} className='input-field' placeholder='Major'></input>
                    <input onChange={(e) => onChangeEducation(e, index)} name="schoolName" value={educationItem.schoolName} className='input-field' placeholder='School Name'></input>
                    <input onChange={(e) => onChangeEducation(e, index)} name="degree" value={educationItem.degree} className='input-field' placeholder='Degree'></input>
                    {alert && <p className='error-field'>{alert.message}</p>}
                    <Button buttonType="button" label="Add" clickedButton={() => onAddEducation(index)} />
                </div>
            </div>
        ))
        }    
        <br /> 
        {loginUserId === props.clickedUserId && 
          <>
            <Button buttonType="button" label="Add Education" clickedButton={onAddMoreEducationSection} />
          </>
         }
         {openDeleteConfirmation && 
          <DeleteConfirmation deleteLabel={deleteLabel} onClickYes={() => onRemoveEducation()} onClickNo={() => onCloseDeleteConfirmation()} />
        }
        <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default Education