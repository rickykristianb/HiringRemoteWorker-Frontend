import React, { useEffect, useRef, useState } from 'react'
import TuneIcon from '@mui/icons-material/Tune';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import FilterBar from './FilterBar';
import UsersList from './UsersList';
import Loading from './Loading';

const Search = () => {
    const [filterClicked, setFilterClicked] = useState(false)
    const [searchBarEmpTypeData, setSearchBarEmpTypeData] = useState([])
    const [searchBarSkillsData, setSearchBarSkillsData] = useState([])
    const [searchBarLocationData, setSearchLocationData] = useState([])
    const [searchBarEmpty, setSearchBarEmpty] = useState(false)
    const [searchValue, setSearchValue] = useState()
    const [searchResultData, setSearchResultData] = useState()
    const [searchFilterData, setFilterResultData] = useState()
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const loading = useRef(false)
    const totalUser = useRef()
    const searchInputRef = useRef(null);


    const onFilterClick = () => {
        if (filterClicked === false) {
            setFilterClicked(true)
        } else {
            setFilterClicked(false)
        }
    }

    const onChangeSearchBox = async(e) => {
        setIsSearchBarOpen(true)
        setSearchValue(e.target.value)

        const response = await fetch("/api/user/search_bar_data/", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            }
        })
        const data = await response.json()
        const filteredEmpType = data["emp_type"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredSkills = data["skills"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredLocation = data["location"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setSearchBarEmpTypeData(filteredEmpType)
        setSearchBarSkillsData(filteredSkills)
        setSearchLocationData(filteredLocation)
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            setIsSearchBarOpen(false);
        };
    
        document.addEventListener('click', handleClickOutside);
      }, []);

    const onLoadSearchUser = async({page}) => {
        let item = searchValue
        console.log("MASUK TIDAK", searchValue);
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
    }

    const onClickedSearchItem = async({item: item, page: page}) => {
        setSearchValue(item)
        loading.current = true
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
            setFilterResultData()   // If basic search applied, filteredUser is cleared so the basic search only will be applied
        }
        totalUser.current = data["total_user"]
        loading.current = false
    }


    const onSearchKeyEnter = async (e) => {
        if (e.key === "Enter"){
            setIsSearchBarOpen(false)
            onClickedSearchItem({item:searchValue, page:1})
        }
    }

    const filteredData = (data) => {
        // CAPTURE DATA FROM THE FILTER
        setFilterResultData(data["data"])
        totalUser.current = data["total_user"]
    }

    const paginationFilteredData = () => {

    }
        

  return (
        <div className='container-search'>
             { filterClicked && (
                <FilterBar barClicked={ onFilterClick } filteredData={filteredData} paginationFilteredData={paginationFilteredData}/>
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
                            <li className='icon-search' onClick={ onFilterClick }><TuneIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        </Tooltip>
                    </ul>
                </div>
                {searchFilterData 
                    ? 
                    <UsersList 
                        filterClicked={filterClicked} 
                        searchData={searchFilterData} 
                        totalUser={totalUser.current}
                        loadUserSearch={paginationFilteredData}
                    /> 
                    :
                    <UsersList 
                        filterClicked={filterClicked} 
                        searchData={searchResultData} 
                        totalUser={totalUser.current}
                        loadUserSearch={onLoadSearchUser}
                    />
                }
                {loading.current === true && <Loading />}
            </div>
        </div>
  )
}

export default Search