import React, { useState, useContext, useEffect } from 'react'
import Divider from '@mui/material/Divider';
import Button from '../../Button';
import CloseIcon from '@mui/icons-material/Close';
import AuthContext from '../../../Context/AuthContext';
import AlertNotification from '../../AlertNotification';
import DeleteConfirmation from 'components/DeleteConfirmation';

const Language = (props) => {

    const [language, setLanguage] = useState([])
    const [languageList, setLanguageList] = useState([])
    const [isSaved, setIsSaved] = useState(null)
    const [alertField, setAlertField] = useState(null)
    const [alert, setAlert] = useState(null)
    const [alertResponse, setAlertResponse] = useState(null)
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
    const [loginUserId, setLoginUserId] = useState()
    const [tempDeleteDataIndex, setTempDeleteDataIndex] = useState()
    const [deleteLabel, setDeleteLabel] = useState("")

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    }


    const languageProficiency = [
      "Beginner", "Elementary", "Intermediate", "Advanced", "Fluent", "Native"
    ]

    const languages = [
      "English", "Bahasa Indonesia", "France", "Spanish", "Mandarin", "Japanese"
    ]

    const onLoadLanguage = () => {
      const languages = props.userData

      setLanguageList(languages.map((item, index) => {
        return {
          id: item.id,
          language: item.language,
          proficiency: item.proficiency
        }
      }))
    }

    useEffect(()=> {
      onLoadLanguage()
    }, [props.userData])

    const onChangeLanguage = (e, index) => {
      const { name, value } = e.target
      setLanguage((prevLanguage) => {
        const lang = [...prevLanguage]
        lang[index][name] = value
        return lang
      })
    }

    const onAddMoreLanguageSection = () => {
      setIsSaved(false)
      setLanguage([{
        id: "",
        language: "",
        proficiency: ""
      }])
    }

    const onAddLanguage = async (e, index) => {
      if (language[index].language === "" && language[index].proficiency === ""){
        setAlertField({
          "field": "language-proficiency",
          "message": "Language and proficiency is required"
        })
      } else if (language[index].language === "") {
        setAlertField({
          "field": "language",
          "message": "Language is required"
        })
      } else if (language[index].proficiency === ""){
        setAlertField({
          "field": "proficiency",
          "message": "Proficiency is required"
        })
      }if (language[index].language !== "" && language[index].proficiency !== ""){
        try{
          const response = await fetch("/api/user/add_language/", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "Authorization": `JWT ${userAuthToken}`
            },
            body: JSON.stringify(language[index])
          })
          let data = await response.json()
          if (response.status === 200){
            const newLanguage = {
              ...language[index],
              id: data.id
            }
            setLanguageList((prevLanguage) => [
              ...prevLanguage,
              newLanguage
            ])
            setAlertResponse({"success": data.success})
            setIsSaved(true)
            setAlertField(null)
          } else {
            setAlertField({"message": data.error})
          }
        } catch(errors){
          console.error(errors)
        }
      }
    }

    const onRemoveLanguage = async () => {
      const id = languageList[tempDeleteDataIndex].id

      try{
        const response = await fetch(`/api/user/remove_language/${id}`, {
          method:"DELETE",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userAuthToken}`
          }
        })
        let data = await response.json()
        if (response.status === 200){
          setLanguageList((prevLanguages) => {
            const languages = [...prevLanguages]
            languages.splice(tempDeleteDataIndex, 1)
            return languages
          })
          setAlertResponse({"success": data.success})
        } else {
          setAlertResponse({"error": data.error})
        } 
      } catch (errors){
        setAlertResponse({"error": errors})
      } finally {
        setOpenDeleteConfirmation(false)
        document.body.classList.remove("disable-scroll")
      }
    }

  const onOpenDeleteConfirmation = (index) => {
    setTempDeleteDataIndex(index)
    setDeleteLabel(`Do you want to delete ${languageList[index].language}?`)
    setOpenDeleteConfirmation(true)
    document.body.classList.add("disable-scroll")
  }

  const onCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false)
    document.body.classList.remove("disable-scroll")
  }


  return (
    <div>
      <p className='text-[32px] font-bold'>Language</p>
      <br />
        <div className='language-list'>
        {languageList.map((languageItem, index) => {
          return ( 
            <div key={index} className='language-container'>
              <div className='language-item'><b>{languageItem.language}</b></div>
                <Divider />
              <div className='language-proficiency-item'>{languageItem.proficiency}</div>
              {loginUserId === props.clickedUserId && <CloseIcon onClick={() => onOpenDeleteConfirmation(index)} className='language-list-close-button'/> }
            </div>
          )
          })}
        </div>

        {!isSaved && language.length > 0 &&
          language.map((languageItem, index) => (
            <div key={index} className='add-language'>
              <select name="language" onChange={(e) => onChangeLanguage(e, index)} value={languageItem.language} className='language-selection'>
                <option value="" disabled selected>Select Language</option>
                {languages.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
              <select name="proficiency" onChange={(e) => onChangeLanguage(e, index)} value={languageItem.proficiency} className='language-proficiency-selection'>
                <option value="" disabled selected>Select Proficiency</option>
                {languageProficiency.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
              <Button buttonType="button" label="Add" customClassName="language-save-button" clickedButton={(e) => onAddLanguage(e, index)} />
              <CloseIcon onClick={() => {return setIsSaved(true), setAlertField(null)}} />
            </div>
          ))
        }
        {alertField && <p className='error-field'>{alertField.message}</p>}
        <br />
        { loginUserId === props.clickedUserId && <Button buttonType="button" label="Add Language" clickedButton={onAddMoreLanguageSection} /> }
        {openDeleteConfirmation && 
          <DeleteConfirmation deleteLabel={deleteLabel} onClickYes={() => onRemoveLanguage()} onClickNo={() => onCloseDeleteConfirmation()} />
        }
        <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default Language