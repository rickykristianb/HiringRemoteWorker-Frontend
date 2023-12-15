import React, { useContext, useEffect, useState } from 'react'
import { Divider } from '@mui/material'
import Button from '../Button';
import Select from "react-select";
import CloseIcon from '@mui/icons-material/Close';
import AuthContext from '../../Context/AuthContext';
import AlertNotification from '../AlertNotification';

const Rate = (props) => {

    const [loginUserId, setLoginUserId] = useState()

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    }

    const period = ["Year", "Month", "Hour"]
    const [savedRate, setSavedRate] = useState([])
    const [amount, setAmount] = useState(null)
    const [periodSelected, setPeriodSelected] = useState("")
    const [alertField, setAlertField] = useState()
    const [alertResponse, setAlertResponse] = useState()
    const [isShow, setIsShow] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const onAmountChange = (e) => {
        setAmount(e.target.value)
    }
    const onChangePeriod = (option) => {
        setPeriodSelected(option.value)
    }

    const onLoadExpectedRate = () => {
        console.log("DATA", props.userData);
        if (props.userData !== null ){
            setSavedRate([{
                "amount": parseFloat(props.userData["nominal"]),
                "period": props.userData["paid_period"]
            }])
            setAmount(props.userData["nominal"])
            setPeriodSelected(props.userData["paid_period"])
        } else {
            setSavedRate(null)
        }      
    }

    useEffect(() => {
        onLoadExpectedRate()
    }, [props.userData])

    const onAddRate = async() => {
        if (periodSelected === "" && amount === null){
            setAlertField({
                "message": "Amount and period are required"
            })
        } else if (periodSelected === "") {
            setAlertField({
                "message": "Period is required"
            })
        } else if (amount === null) {
            setAlertField({
                "message": "Amount is required"
            })
        } else {
            const response = await fetch("/api/user/add_rate/", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userAuthToken}`
                },
                body: JSON.stringify({
                    "amount": amount,
                    "period": periodSelected
                })
            })
            const data = await response.json()
            if (response.status === 201){
                setAlertResponse({
                    "success": data.success
                })
                setSavedRate([{
                    "amount": parseFloat(amount),
                    "period": periodSelected
                }])
                setAlertField(null)
                setIsShow(!isShow)
            } else {
                setAlertResponse({
                    "error": data.error
                })
            }
        }
    }

    const onChangeEditPeriod = (option) => {
        setPeriodSelected(option.value)
    }

    const onAmountEditChange = (e) => {
        setAmount(e.target.value)
    }

    const onSaveRate = async () => {
        if(amount === ""){
            setAlertField({"message": "Amount is required"})
        } else {
            const response = await fetch("/api/user/save_rate/", {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userAuthToken}`
                },
                body: JSON.stringify({
                    "amount": amount,
                    "period": periodSelected
                })
            })
            const data = await response.json()
            if (response.status === 200){
                setSavedRate([{
                    "amount": parseFloat(amount),
                    "period": periodSelected
                }])
                setAlertResponse({"success": data.success})
                setIsEdit(false)
    
            } else {
                setAlertResponse({"error": data.error})
            }
        }
        
    }

    const onClickedEditRate = () => {
        setIsEdit(true)
    }
    
    const onClickAddRate = () => {
        setIsShow(true)
    }

    const onClickCloseAddRate = () => {
        setIsShow(!isShow)
        setAlertField(null)
    }

    const onClickCloseEditRate = () => {
        setIsEdit(false)
        setAlertField(null)
    }

  return (
    <div className='expected-rate-container'>
        <br />
        <h1>Rate</h1>
        {/* <Divider /> */}
        <br />
        <br />
        { savedRate !== null &&
            savedRate.map((item, index) => {
            return (
                <>
                {!isEdit ?
                <div key={index} className='expected-rate'>
                    <div className='amount-expected-rate'>
                        <p><b>$</b></p>
                        <p><b>{item.amount}</b></p>
                        <p style={{marginLeft: "10px", marginRight: "5px"}}>/</p>
                        <p><b>{item.period}</b></p>
                    </div>
                    <br />
                    {loginUserId === props.clickedUserId && 
                        <>
                            <Button clickedButton={onClickedEditRate} buttonType="button" label="Edit" />
                        </>
                     }
                </div> 
                :
                <div key={index} className='expected-rate-form' >
                    <div className='currency-expected-rate-form'>
                        <p><b>$</b></p>
                    </div>
                    <input onChange={(e) => onAmountEditChange(e)} name="amount-input" value={amount} type="number" step="0.01" className='rate-input-field' placeholder='120'></input>
                    <Select
                        options={period.map((item) => ({value: item, label: item}))}
                        onChange={onChangeEditPeriod}
                        name='period-selection'
                        value={{value: periodSelected, label:periodSelected}}
                    />
                    <Button buttonType="button" label="Save" clickedButton={onSaveRate} />
                    <CloseIcon onClick={onClickCloseEditRate} />
                </div>
                 }     
                </>
      
            )
        })
        }
               
        {isShow && 
            <div className='expected-rate-form' >
                <div className='currency-expected-rate-form'>
                    <p><b>$</b></p>
                </div>
                <input onChange={onAmountChange} name="amount-input" type="number" step="0.01" className='rate-input-field' placeholder='120'></input>
                <Select
                    options={period.map((item) => ({value: item, label: item}))}
                    onChange={onChangePeriod}
                />
                <Button buttonType="button" label="Save" clickedButton={onAddRate} />
                <CloseIcon onClick={onClickCloseAddRate} />
            </div>
        }
        {alertField && <p className='error-field'>{alertField.message}</p>}
        <AlertNotification alertData={alertResponse}/>
        {loginUserId === props.clickedUserId && savedRate === null && 
            <>
                <Button clickedButton={onClickAddRate} buttonType="button" label="Add Rate" />
                <br />
                <br />
            </>
        }
        <br />
    </div>
  )
}

export default Rate