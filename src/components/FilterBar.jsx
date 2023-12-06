import React from 'react'
import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { TextField } from '@mui/material';

const FilterBar = (props) => {
    const [skills, setSkills] = useState([])
    const [skillsList, setSkillsList] = useState([])
    const [rates, setRates] = useState([])

    const [skillSelected, setSkillSelected] = useState([])

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    // fetch skills list from the server
    const getSkills = async() => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/user/get_skills/")
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
    
    useEffect(() =>{
        getSkills()
    }, [])


    useEffect(()=>{
        const skillLIst = skills.map((skill) => (
            skill.skill_name
        ))
        setSkillsList(skillLIst)
    }, [skills]);


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

    // take all the selected skills
    const SetSkill = (skills) => {
        setSkillSelected((prevValue) => {
            return ([...prevValue, skills])
        })
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
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                    <p onClick={() => SetSkill(option)} style={{margin: '0'}}>
                        <li {...props} >
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            value={skillSelected}
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
            <p>Rate</p>
            <Autocomplete
                multiple
                limitTags={1}
                options={ rates }
                disableCloseOnSelect
                
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option}
                    </li>
                )}
                style={{ alignItems: 'center' }}
                renderInput={(params) => (
                    <TextField {...params} label="Select user rate" placeholder="Skills" 
                    />
                )}
                />
            </li>
            <li>
            <p>Skills</p>
            <Autocomplete
                multiple
                limitTags={1}
                options={skillsList}
                disableCloseOnSelect
                
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option}
                    </li>
                )}
                style={{ alignItems: 'center' }}
                renderInput={(params) => (
                    <TextField {...params} label="Select skills" placeholder="Skills" 
                    />
                )}
                />
            </li>
        </ul>
    </div>
  )
}

export default FilterBar