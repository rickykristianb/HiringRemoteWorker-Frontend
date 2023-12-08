import React, { useState, useContext, useEffect } from 'react'
import Divider from '@mui/material/Divider';
import Button from './Button';
import CloseIcon from '@mui/icons-material/Close';
import AuthContext from '../Context/AuthContext';
import AlertNotification from './AlertNotification';
import Select from "react-select";

const Language = (props) => {

    const [language, setLanguage] = useState([])
    const [languageList, setLanguageList] = useState([])
    const [isSaved, setIsSaved] = useState(null)
    const [alertAdd, setAlertAdd] = useState(null)
    const [alert, setAlert] = useState(null)
    const [alertResponse, setAlertResponse] = useState(null)

    let { authToken } = useContext(AuthContext)
    const userToken = authToken.access

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
        setAlertAdd({
          "field": "language-proficiency",
          "message": "Language and proficiency is required"
        })
      } else if (language[index].language === "") {
        setAlertAdd({
          "field": "language",
          "message": "Language is required"
        })
      } else if (language[index].proficiency === ""){
        setAlertAdd({
          "field": "proficiency",
          "message": "Proficiency is required"
        })
      }if (language[index].language !== "" && language[index].proficiency !== ""){
        try{
          const response = await fetch("/api/user/add_language/", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "Authorization": `JWT ${userToken}`
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
            setAlertAdd(null)
          } else {
            setAlertResponse({"error": data.error})
          }
        } catch(errors){
          console.error(errors)
        }
      }
    }

    const onRemoveLanguage = async (index) => {
      const id = languageList[index].id

      try{
        const response = await fetch(`/api/user/remove_language/${id}`, {
          method:"DELETE",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userToken}`
          }
        })
        let data = await response.json()
        if (response.status === 200){
          setLanguageList((prevLanguages) => {
            const languages = [...prevLanguages]
            languages.splice(index, 1)
            return languages
          })
          setAlertResponse({"success": data.success})
        } else {
          setAlertResponse({"error": data.error})
        } 
      } catch (errors){
        setAlertResponse({"error": errors})
      }
    }


  return (
    <div className='profile_language'>
    <h1>Language</h1>
        <Divider />

        <div className='language-list'>
        {languageList.map((languageItem, index) => {
          return ( 
              <div key={index} className='language-container'>
                <div className='language-item'><b>{languageItem.language}</b></div>
                  <Divider />
                <div className='language-proficiency-item'>{languageItem.proficiency}</div>
                <CloseIcon onClick={() => onRemoveLanguage(index)} className='language-list-close-button'/>
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
              <CloseIcon onClick={() => {return setIsSaved(true), setAlertAdd(null)}} />
            </div>
          ))
        }
        {alertAdd && <p className='error-field'>{alertAdd.message}</p>}
        <Button buttonType="button" label="Add Language" clickedButton={onAddMoreLanguageSection} />
        <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default Language