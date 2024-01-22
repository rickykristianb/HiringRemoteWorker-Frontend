import React, { useEffect, useRef, useState } from 'react'
import TuneIcon from '@mui/icons-material/Tune';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import FilterBar from 'components/FilterBar';
import AdvanceUserFilterBar from 'components/AdvanceUserFilterBar';
import UsersList from 'components/UsersList';
import Loading from 'components/Loading';
import Backdrop from 'components/Backdrop';

const CompanyView = () => {
    const [filterClicked, setFilterClicked] = useState(false)
    const [searchBarData, setSearchBarData] = useState()
    const [searchBarEmpTypeData, setSearchBarEmpTypeData] = useState([])
    const [searchBarSkillsData, setSearchBarSkillsData] = useState([])
    const [searchBarLocationData, setSearchLocationData] = useState([])
    const [searchValue, setSearchValue] = useState()
    const [searchResultData, setSearchResultData] = useState()
    const [advancedFilterResultData, setAdvancedFilterResultData] = useState()
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [jobTypeSelected, setJobTypeSelected] = useState()
    const [isShowButtonClicked, setIsShowButtonClicked] = useState(false)
    const loading = useRef(false)
    const totalUser = useRef()
    const [skillSelected, setSkillSelected] = useState()
    const [experienceSelected, setExperienceSelected] = useState()
    const [rateSelected, setRateSelected] = useState()
    const [locationSelected, setLocationSelected] = useState()
    const [backdropActive, setBackdropActive] = useState(false)
    const showData = useRef()
    const showDataPage = useRef()
    const [pageClicked, setPageClicked] = useState(false)
    const [isPaginationReset, setIsPaginationReset] = useState(false)


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

    const onClickOutsideOfSearchBarData = () => {

        const handleClickOutside = (e) => {
            setIsSearchBarOpen(false);
        };
        return document.addEventListener('click', handleClickOutside);
    }

    useEffect(() => {
        onClickOutsideOfSearchBarData()
        
        onLoadSearchBarData()
      }, []);

    const onLoadSearchUser = async({page}) => {
        console.log("MASUK SINI KAH");
        try{
            setBackdropActive(true)
            let item = searchValue
            const response = await fetch(`/api/user/search_result/?page=${page}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(item)
            })
            const data = await response.json()
            if (response.ok){
                setSearchResultData(data["data"])
            }
            totalUser.current = data["total_user"]
            setBackdropActive(false)
        } catch (error){
            console.error("An unexpected error occurred: ", error);
        } finally {
            setBackdropActive(false)
        }
    }

    // GET RESULT FROM THE SEARCH BAR FILTER
    const onClickedSearchItem = async({item: item, page: page}) => {
        setSearchValue(item)
        setBackdropActive(true)
        const response = await fetch(`/api/user/search_result/?page=${page}`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(item)
        })
        const data = await response.json()
        if (response.ok){
            setSearchResultData(data["data"])
            showData.current = null   // If basic search applied, filteredUser is cleared so the basic search only will be applied
            resetPage()  // RESET PAGINATION NUMBER TO 1
        }
        totalUser.current = data["total_user"]
        setBackdropActive(false)
    }


    const onSearchKeyEnter = async (e) => {
        if (e.key === "Enter"){
            setIsSearchBarOpen(false)
            onClickedSearchItem({item:searchValue, page:1})
        }
    }

    const onAdvanceFilterClick = () => {
        if (filterClicked === false) {
            setFilterClicked(true)
        } else {
            setFilterClicked(false)
        }
    }

    // GET RESULT FROM THE ADVANCED USER FILTER
    const advanceFilter = async (page) => {
        
        setBackdropActive(true)
        if (!page){
            page = 1
        } else{
            setPageClicked(true)
            page = page.page
        }
        const response = await fetch(`/api/user/advance_search_result/?skill=${encodeURIComponent(skillSelected)}&experience=${experienceSelected}&rate=${rateSelected}&location=${locationSelected}&type=${jobTypeSelected}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        const data = await response.json()
        if (response.ok){
            setAdvancedFilterResultData(data)
            setSearchResultData()
            setIsShowButtonClicked(true)
            setTimeout(() => {
                setIsShowButtonClicked(false)
            }, 1) 
        }
        setBackdropActive(false)
    }

    const advanceFilterPageClicked = async (page) => {
        console.log("SINI KAH");
        setBackdropActive(true)
        if (!page){
            page = 1
        } else{
            setPageClicked(true)
            page = page.page
        }
        const response = await fetch(`/api/user/advance_search_result/?skill=${encodeURIComponent(skillSelected)}&experience=${experienceSelected}&rate=${rateSelected}&location=${locationSelected}&type=${jobTypeSelected}&page=${page}`, {
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
            }, 1) 
        }
        setBackdropActive(false)
    }

    const filteredData = (data) => {
        setSkillSelected(data["skill"])
        setExperienceSelected(data["experience"])
        setRateSelected(data["rate"])
        setLocationSelected(data["location"])
        setJobTypeSelected(data["type"])
        // console.log("INI CAPTURED DATA", skillSelected);
    }

    useEffect(() => {   
        advanceFilter();
    }, [skillSelected, experienceSelected, rateSelected, locationSelected, jobTypeSelected])

    const onButtonShowFilterClicked = () => {
        setIsShowButtonClicked(true)
        showData.current = advancedFilterResultData

        setTimeout(() => {
            setIsShowButtonClicked(false)
        }, 1)       
    }
       
    const resetPage = () => {
        // RESET PAGINATION NUMBER TO 1
        setIsPaginationReset(true)
        setTimeout(() => {
            setIsPaginationReset(false)
        }, 1)
    }

  return (
        <div className='container-search'>
             { filterClicked && (
                <AdvanceUserFilterBar barClicked={ onAdvanceFilterClick } 
                    getAdvancedFilterData={advanceFilter} 
                    filteredData={filteredData}
                    buttonShowClicked={() => onButtonShowFilterClicked()}
                    totalUserCaptured={advancedFilterResultData}
                    resetPage={resetPage} // RESET PAGINATION NUMBER TO 1
                    includeRate={true}
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
                        <li className='icon-search'><PersonSearchIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        <Tooltip  TransitionComponent={Zoom} placement="right" title="Advance Filter" arrow>
                            <li className='icon-search' onClick={ onAdvanceFilterClick }><TuneIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        </Tooltip>
                    </ul>
                </div>
                {showData.current
                ?
                    <UsersList
                        filterClicked={filterClicked}
                        searchData={showData.current["data"]}
                        totalUser={showData.current["total_user"]}
                        loadUserSearch={advanceFilterPageClicked}
                        paginationReset={isPaginationReset}
                    />
                :
                    <UsersList 
                        filterClicked={filterClicked} 
                        searchData={searchResultData} 
                        totalUser={totalUser.current}
                        loadUserSearch={onLoadSearchUser}
                        paginationReset={isPaginationReset}
                    />
                }
            </div>
            {backdropActive && <Backdrop />}
        </div>
    )
}

export default CompanyView