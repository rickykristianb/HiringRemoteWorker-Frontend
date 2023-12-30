import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select";
import PlaceIcon from '@mui/icons-material/Place';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import AuthContext from '../../../Context/AuthContext';
import AlertNotification from '../../AlertNotification';
import CloseIcon from '@mui/icons-material/Close';

const Location = (props) => {

    const [loginUserId, setLoginUserId] = useState()

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    let  userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    } 

    const [loadedLocation, setLoadedLocation] = useState([])
    const [newLocation, setNewLocation] = useState([])
    const [newChangeLocation, setNewChangeLocation] = useState([])
    const [isAdd, setIsAdd] = useState(false)
    const [alertField, setAlertField] = useState()
    const [alertResponse, setAlertResponse] = useState()

    const onLoadLocation = async() => {
        // get location list as an select option
        const response = await fetch("/api/user/get_location/", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })
        const data = await response.json()
        setLoadedLocation(data)
    }

    const onAddNewLocation = () => {
        setIsAdd(true)
        setNewLocation([{
            location: ""
        }])
    }

    const onChangeSelectLocation = async(option) => {
        const response = await fetch("/api/user/save_location/", {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userAuthToken}`
            },
            body: JSON.stringify(option["id"])
        })

        const data = await response.json()
        if (response.ok){
            setNewChangeLocation(option["value"])
            setIsAdd(false)
            setAlertResponse({"success": data.success})
        } else {
            setAlertResponse({"error": data.error})
        }
    }

    useEffect(() => {
        setNewChangeLocation(props.userData)
        onLoadLocation()
    }, [props.userData])

    const onClickCloseAddEditLocation = () => {
        setIsAdd(false)
    }

  return (
    <div className='profile-location-container'>
        {!isAdd &&
            <div className='profile-location'>
                <PlaceIcon />
                <span className='location'>{newChangeLocation ? newChangeLocation : <span>Add Location</span>}</span>

                {loginUserId === props.clickedUserId &&
                    <Tooltip onClick={() => onAddNewLocation()} className='tooltip'  TransitionComponent={Zoom} placement="right" title="Edit" sx={{cursor: "pointer"}} arrow>
                        <EditIcon />
                    </Tooltip>
                }
            </div>
        }
        
        {isAdd && 
            newLocation.map((item, index) => (
                <div key={index} className='location-selection'>
                    <PlaceIcon />
                    <Select
                        options={loadedLocation.map((item) => ({id:item.id, value: item.location, label: item.location}))}
                        className='skill-selection'
                        value={{value: newChangeLocation, label: newChangeLocation}}
                        onChange={(options) => onChangeSelectLocation(options)}
                    />
                    <CloseIcon onClick={() => onClickCloseAddEditLocation()} />
                </div>
            ))
        }
        <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default Location