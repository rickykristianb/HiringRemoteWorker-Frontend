import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select";
import Divider from '@mui/material/Divider';
import Button from '../Button';
import CloseIcon from '@mui/icons-material/Close';
import AuthContext from '../../Context/AuthContext';
import AlertNotification from '../AlertNotification';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Portfolio = (props) => {

    const [loginUserId, setLoginUserId] = useState()

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    }

    const portfolio = [ "Personal Website", "Website", "Github", "Others" ]

    const [portfolioList, setPortfolioList] = useState([])
    const [newPortfolioField, setNewPortfolioField] = useState([])
    const [onChangeInput, setOnChangeInput] = useState("")
    const [selectedType, setSelectedType] = useState("Select Type")
    const [alertField, setAlertField] = useState()
    const [alertFieldEdit, setAlertFieldEdit] = useState()
    const [alertResponse, setAlertResponse] = useState()
    const [isAdded, setIsAdded] = useState(false)
    const [isHover, setIsHover] = useState()
    const [isEdit, setIsEdit] = useState()

    const onLoadPortfolio = () => {

        setPortfolioList(props.userData.map((item) => {
            return {
                id: item.id,
                link: item.portfolio_link,
                type: item.portfolio_name
            }
        }))
    }

    useEffect(() => {
        onLoadPortfolio()
    }, [props.userData])

    const onAddMorePortfolio = () => {
        setNewPortfolioField([{
            link: "",
            type: ""
        }])
        setIsAdded(true)
    }

    const onChangePortfolioInput = (e) => {
        let {name, value} = e.target

        setOnChangeInput((prevValue) => ([{
            ...prevValue,
            [name]: value
        }]))
    }

    const onChangeSelectPortfolio = (option) => {
        setSelectedType(option.value)
    }

    const onAddPortfolio = async(index) => {

        if (onChangeInput === "" && selectedType === "Select Type"){
            setAlertField({"message": "Link and Type is required"})
        } else if (onChangeInput === "") {
            setAlertField({"message": "Link is required"})
        } else if (selectedType === "Select Type") {
            setAlertField({"message": "Type is required"})
        } else {
            const dataSend = {
                "link": onChangeInput[0]["portfolio-input"],
                "type": selectedType,
            }
            const response = await fetch("/api/user/add_portfolio/", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userAuthToken}`
                },
                body: JSON.stringify(dataSend)
            })

            const data = await response.json()
            if (response.status === 201) {
                const newData = {
                    "id": data.id,
                    "link": onChangeInput[0]["portfolio-input"],
                    "type": selectedType,
                }
                setPortfolioList((prevValue) => {
                    return [
                        ...prevValue,
                        newData
                    ]
                })
                setAlertResponse({"success": data.success})
                setIsAdded(false)
                setAlertField(null)
                setSelectedType("Select Type")
            } else {
                setAlertField({"message": data.error})
            }
        }
    }

    const onClickedEdit = (index) => {
        setIsEdit(index)
        setAlertFieldEdit(null)
    }

    const onRemovePortfolio = async (index) => {
        const id = portfolioList[index]["id"]

        const response = await fetch(`/api/user/remove_portfolio/${id}/`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userAuthToken}`
            }
        })
        const data = await response.json()
        if (response.status === 200) {
            setAlertResponse({"success": data.success})
            setPortfolioList((prevValue) => {
                const list = [...prevValue]
                list.splice(index, 1)
                return list
            })
        } else {
            setAlertResponse({"error": data.error})
        }
    }

    const onChangePortfolioInputEdit = (e, index) => {
        const {name, value} = e.target

        setPortfolioList((prevValue) => {
            const list = [...prevValue];
            list[index]["link"] = value;
            return list;
        })
    }

    const onChangeSelectPortfolioEdit = (option, {action}, index) => {

        setPortfolioList((prevValue) => {
            const list = [...prevValue];
            list[index]["type"] = option.value;
            return list;
        })
    }

    const onSaveEditPortfolio = async (index) => {
        const response = await fetch("/api/user/save_portfolio/", {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userAuthToken}`
            },
            body: JSON.stringify(portfolioList[index])
        })
        const data = await response.json()
        if (response.status === 200){
            setIsEdit(false)
            setAlertFieldEdit(null)
            setAlertResponse({"success": data.success})
        } else if(data.errorField) {
            setAlertFieldEdit({"message": data.errorField})
        } else {
            setAlertResponse({"error": data.error})
        }
    }

    const onClickClosedAdd = () => {
        setIsAdded(false)
        setAlertField(null)
        setOnChangeInput("")
        setSelectedType("Select Type")
    }

    const onMouseHover = (index) => {
        setIsHover(index)
    }

    const onMouseHoverLeave = (index) => {
        setIsHover(null)
    }

    const onCloseEdit = () => {
        setIsEdit(false)
        setAlertFieldEdit(null)
    }

  return (
    <div className='portfolio-container'> 
        <br />
        <br />
        <Divider />
        <h1>Portfolio</h1> 
        
        <div className='portfolio-list'>

        <div className='portfolio-list'>
        {portfolioList.map((item, index) => {
            return (
                <>                    
                    {isEdit === index ?
                        <div className='portfolio-edit-container'>
                            <div className='portfolio-edit'>
                                <input onChange={(e) => onChangePortfolioInputEdit(e, index)} value={portfolioList[index].link} name="portfolio-input" placeholder='Link' className='portfolio-input-field'></input>
                                <Select
                                    options={portfolio.map((item) => ({value: item, label: item}))}
                                    className='portfolio-selection'
                                    onChange={(option, action) => (onChangeSelectPortfolioEdit(option, action, index))}
                                    value={{value: portfolioList[index].type, label: portfolioList[index].type}}
                                    isDisabled={true}
                                />
                                <Button buttonType="button" label="Save" clickedButton={() => onSaveEditPortfolio(index)} />
                                <CloseIcon onClick={() => onCloseEdit()} />
                            </div>
                            {alertFieldEdit && <p className='error-field'>{alertFieldEdit.message}</p>}
                        </div>
                    :
                    <div key={index} className='portfolio' onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseHoverLeave()}>
                        <RadioButtonCheckedIcon />
                        <div className='portfolio-item'>
                            <a href={`https://${item.link}`} target='_blank' rel="noopener noreferrer" >{item.type} <OpenInNewIcon /></a>
                        </div>
                        {loginUserId === props.clickedUserId &&
                            isHover === index &&
                                <div className='portfolio-edit-delete-button'>
                                    <Button buttonType="button" label="Edit" clickedButton={() => onClickedEdit(index)} />
                                    <Button buttonType="button" label="Delete" clickedButton={() => onRemovePortfolio(index)} customStyle={{backgroundColor: "red", color: "white", border: "1px solid red"}}  />
                                </div>
                        }
                    </div>
                    }
                </>
            )
        })}
        </div>
        
        
        </div>
        {isAdded && newPortfolioField.map((item, index) => {
            return (
                <div key={index} className='add-portfolio-section'>
                    <input onChange={(e) => onChangePortfolioInput(e)} name="portfolio-input" placeholder='Link' className='portfolio-input-field'></input>
                    <Select
                        options={portfolio.map((item) => ({value: item, label: item}))}
                        className='portfolio-selection'
                        onChange={onChangeSelectPortfolio}
                        value={{value: selectedType, label: selectedType}}
                    />
                    <Button buttonType="button" label="Add" clickedButton={() => onAddPortfolio(index)} />
                    <CloseIcon onClick={onClickClosedAdd} />
                </div>
            )
        })}
        {alertField && <p className='error-field'>{alertField.message}</p>}
        <br />
        <br />
        {loginUserId === props.clickedUserId && 
            <>
                <Button buttonType="button" label="Add Portfolio" clickedButton={() => onAddMorePortfolio()} />
                <br />
                <br />
            </>
        }
        <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default Portfolio