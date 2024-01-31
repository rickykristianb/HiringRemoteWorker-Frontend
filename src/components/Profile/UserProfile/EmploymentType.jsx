import { type } from '@testing-library/user-event/dist/type';
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import Button from '../../Button';
import CloseIcon from '@mui/icons-material/Close';
import DeleteConfirmation from 'components/DeleteConfirmation';
import AuthContext from '../../../Context/AuthContext';
import { useContext } from 'react';
import AlertNotification from '../../AlertNotification';


const EmploymentType = (props) => {

    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    }

    const [loginUserId, setLoginUserId] = useState()

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])


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
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
    const [tempDeleteDataIndex, setTempDeleteDataIndex] = useState()
    const [deleteLabel, setDeleteLabel] = useState("")

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
        try{
            if (selectedType.value === "Select Type") {
                setAlertField({"message": "Type is required"})
            } else{
                const response = await fetch("/api/user/add_user_emp_type/", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `JWT ${userAuthToken}`
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
        } catch (error){
            console.error(error);
        }
    }

    const onRemoveType = async() => {
        try{
            const id = employmentTypeListSelected[tempDeleteDataIndex]["id"]
            const response = await fetch(`/api/user/remove_emptype/${id}/`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userAuthToken}`
                }
            })
            const data = await response.json()
            if (response.status === 200){
                setEmploymentTypeListSelected(() => {
                    const typeList = [...employmentTypeListSelected]
                    typeList.splice(tempDeleteDataIndex, 1)
                    return typeList
                })
                setOpenDeleteConfirmation(false)
                setAlertResponse({"success": data.success})
            } else {
                setAlertResponse({"error": data.error})
            }
        } catch (error){
            console.error(error);
        } finally {
            setOpenDeleteConfirmation(false)
            document.body.classList.remove("disable-scroll")
        }
    }

    const onOpenDeleteConfirmation = (index) => {
        setTempDeleteDataIndex(index)
        setDeleteLabel(`Do you want to delete ${employmentTypeListSelected[index].type}?`)
        setOpenDeleteConfirmation(true)
        document.body.classList.add("disable-scroll")
    }

    const onCloseDeleteConfirmation = () => {
        setOpenDeleteConfirmation(false)
        document.body.classList.remove("disable-scroll")
    }


  return (
    <div>
        <p className='text-[32px] font-bold'>Employment Type</p>
        <br />
        <div className='emp-type-list px-1'>
            {employmentTypeListSelected.map((item, index) => {
                return (
                    <>
                        <div key={index} className='emp-type-container'>
                            <div className='skill-item'><b>{item.type}</b></div>
                            {loginUserId === props.clickedUserId && 
                                <CloseIcon onClick={() => onOpenDeleteConfirmation(index)} sx={{width: "20px"}} className='emp-type-list-close-button'/> 
                            }
                            {openDeleteConfirmation && 
                                <DeleteConfirmation deleteLabel={deleteLabel} onClickYes={() => onRemoveType()} onClickNo={() => onCloseDeleteConfirmation()} />
                            }
                        </div>
                    </>
                )
            })}
        </div>
        <br />
        {!isAdded && employmentType.map((type, index) => {
            return (
                <div key={index} className='flex gap-2 mb-2 items-center'>
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
        {loginUserId === props.clickedUserId && 
            <>
                <Button buttonType="button" label="Add Employment Type" clickedButton={onAddMoreEmploymentTypeSection} />
            </>
         }
        <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default EmploymentType