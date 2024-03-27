import React, { useContext, useEffect, useRef, useState } from 'react'
import TuneIcon from '@mui/icons-material/Tune';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import AdvanceUserFilterBar from 'components/AdvanceUserFilterBar';
import UsersList from 'components/UsersList';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import Backdrop from 'components/Backdrop';
import AdvanceFilterContext from 'Context/AdvanceFilterContext';
import SearchBoxCompany from 'components/SearchBoxCompany';
import SearchBarContext from 'Context/SearchBarContext';

const CompanyView = () => {
    const [advancedFilterResultData, setAdvancedFilterResultData] = useState()
    const [jobTypeSelected, setJobTypeSelected] = useState()
    const [skillSelected, setSkillSelected] = useState()
    const [experienceSelected, setExperienceSelected] = useState()
    const [rateSelected, setRateSelected] = useState()
    const [locationSelected, setLocationSelected] = useState()
    const [backdropAdvanceSearchUserActive, setBackdropAdvanceSearchUserActive] = useState()
    const showData = useRef()

    let {
        isPaginationReset,
        resetPage,
        totalSearchBarUser,
        onLoadSearchUser,
        searchUserResultData,
        backdropSearchUserActive,
    } = useContext(SearchBarContext)

    const {
        onAdvanceFilterUserClick,
        filterUserClicked,
    } = useContext(AdvanceFilterContext)


    // GET RESULT FROM THE ADVANCED USER FILTER
    const advanceFilter = async (page) => {
        if (!page){
            page = 1
        } else{
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
            searchUserResultData.current = null
        }
    }

    const advanceFilterPageClicked = async (page) => {
        setBackdropAdvanceSearchUserActive(true)
        if (!page){
            page = 1
        } else{
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
            showData.current = data
            searchUserResultData.current = null
        }
        setBackdropAdvanceSearchUserActive(false)
    }

    const filteredData = (data) => {
        setSkillSelected(data["skill"])
        setExperienceSelected(data["experience"])
        setRateSelected(data["rate"])
        setLocationSelected(data["location"])
        setJobTypeSelected(data["type"])
    }

    useEffect(() => {   
        advanceFilter();
    }, [skillSelected, experienceSelected, rateSelected, locationSelected, jobTypeSelected])

    const onButtonShowFilterClicked = () => {
        searchUserResultData.current = null
        showData.current = advancedFilterResultData
        if (window.innerWidth < 768) {
            onAdvanceFilterUserClick()
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

  return (
        <div className='container-search'>
            <div className={`${filterUserClicked ? "block" : "hidden" }`}>
                <AdvanceUserFilterBar barClicked={ onAdvanceFilterUserClick } 
                    getAdvancedFilterData={advanceFilter} 
                    filteredData={filteredData}
                    buttonShowClicked={() => onButtonShowFilterClicked()}
                    totalUserCaptured={advancedFilterResultData}
                    resetPage={resetPage} // RESET PAGINATION NUMBER TO 1
                    includeRate={true}
                />
            </div> 
                
            <div className='flex w-screen mt-6 max-sm:mt-2 items-center flex-col max-lg:mt-0'>
                <div className='search-input'>
                    <ul>
                        <li className='max-md:hidden'>
                            <SearchBoxCompany />
                        </li>
                        <li className='icon-search max-md:hidden'><ContentPasteSearchIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        <Tooltip className='max-xl:hidden'  TransitionComponent={Zoom} placement="right" title="Advance Filter" arrow>
                            <li className='icon-search' onClick={ onAdvanceFilterUserClick }><TuneIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        </Tooltip>
                    </ul>
                </div>
                
                {searchUserResultData.current ?
                <UsersList 
                    filterClicked={filterUserClicked} 
                    searchData={searchUserResultData.current} 
                    totalUser={totalSearchBarUser.current}
                    loadUserSearch={onLoadSearchUser}
                    paginationReset={isPaginationReset}
                />
                :
                showData.current
                ?   
                // FOR ADVANCE SEARCH
                <UsersList
                    filterClicked={filterUserClicked}
                    searchData={showData.current["data"]}
                    totalUser={showData.current["total_user"]}
                    loadUserSearch={advanceFilterPageClicked}
                    paginationReset={isPaginationReset}
                />
                :
                // FOR NON SEARCH
                <UsersList 
                    filterClicked={filterUserClicked} 
                    searchData={searchUserResultData.current} 
                    totalUser={totalSearchBarUser.current}
                    loadUserSearch={onLoadSearchUser}
                    paginationReset={isPaginationReset}
                />
                }
            </div>
            {(backdropAdvanceSearchUserActive || backdropSearchUserActive) && <Backdrop />}
        </div>
    )
}

export default CompanyView