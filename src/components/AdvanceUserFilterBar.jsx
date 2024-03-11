import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { TextField } from '@mui/material';
import Button from './Button';
import { ReactComponent as Refresh } from "../assets/images/Reload.svg"
import { ReactComponent as RefreshHover } from "../assets/images/Reload-Mouse-Hover.svg"
import { set } from 'date-fns';

const AdvanceUserFilterBar = (props) => {
    const [skills, setSkills] = useState([])
    const [skillsList, setSkillsList] = useState([])
    const [locations, setLocations] = useState([])
    const [locationsList, setLocationsList] = useState([])
    const [typeData, setTypeData] = useState([])
    const [typeList, setTypeList] = useState([])
    const [rates, setRates] = useState([])
    // const [userFilteredData, setUserFilteredData] = useState()
    const [totalUserFiltered, setTotalUserFiltered] = useState(0)
    const [loadingFilter, setLoadingFilter] = useState(false)
    const [skillSelected, setSkillSelected] = useState([])
    const [experienceSelected, setExperienceSelected] = useState()
    const [rateSelected, setRateSelected] = useState([])
    const [locationSelected, setLocationSelected] = useState([])
    const [typeSelected, setTypeSelected] = useState([])
    const [mouseEnterShowButton, setMouseEnterShowButton] = useState(false)
    const resetPage = useRef(1)

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    // fetch skills list from the server
    const getSkills = async() => {
        try {
            const response = await fetch("/api/user/get_skills/")
            if (response.ok) {
                const data = await response.json()
                setSkills(data)
            } else {
                console.error(response.context.error, response.status)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getLocation = async () => {
        try {
            const response = await fetch("/api/user/get_location/")
            if (response.ok) {
                const data = await response.json()
                setLocations(data)
            } else {
                console.error(response.context.error, response.status)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getType = async() => {
        try {
            const response = await fetch("/api/user/get_emp_type/")
            if (response.ok) {
                const data = await response.json()
                setTypeData(data)
            } else {
                console.error(response.context.error, response.status)
            }
        } catch (error){
            console.log(error);
        }
    }
    
    useEffect(() =>{
        getSkills()
        getLocation()
        getType()
    }, [])


    useEffect(()=>{
        const skillLIst = skills.map((skill) => (
            skill.skill_name
        ))
        setSkillsList(skillLIst)

        const locationList = locations.map((location) => (
            location.location
        ))
        setLocationsList(locationList)

        const typeList = typeData.map((type) => (
            type.type
        ))
        setTypeList(typeList)
    }, [skills, locations, typeData]);


    const UserRate =  [
        {
            value: 5,
            icon : "★★★★★",
        },
        {
            value: 4,
            icon: "★★★★",
        },
        {
            value: 3,
            icon: "★★★",
        },
        {
            value: 2,
            icon: "★★",
        },
        {
            value: 1,
            icon: "★"
        }
    ]

    const experienceList = [
        "1 - 2 years", "2 - 4 years", "4 - 6 years", "6 - 8 years", "8 - 10 years", " > 10 years"
    ]

    const UserRateMap = () => {
        const option = UserRate.map((rate, index) => {
            return rate.icon
        })
        // console.log(option)
        setRates(option)
    }

    useEffect(() => {
        UserRateMap()
    }, [])


    // EVERY TIME VALUES IN THESE FIELDS CHANGE, CALL THE SERVER
    useEffect(() => {
        props.filteredData({
            skill: skillSelected, 
            experience: experienceSelected, 
            rate: rateSelected, 
            location: locationSelected,
            type: typeSelected
        })
    }, [skillSelected, experienceSelected, rateSelected, locationSelected, typeSelected])

    
    // TO SHOW THE TOTAL USER CAPTURED BASED ON FILTER
    useEffect(() => {
        if (props.totalUserCaptured?.total_user >= 0 ){
            setLoadingFilter(true)
            setTimeout(() => {
                setLoadingFilter(false)
                setTotalUserFiltered(props.totalUserCaptured["total_user"]);
            }, 1000) 
        }
    }, [props.totalUserCaptured])


    // take all the selected skills
    const handleSkillSelected = (skills) => {
        setSkillSelected((prevValue) => [
            ...prevValue
        ]);
    }  

    const handleSkillChange = (event, newSkills) => {
        if (!skillSelected.includes(newSkills)){
            setSkillSelected(newSkills);
        }
    };

    const setExperience = (experience) => {
        setExperienceSelected(experience)
    }

    const setSelectedRate = (selectedIcon) => {
        console.log(selectedIcon);
        const icon = UserRate.find((rate) => rate.icon === selectedIcon)

        setRateSelected((prevValue) => {
           return [
            ...prevValue,
            icon["value"]
        ]})
    }

    const handleRateChange = (event, selectedIcon) => {   
        const rateValue = []
        for (var i=0; i<selectedIcon.length; i++){
            const rate = UserRate.find((rate) => rate.icon === selectedIcon[i])
            rateValue.push(rate["value"])
        } 
        setRateSelected(rateValue)
    }

    const handleLocationSelected = (selectedLocation) => {
        setLocationSelected((prevValue) => [
            ...prevValue,
            selectedLocation
        ]);
    }

    const handleLocationChange = (event, location) => {
        setLocationSelected(location)
    }

    const handleTypeChange = (e, selectedType) => {
        setTypeSelected(selectedType)
    }

    const setType = (selectedType) => {
        setTypeSelected((prevValue) => {
            return (Array.from(new Set([...prevValue, selectedType])))
        })
    }

    const onMouseEnterShowButton = () => {
        setMouseEnterShowButton(true)
    }

    const onMouseLeaveShowButton = () => {
        setMouseEnterShowButton(false)
    }

    const onShowButtonClicked = () => {
        // SHow LIST OF USER FILTERED AFTER SHOW BUTTON CLICKED
        // SEND THIS DATA TO SEARCH PAGE
        props.buttonShowClicked()
        props.resetPage(resetPage.current) // RESET PAGINATION NUMBER TO 1
    }
              

  return (
    <div className='flex flex-col justify-start z-3 py-3 px-10 w-[450px] md:h-full border-dark-basic shadow-box-shadow mb-4 max-xl:fixed max-xl:bottom-11 max-xl:w-screen max-xl:bg-white border-t-0.5 border-soft-basic'>
        <CloseIcon onClick={ props.barClicked } className='justify-end xl:relative left-[100%] top-[0.4%] max-xl:self-end' />
        <ul className="flex flex-col mt-10 gap-4">             
            <li>
            <p>Skills</p>
            <Autocomplete
                multiple
                limitTags={1}
                options={skillsList}
                onChange={handleSkillChange}
                disableCloseOnSelect
                
                renderOption={(props, option, { selected }) => (
                    <p onClick={() => handleSkillSelected(option)} style={{margin: '0'}}>
                        <li {...props} >
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option}
                        </li>
                    </p>
                )}
                style={{ alignItems: 'center' }}
                renderInput={(params) => (
                    <TextField {...params} label="Select skills" placeholder="Skills" 
                    />
                )}
            />
            </li>

            <li>
                <p>Experience</p>
                <Autocomplete
                    freeSolo
                    limitTags={1}
                    options={experienceList}
                    onChange={setExperience}
                    disableCloseOnSelect
                    value={experienceSelected}
                    renderOption={(props, option, { selected }) => (
                        <p onClick={() => setExperience(option)} style={{margin: '0'}}>
                            <li {...props}>
                                {option}
                            </li>
                        </p>
                    )}
                    style={{ alignItems: 'center' }}
                    renderInput={(params) => (
                        <TextField {...params} label="Select experience" placeholder="Experience" 
                        />
                    )}
                />
            </li>
            <li>
            <p>Rate</p>
            <Autocomplete
                multiple
                limitTags={1}
                options={ rates }
                onChange={handleRateChange}
                disableCloseOnSelect
                
                renderOption={(props, option, { selected }) => (
                    <p onClick={() => setSelectedRate(option)} style={{margin: '0'}}>
                        <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option}
                        </li>
                    </p>
                )}
                style={{ alignItems: 'center' }}
                renderInput={(params) => (
                    <TextField {...params} label="Select user rate" placeholder="Rate" 
                    />
                )}
                />
            </li>
            <li>
            <p>Location</p>
            <Autocomplete
                multiple
                limitTags={1}
                options={ locationsList }
                onChange={handleLocationChange}
                disableCloseOnSelect
                
                renderOption={(props, option, { selected }) => (
                    <p onClick={() => handleLocationSelected(option)} style={{margin: '0'}}>
                        <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option}
                        </li>
                    </p>
                )}
                style={{ alignItems: 'center' }}
                renderInput={(params) => (
                    <TextField {...params} label="Select Location" placeholder="Location" 
                    />
                )}
                />
            </li>
            <li>
            <p>Employment Type</p>
            <Autocomplete
                multiple
                limitTags={1}
                options={typeList}
                onChange={handleTypeChange}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                    <p onClick={() => setType(option)} style={{margin: '0'}}>
                        <li {...props} >
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option}
                        </li>
                    </p>
                )}
                style={{ alignItems: 'center' }}
                renderInput={(params) => (
                    <TextField {...params} label="Select type" placeholder="Types" 
                    />
                )}
            />
            </li>
        </ul>
        <a className='self-end '
            onClick={() => onShowButtonClicked()}
            onMouseEnter={onMouseEnterShowButton}
            onMouseLeave={onMouseLeaveShowButton}
        >
        <br />
        <Button
            buttonType="button"
            label={
                loadingFilter
                ?
                <span className='flex flex-row gap-1'>
                    Show {mouseEnterShowButton ? <RefreshHover /> : <Refresh />}
                </span>
                : 
                <span>Show &#40;{totalUserFiltered}&#41;</span>   
            }
            customClassName="show-advance-filter-button"
            />
        </a>
    </div>
  )
}

export default AdvanceUserFilterBar