import React, { useContext, useEffect, useRef, useState } from 'react'
import JobsList from 'components/JobsList'
import Backdrop from 'components/Backdrop';
import AdvanceJobFilterBar from 'components/AdvanceJobFilterBar';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationContext from 'Context/NotificationContext';
import CompanyLoginAction from 'components/CompanyLoginAction';
import SearchBoxPersonal from 'components/SearchBoxPersonal';
import SearchBarContext from 'Context/SearchBarContext';
import AdvanceFilterContext from 'Context/AdvanceFilterContext';

const PersonalView = () => {

    let {
        searchJobResultData,
        onLoadJobSearch,
        isPaginationReset,
        resetPage,
        backdropSearchJobActive,
        totalSearchBarJob
    } = useContext(SearchBarContext)

    const {
        onAdvanceFilterJobClick,
        filterJobClicked,
    } = useContext(AdvanceFilterContext)

    const [skillSelected, setSkillSelected] = useState()
    const [experienceSelected, setExperienceSelected] = useState()
    const [locationSelected, setLocationSelected] = useState()
    const [jobTypeSelected, setJobTypeSelected] = useState()
    const [advancedFilterResultData, setAdvancedFilterResultData] = useState()
    const [backdropActive, setBackdropActive] = useState(false)
    const showData = useRef()

    const {onLoadTotalUnreadNotification} = useContext(NotificationContext)

    useEffect(() => {
        onLoadTotalUnreadNotification()
    }, [])

    
    // ADVANCE FILTER ----------------------------------------


    const advanceFilter = async (page) => {
        if (!page){
            page = 1
        } else{
            page = page.page
        }
        const response = await fetch(`/api/job/get_advance_filter_result/?skill=${encodeURIComponent(skillSelected)}&experience=${experienceSelected}&location=${locationSelected}&type=${jobTypeSelected}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        const data = await response.json()

        if (response.ok){
            setAdvancedFilterResultData(data)
            searchJobResultData.current = null

        }
    }

    const advanceFilterPageClicked = async (page) => {    
        setBackdropActive(true)
        if (!page){
            page = 1
        } else{
            page = page
        }
        const response = await fetch(`/api/job/get_advance_filter_result/?skill=${encodeURIComponent(skillSelected)}&experience=${experienceSelected}&location=${locationSelected}&type=${jobTypeSelected}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        const data = await response.json()
        if (response.ok){
            showData.current = data
            searchJobResultData.current = null
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
        searchJobResultData.current = null
        showData.current = advancedFilterResultData
        if (window.innerWidth < 768) {
            onAdvanceFilterJobClick()
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className='container-search'>
            <div className={`${filterJobClicked ? "blocked" : "hidden"}`}>
                <AdvanceJobFilterBar barClicked={ onAdvanceFilterJobClick } 
                    getAdvancedFilterData={advanceFilter} 
                    filteredData={filteredData}
                    buttonShowClicked={() => onButtonShowFilterClicked()}
                    totalUserCaptured={advancedFilterResultData}
                    resetPage={resetPage} // RESET PAGINATION NUMBER TO 1
                    includeRate={false}
                />
            </div>
            <div className='flex w-screen mt-6 max-sm:mt-2 items-center flex-col max-lg:mt-0'>
                <div className='search-input'>
                    <ul>
                        <li className='max-md:hidden'>
                            <SearchBoxPersonal />
                        </li>
                        <li className='icon-search max-md:hidden'><ContentPasteSearchIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        <Tooltip className='max-xl:hidden'  TransitionComponent={Zoom} placement="right" title="Advance Filter" arrow>
                            <li className='icon-search' onClick={ onAdvanceFilterJobClick }><TuneIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        </Tooltip>
                    </ul>
                </div>
                
                {
                searchJobResultData.current ?
                <JobsList
                // For search bar
                    filterClicked={filterJobClicked} 
                    searchData={searchJobResultData.current}
                    totalUser={totalSearchBarJob.current}
                    paginationReset={isPaginationReset}
                    loadJobSearch={onLoadJobSearch}
                />
                :
                showData.current 
                ?
                <JobsList
                // For advance search
                    filterClicked={filterJobClicked} 
                    searchData={showData.current["data"]}
                    totalUser={showData.current["total_user"]}
                    paginationReset={isPaginationReset}
                    loadJobSearch={advanceFilterPageClicked}
                />
                :
                <JobsList
                // For without search
                    filterClicked={filterJobClicked} 
                    searchData={searchJobResultData.current}
                    totalUser={totalSearchBarJob.current}
                    paginationReset={isPaginationReset}
                    loadJobSearch={onLoadJobSearch}
                />
                }
                <div className='md:hidden fixed bottom-0  w-screen h-[60px] bg-dark-basic text-white flex justify-center items-center font-bold max-xl:cursor-pointer z-2'
                    onClick={ onAdvanceFilterJobClick }>
                        Advance Filter
                </div>
            </div>
            {backdropActive && <Backdrop />}
            {backdropSearchJobActive && <Backdrop />}
            <CompanyLoginAction />
        </div>
    )
}

export default PersonalView