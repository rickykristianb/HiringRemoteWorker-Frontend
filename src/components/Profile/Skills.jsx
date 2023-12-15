import React, {useState, useContext, useEffect} from 'react'
import Divider from '@mui/material/Divider';
import AuthContext from '../../Context/AuthContext';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../Button';
import AlertNotification from '../AlertNotification';
import Select from "react-select";

const Skills = (props) => {
    const [skill, setSkill] = useState([])
    const [skillLevel, setSkillLevel] = useState([])
    const [skillList, setSkillList] = useState([])
    const [skillLevelList, setSkillLevelList] = useState([]);
    const [skillAndLevelList, setSkillAndLevelList] = useState([])
    const [fixedSelectedSkill, setFixedSelectedSkill] = useState([])
    const [fixedSelectedSkillLevel, setFixedSelectedSkillLevel] = useState([])
    const [selectedSkill, setSelectedSkill] = useState('Select Skill');
    const [selectedSkillLevel, setSelectedSkillLevel] = useState('Select Skill Level');
    const [isAdd, setIsAdd] = useState(false)
    const [alertField, setAlertField] = useState()
    const [alertResponse, setAlertResponse] = useState()
    
    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    } 

    const [loginUserId, setLoginUserId] = useState()

    useEffect(() => {
        setLoginUserId(localStorage.getItem("userId"))
    }, [])

    const onLoadSkills = async() => {
        const response = await fetch("/api/user/get_skills/",{
            method: "GET",
        })
        const data = await response.json()
        if (response.status === 200){
            setSkillList(data)
        }
    }

    const onLoadSkillLevel = async () => {
        const response = await fetch("/api/user/get_skill_level/",{
            method: "GET",
        })
        const data = await response.json()
        if (response.status === 200){
            setSkillLevelList(data)
        }
    }

    const onLoadSkillLevelData = () => {
        const dataList = props.userData.map((item) => {
            return {
                id: item.id,
                skill_name: item.skills.skill_name,
                skill_level: item.skill_level.skill_level
            }
        })
        setSkillAndLevelList(dataList)
    }

    useEffect(() => {
        onLoadSkills()
        onLoadSkillLevel()
        onLoadSkillLevelData()
    }, [props.userData])

    const onAddMoreSkillsSection = () => {
        setIsAdd(true)
        setSkill([{
            id: "",
            skillName: ""
        }])

        setSkillLevel([{
            id: "",
            skillLevel: ""
        }])
    }

    const onAddSkill = async () => {
        if (selectedSkill === 'Select Skill' && selectedSkillLevel ==='Select Skill Level'){
            setAlertField({
                "message": "Skill and Skill Level are required"
            })
        } else if (selectedSkill === 'Select Skill') {
            setAlertField({
                "message": "Skill is required"
            })
        } else if (selectedSkillLevel ==='Select Skill Level'){
            setAlertField({
                "message": "Skill Level is required"
            })
        } else if (selectedSkill !== 'Select Skill' && selectedSkillLevel !=='Select Skill Level'){
            const dataSend = {
                skillId: fixedSelectedSkill,
                skillLevelId: fixedSelectedSkillLevel
            }
    
            const response = await fetch("/api/user/add_skills/",{
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userAuthToken}`
                },
                body: JSON.stringify(dataSend)
            })
            const data = await response.json()
            if (response.status === 201){
                setIsAdd(false)
                console.log("RESPONSE DATA", data);
                const newSelectedSkill = {
                    id: data.id,
                    skill_name: selectedSkill,
                    skill_level: selectedSkillLevel
                }
                console.log("selected",selectedSkill);
                setSkillAndLevelList((prevSkillLevel) => [...prevSkillLevel, newSelectedSkill])
                setSelectedSkill('Select Skill')
                setSelectedSkillLevel('Select Skill Level')
                setAlertField()
                setAlertResponse({"success": data.success})
            } else {
                setAlertField({"message": data.error})
            }
        }        
    }

    const onRemoveSkill = async (index) => {
        const id = skillAndLevelList[index].id
        const response = await fetch(`/api/user/delete_skills/${id}/`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userAuthToken}`
            }
        })
        const data = await response.json()
        console.log("STATUS", data);
        if (response.status === 200) {
            setSkillAndLevelList((prevSkillAndLevelList) => {
                const SkillAndLevelList = [...prevSkillAndLevelList]
                SkillAndLevelList.splice(index, 1)
                return SkillAndLevelList
            })
            setAlertResponse({"success": data.success})
        } else {
            setAlertResponse({"error": data.error})
        }
    }

    const onChangeSelectSkill = (option) => {
        setSelectedSkill(option.value)
        setFixedSelectedSkill(option["id"])
    }
    
    const onChangeSelectSkillLevel = (option) => {
        setSelectedSkillLevel(option.value)
        setFixedSelectedSkillLevel(option["id"])
    }

    const onClickCloseAddSkill = () => {
        setIsAdd(false)
        setAlertField()
        setSelectedSkill('Select Skill')
        setSelectedSkillLevel('Select Skill Level')
    }


  return (
    <div className='skills-container'>
    {/* <Divider /> */}
        <h1>Skills</h1>
        <br />
        <div className='skill-level-list'>
        {skillAndLevelList.map((item, index) => (
            <div key={index} className='skill-level-container'>
                <div className='skill-item'><b>{item.skill_name}</b></div>
                  <Divider />
                <div className='skill-level-item'>{item.skill_level}</div>
                {props.clickedUserId === loginUserId && <CloseIcon onClick={() => onRemoveSkill(index)}  className='skill-list-close-button'/> }
              </div>
        ))}
        </div>
        

        {isAdd && 
            <div className='add-skill-section'>
            {skill.map((item, index) => [
                <div key={index}>
                    <Select
                        options={skillList.map((skill) => ({id: skill.id, value: skill.skill_name, label: skill.skill_name}))}
                        className='skill-selection'
                        onChange={onChangeSelectSkill}
                        value={{id: skill.id, value: selectedSkill, label: selectedSkill}}
                    />
                </div>
            ])}

            {skillLevel.map((item, index) => [
                <div key={index}>
                    <Select
                        options={skillLevelList.map((skill) => ({id: skill.id, value: skill.skill_level, label: skill.skill_level}))}
                        className='skill-selection'
                        value={{id: skill.id, value: selectedSkillLevel, label:selectedSkillLevel}}
                        onChange={onChangeSelectSkillLevel}
                    />
                </div>
            ])}
            <Button buttonType="button" label="Add" clickedButton={() => onAddSkill()} customClassName="skill-save-button"  />
            <CloseIcon onClick={() => onClickCloseAddSkill()} />
        </div>
        }
        {alertField && <p className='error-field'>{alertField.message}</p>}
        {props.clickedUserId === loginUserId && 
            <>
                <Button buttonType="button" label="Add Skills" clickedButton={onAddMoreSkillsSection} />
                <br />
                <br />
            </>
        }
        
        <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default Skills