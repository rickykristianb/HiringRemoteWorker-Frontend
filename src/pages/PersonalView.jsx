import React, { useContext, useEffect, useRef, useState } from 'react'
import JobsList from 'components/JobsList'
import Backdrop from 'components/Backdrop';
import FilterBar from 'components/FilterBar';
import AdvanceJobFilterBar from 'components/AdvanceJobFilterBar';
import TextField from '@mui/material/TextField';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationContext from 'Context/NotificationContext';

const PersonalView = () => {

    const [searchBarData, setSearchBarData] = useState()
    const [searchBarEmpTypeData, setSearchBarEmpTypeData] = useState([])
    const [searchBarSkillsData, setSearchBarSkillsData] = useState([])
    const [searchBarLocationData, setSearchLocationData] = useState([])
    const [searchResultData, setSearchResultData] = useState()
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [skillSelected, setSkillSelected] = useState()
    const [experienceSelected, setExperienceSelected] = useState()
    const [locationSelected, setLocationSelected] = useState()
    const [jobTypeSelected, setJobTypeSelected] = useState()
    const [advancedFilterResultData, setAdvancedFilterResultData] = useState()
    const [isShowButtonClicked, setIsShowButtonClicked] = useState(false)
    const [searchValue, setSearchValue] = useState()
    const [isPaginationReset, setIsPaginationReset] = useState(false)
    const [filterClicked, setFilterClicked] = useState(false)
    const [backdropActive, setBackdropActive] = useState(false)
    const [pageClicked, setPageClicked] = useState(false)
    const loading = useRef(false)
    const showData = useRef()
    const totalUser = useRef()

    const {onLoadTotalUnreadNotification} = useContext(NotificationContext)

    const onLoadSearchBarData = async() => {
        const response = await fetch("/api/user/search_bar_data/", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            }
        })
        const data = await response.json()
        if (response.ok){
            setSearchBarData(data)
        }
    }

    const onClickOutsideOfSearchBarData = () => {

        const handleClickOutside = (e) => {
            setIsSearchBarOpen(false);
        };
        return document.addEventListener('click', handleClickOutside);
    }

    useEffect(() => {
        onClickOutsideOfSearchBarData()
        onLoadSearchBarData()
        onLoadTotalUnreadNotification()
    }, [])

    const onChangeSearchBox = async(e) => {
        setIsSearchBarOpen(true)
        setSearchValue(e.target.value)

        const filteredEmpType = searchBarData["emp_type"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredSkills = searchBarData["skills"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredLocation = searchBarData["location"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setSearchBarEmpTypeData(filteredEmpType)
        setSearchBarSkillsData(filteredSkills)
        setSearchLocationData(filteredLocation)
        if (searchBarEmpTypeData.length === 0 && searchBarSkillsData.length === 0 && searchBarLocationData.length === 0){
            setIsSearchBarOpen(false)
        }
    }

    const onLoadJobSearch = async(page) => {
        try{
            setBackdropActive(true)
            let item = searchValue
            const response = await fetch(`/api/job/get_search_job_result/?search=${item}&page=${page}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                },
            })
            const data = await response.json()
            if (response.ok){
                setSearchResultData(data["data"])
                console.log(data["data"]);
                console.log(data["total_user"]);
            }
            totalUser.current = data["total_user"]
            setBackdropActive(false)
        } catch (error){
            console.error("Encounter an error: ", error);
        } finally {
            setBackdropActive(false)
        }
        
    }

    // GET RESULT FROM THE SEARCH BAR FILTER
    const onClickedSearchItem = async({item, page}) => {
        setSearchValue(item)
        loading.current = true
        const response = await fetch(`/api/job/get_search_job_result/?search=${item}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        const data = await response.json()
        if (response.ok){
            setSearchResultData(data["data"])
            showData.current = null   // If basic search applied, filteredUser is cleared so the basic search only will be applied
            resetPage()  // RESET PAGINATION NUMBER TO 1
            totalUser.current = data["total_user"]
        }
        loading.current = false
    }

    const onSearchKeyEnter = async (e) => {
        if (e.key === "Enter"){
            setIsSearchBarOpen(false)
            onClickedSearchItem({item:searchValue, page:1})
        }
    }

    const resetPage = () => {
        // RESET PAGINATION NUMBER TO 1
        setIsPaginationReset(true)
        setTimeout(() => {
            setIsPaginationReset(false)
        }, 1)
    }

    const onAdvanceFilterClick = () => {
        if (filterClicked === false) {
            setFilterClicked(true)
        } else {
            setFilterClicked(false)
        }
    }


    const advanceFilter = async (page) => {
        console.log("MASUK TIDAK");
        console.log(jobTypeSelected);
        if (!page){
            page = 1
        } else{
            setPageClicked(true)
            page = page.page
        }
        const response = await fetch(`/api/job/get_advance_filter_result/?skill=${encodeURIComponent(skillSelected)}&experience=${experienceSelected}&location=${locationSelected}&type=${jobTypeSelected}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        const data = await response.json()
        console.log(data);
        if (response.ok){
            setAdvancedFilterResultData(data)
            setSearchResultData()
            setIsShowButtonClicked(true)
            setTimeout(() => {
                setIsShowButtonClicked(false)
            }, 1) 
        }
    }

    const advanceFilterPageClicked = async (page) => {       
        setBackdropActive(true)
        if (!page){
            page = 1
        } else{
            setPageClicked(true)
            page = page
        }
        const response = await fetch(`/api/job/get_advance_filter_result/?skill=${encodeURIComponent(skillSelected)}&experience=${experienceSelected}&location=${locationSelected}&type=${jobTypeSelected}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        const data = await response.json()
        console.log(data);
        if (response.ok){
            showData.current = data
            setSearchResultData()
            setIsShowButtonClicked(true)
            setTimeout(() => {
                setIsShowButtonClicked(false)
            }, 10)
            console.log("AKHIR",loading.current);
        }
        setBackdropActive(false)
    }

    const filteredData = (data) => {
        setSkillSelected(data["skill"])
        setExperienceSelected(data["experience"])
        setLocationSelected(data["location"])
        setJobTypeSelected(data["type"])
    }

    useEffect(() => {   
        advanceFilter();
    }, [skillSelected, experienceSelected, locationSelected, jobTypeSelected])

    const onButtonShowFilterClicked = () => {
        setIsShowButtonClicked(true)
        showData.current = advancedFilterResultData

        setTimeout(() => {
            setIsShowButtonClicked(false)
        }, 1)       
    }

    return (
        <div className='container-search'>
            { filterClicked && (
                <AdvanceJobFilterBar barClicked={ onAdvanceFilterClick } 
                    getAdvancedFilterData={advanceFilter} 
                    filteredData={filteredData}
                    buttonShowClicked={() => onButtonShowFilterClicked()}
                    totalUserCaptured={advancedFilterResultData}
                    resetPage={resetPage} // RESET PAGINATION NUMBER TO 1
                    includeRate={false}
                />
            )}
            <div className='search-menu'>
                <div className='search-input'>
                    <ul>
                        <li>
                            <TextField 
                                className='search-box' 
                                placeholder='Skill, Job Type, Location' 
                                value={searchValue}
                                onChange={(e) => onChangeSearchBox(e)}
                                onKeyDown={(e) => onSearchKeyEnter(e)}
                                InputProps={{
                                    style: {
                                    borderRadius: "50px",
                                    }
                                }}
                                sx={{borderRadius: "50px", width: "500px", boxShadow: "0 1px 5px 0px rgba(78, 110, 110, 0.3)"}}
                            ></TextField>
                        
                            {isSearchBarOpen && (
                            <ul className='searchResultList-container'>
                                {searchBarSkillsData.length !== 0 && (
                                    <>
                                        <li className='searchResultList-title'>Skills</li>
                                            <div className='skill-div'>
                                                {searchBarSkillsData.slice(0, 3).map((item) => {
                                                    return <li className='searchResultList-item' onClick={ () => onClickedSearchItem({item: item, page:1})} >{item}</li>
                                                })}
                                            </div>
                                    </>                                   
                                )}

                                {searchBarEmpTypeData.length !== 0 && (
                                    <>
                                        <li className='searchResultList-title'>Job Type</li>
                                            <div className='skill-div'>
                                                {searchBarEmpTypeData.slice(0, 3).map((item) => {
                                                    return <li className='searchResultList-item' onClick={ () => onClickedSearchItem({item: item, page:1})} >{item}</li>
                                                })}
                                            </div>
                                    </>
                                )}

                                {searchBarLocationData.length !== 0 && (
                                    <>
                                        <li className='searchResultList-title'>Location</li>
                                        <div className='skill-div'>
                                            {searchBarLocationData.slice(0, 3).map((item) => {
                                                return <li className='searchResultList-item' onClick={ () => onClickedSearchItem({item: item, page:1})} >{item}</li>
                                            })}
                                        </div>   
                                    </>
                                )}
                            </ul>
                            )}
                        </li>
                        <li className='icon-search'><ContentPasteSearchIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        <Tooltip  TransitionComponent={Zoom} placement="right" title="Advance Filter" arrow>
                            <li className='icon-search' onClick={ onAdvanceFilterClick }><TuneIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        </Tooltip>
                    </ul>
                </div>
                {showData.current 
                ?
                <JobsList
                    filterClicked={filterClicked} 
                    searchData={showData.current["data"]}
                    totalUser={showData.current["total_user"]}
                    paginationReset={isPaginationReset}
                    loadJobSearch={advanceFilterPageClicked}
                />
                :
                <JobsList
                    filterClicked={filterClicked} 
                    searchData={searchResultData}
                    totalUser={totalUser.current}
                    paginationReset={isPaginationReset}
                    loadJobSearch={onLoadJobSearch}
                />
                }
            </div>
            {backdropActive && <Backdrop />}
        </div>
    )
}

export default PersonalView