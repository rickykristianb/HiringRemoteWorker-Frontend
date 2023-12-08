import { type } from '@testing-library/user-event/dist/type';
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import Button from './Button';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import AuthContext from '../Context/AuthContext';
import { useContext } from 'react';
import AlertNotification from './AlertNotification';


const EmploymentType = (props) => {

    const {authToken} = useContext(AuthContext)
    const userToken = authToken.access


    const [employmentTypeList, setEmploymentTypeList] = useState([])
    const [employmentTypeListSelected, setEmploymentTypeListSelected] = useState([])
    const [selectedType, setSelectedType] = useState({
        id: "",
        value: "Select Type"
    })
    const [employmentType, setEmploymentType] = useState([])
    const [alertField, setAlertField] = useState()
    const [alertResponse, setAlertResponse] = useState()
    const [isAdded, setIsAdded] = useState(false)

    const onLoadEmpType = () => {
        const types = props.userData
        const dataList = types.map((item, index) => {
            return {
                id : item.employment_type.id,
                type: item.employment_type.type
            }
        })
        setEmploymentTypeListSelected(dataList)
    }

    useEffect(() => {
        onLoadEmpType()
    }, [props.userData])

    const onLoadListEmploymentType = async() => {
        const response = await fetch("/api/user/get_emp_type/", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })

        const data = await response.json()
        if (response.status === 200){

            const dataList = data.map((item) => {
                return {
                    id : item.id,
                    type: item.type
                }
            })
            setEmploymentTypeList(dataList)
        }
    }

    useEffect(() => {
        onLoadListEmploymentType()
    }, [])

    const onChangeSelectType = (option) => {
        setSelectedType({
            id: option.id,
            value: option.value
        })
    }

    const onAddMoreEmploymentTypeSection = () => {
        setEmploymentType([{
            id: "",
            type: ""
        }])
        setIsAdded(false)    
    }

    const onCloseAdd = () => {
        setIsAdded(true)
        setAlertField()
    }

    const onAddEmploymentType = async (index) => {
        if (selectedType.value === "Select Type") {
            setAlertField({"message": "Type is required"})
        } else{
            const response = await fetch("/api/user/add_user_emp_type/", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userToken}`
                },
                body: JSON.stringify(selectedType)
            })
    
            const data = await response.json()

            if (response.status === 201){
                const newType = {
                    id: selectedType.id,
                    type: selectedType.value
                }
                setEmploymentTypeListSelected((prevValue) => ([...prevValue, newType]))
                setIsAdded(true)
                setAlertField(null)
                setAlertResponse({"success": data.success})
            } else {
                setAlertField({"message": data.error})
            }
        }
    }

    const onRemoveType = async(index) => {
        const id = employmentTypeListSelected[index]["id"]
        
        const response = await fetch(`/api/user/remove_emptype/${id}/`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        })
        const data = await response.json()
        if (response.status === 200){
            setEmploymentTypeListSelected(() => {
                const typeList = [...employmentTypeListSelected]
                typeList.splice(index, 1)
                return typeList
            })
            
            setAlertResponse({"success": data.success})
        } else {
            setAlertResponse({"error": data.error})
        }
    }

  return (
    <div className='profile-employment-type'>
        <h1>Employment Type</h1>
            <Divider />
        <div className='emp-type-list'>
            {employmentTypeListSelected.map((item, index) => {
                return (
                    <div key={index} className='emp-type-container'>
                        <div className='skill-item'><b>{item.type}</b></div>
                        <CloseIcon onClick={() => onRemoveType(index)} sx={{width: "20px"}} className='emp-type-list-close-button'/>
                    </div>
                )
            })}
        </div>
        
        {!isAdded && employmentType.map((type, index) => {
            return (
                <div key={index} className='add-emp-type-section'>
                    <Select
                        options={employmentTypeList.map((item) => ({id: item.id, value: item.type, label: item.type}))}
                        className='skill-selection'
                        onChange={onChangeSelectType}
                        value={{id: selectedType.id, value: selectedType.value, label: selectedType.value}}
                    />
                    <Button buttonType="button" label="Add" clickedButton={() => onAddEmploymentType(index)} />
                    <CloseIcon onClick={onCloseAdd} />
                </div>
            )
        })}
        {alertField && <p className='error-field'>{alertField.message}</p>}  
        <br />   
        <Button buttonType="button" label="Add Employment Type" clickedButton={onAddMoreEmploymentTypeSection} />
        <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default EmploymentType