import React from 'react'
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

const FilterBar = (props) => {
    const [skills, setSkills] = useState([])
    const [skillsList, setSkillsList] = useState([])
    const [locations, setLocations] = useState([])
    const [locationsList, setLocationsList] = useState([])
    const [rates, setRates] = useState([])
    const [userFilteredData, setUserFilteredData] = useState()
    const [totalUserFiltered, setTotalUserFiltered] = useState(0)
    const [loadingFilter, setLoadingFilter] = useState(false)
    const [skillSelected, setSkillSelected] = useState([])
    const [experienceSelected, setExperienceSelected] = useState()
    const [rateSelected, setRateSelected] = useState([])
    const [locationSelected, setLocationSelected] = useState([])
    const [mouseEnterShowButton, setMouseEnterShowButton] = useState(false)

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
    
    useEffect(() =>{
        getSkills()
        getLocation()
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
    }, [skills, locations]);


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
        console.log(option)
        setRates(option)
    }

    useEffect(() => {
        UserRateMap()
    }, [])

    const advanceFilter = async (page) => {
        console.log("MASUK TIDAK");
        if (!page){
            page = 1
        }
        const response = await fetch(`/api/user/advance_search_result/?skill=${encodeURIComponent(skillSelected)}&experience=${experienceSelected}&rate=${rateSelected}&location=${locationSelected}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        const data = await response.json()
        if (response.ok){
            setUserFilteredData(data)
        }
    }

    // TO SHOW THE TOTAL USER CAPTURED BASED ON FILTER
    useEffect(() => {
        if (userFilteredData?.total_user >= 0 ){
            setLoadingFilter(true)
            setTimeout(() => {
                setLoadingFilter(false)
                setTotalUserFiltered(userFilteredData["total_user"]);
            }, 1500) 
        }
    }, [userFilteredData])

    // EVERY TIME VALUES IN THESE FIELDS CHANGE, CALL THE SERVER
    useEffect(() => {
        advanceFilter()
    }, [skillSelected, experienceSelected, rateSelected, rateSelected, locationSelected])

    // take all the selected skills
    const setSkill = (skills) => {
        setSkillSelected((prevValue) => {
            return (Array.from(new Set([...prevValue, skills])))
        })
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
            console.log(prevValue);
           return [
            ...prevValue,
            icon["value"]
        ]})
        console.log("RATE",rateSelected);
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

    const onMouseEnterShowButton = () => {
        setMouseEnterShowButton(true)
    }

    const onMouseLeaveShowButton = () => {
        setMouseEnterShowButton(false)
    }

    const onShowButtonClicked = () => {
        // SHow LIST OF USER FILTERED AFTER SHOW BUTTON CLICKED
        // SEND THIS DATA TO SEARCH PAGE
        props.filteredData(userFilteredData)
    }
              

  return (
    <div className='filter-box'>
        <CloseIcon onClick={ props.barClicked } className='filter-close-button' />
        <ul>             
            <li>
            <p>Skills</p>
            <Autocomplete
                multiple
                limitTags={1}
                options={skillsList}
                onChange={handleSkillChange}
                disableCloseOnSelect
                value={skillSelected}
                renderOption={(props, option, { selected }) => (
                    <p onClick={() => setSkill(option)} style={{margin: '0'}}>
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
        </ul>
        <a 
            onClick={() => onShowButtonClicked()}
            onMouseEnter={onMouseEnterShowButton}
            onMouseLeave={onMouseLeaveShowButton}
        >
        <Button
            buttonType="button"
            label={
                loadingFilter
                ?
                <span className='show-refresh-button'>
                    Show {mouseEnterShowButton ? <RefreshHover /> : <Refresh />}
                </span>
                : 
                <span>Show &#40;{totalUserFiltered}&#41;</span>   
            }
            customClassName="filter-show-button"
            />
        </a>
    </div>
  )
}

export default FilterBar