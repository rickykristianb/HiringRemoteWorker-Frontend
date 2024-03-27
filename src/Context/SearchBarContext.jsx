import { createContext, useState, useEffect, useRef } from "react";

const SearchBarContext = createContext();

export default SearchBarContext;

export const SearchBarProvider = ({children}) => {

    const [searchResultSearchBarData, setSearchResultSearchBarData] = useState()
    const [searchJobBarValue, setSearchJobBarValue] = useState()
    const [searchUserBarValue, setSearchUserBarValue] = useState()
    const [searchBarEmpTypeData, setSearchBarEmpTypeData] = useState([])
    const [searchBarSkillsData, setSearchBarSkillsData] = useState([])
    const [searchBarLocationData, setSearchLocationData] = useState([])
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [isPaginationReset, setIsPaginationReset] = useState(false)
    const loading = useRef(false)
    const showSearchJobBarData = useRef()
    const showSearchUserBarData = useRef()
    const totalSearchBarJob = useRef()
    const totalSearchBarUser = useRef()
    const searchJobResultData = useRef("")
    const searchUserResultData = useRef("")
    const [backdropSearchUserActive, setBackdropSearchUserActive] = useState(false)
    const [backdropSearchJobActive, setBackdropSearchJobActive] = useState(false)

    const onLoadSearchBarData = async() => {
        const response = await fetch("/api/user/search_bar_data/", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            }
        })
        const data = await response.json()
        if (response.ok){
            setSearchResultSearchBarData(data)
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
    }, [])

    const onChangeSearchJobBox = async(e) => {
        setIsSearchBarOpen(true)
        setSearchJobBarValue(e.target.value)

        const filteredEmpType = searchResultSearchBarData["emp_type"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredSkills = searchResultSearchBarData["skills"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredLocation = searchResultSearchBarData["location"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setSearchBarEmpTypeData(filteredEmpType)
        setSearchBarSkillsData(filteredSkills)
        setSearchLocationData(filteredLocation)
        if (searchBarEmpTypeData.length === 0 && searchBarSkillsData.length === 0 && searchBarLocationData.length === 0){
            setIsSearchBarOpen(false)
        }
    }

    const onSearchKeyJobEnter = async (e) => {
        if (e.key === "Enter"){
            setIsSearchBarOpen(false)
            onClickedSearchJobItem({item:searchJobBarValue, page:1})
        }
    }

    const onLoadJobSearch = async(page) => {
        try{
            setBackdropSearchJobActive(true)
            let item = searchJobBarValue
            const response = await fetch(`/api/job/get_search_job_result/?search=${item}&page=${page}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                },
            })
            const data = await response.json()
            if (response.ok){
                searchJobResultData.current = data["data"]
            }
            totalSearchBarJob.current = data["total_user"]
            setBackdropSearchUserActive(false)
        } catch (error){
            console.error("Encounter an error: ", error);
        } finally {
            setBackdropSearchJobActive(false)
            window.scrollTo(0,0);
        }
    }

    useEffect(() => {
        onLoadJobSearch(1)
    }, [])

    // GET RESULT FROM THE SEARCH BAR FILTER
    const onClickedSearchJobItem = async({item, page}) => {
        setBackdropSearchJobActive(true)
        setSearchJobBarValue(item)
        loading.current = true
        const response = await fetch(`/api/job/get_search_job_result/?search=${item}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        const data = await response.json()
        if (response.ok){
            searchJobResultData.current = data["data"]
            showSearchJobBarData.current = null   // If basic search applied, filteredUser is cleared so the basic search only will be applied
            resetPage()  // RESET PAGINATION NUMBER TO 1
            totalSearchBarJob.current = data["total_user"]
        }
        loading.current = false
        window.scrollTo(0,0);
        setBackdropSearchJobActive(false)
    }



    // FOR COMPANY ---------------------------------------------------------------------------
    const onChangeSearchUserBox = async(e) => {
        setIsSearchBarOpen(true)
        setSearchUserBarValue(e.target.value)

        const filteredEmpType = searchResultSearchBarData["emp_type"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredSkills = searchResultSearchBarData["skills"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredLocation = searchResultSearchBarData["location"].filter((item) =>{
            return item.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setSearchBarEmpTypeData(filteredEmpType)
        setSearchBarSkillsData(filteredSkills)
        setSearchLocationData(filteredLocation)
        if (searchBarEmpTypeData.length === 0 && searchBarSkillsData.length === 0 && searchBarLocationData.length === 0){
            setIsSearchBarOpen(false)
        }
    }

    const onSearchKeyUserEnter = async (e) => {
        if (e.key === "Enter"){
            setIsSearchBarOpen(false)
            onClickedSearchUserItem({item:searchUserBarValue, page:1})
        }
    }

    const onLoadSearchUser = async({page}) => {
        try{
            setBackdropSearchUserActive(true)
            let item = searchUserBarValue
            const response = await fetch(`/api/user/search_result/?page=${page}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(item)
            })
            const data = await response.json()
            if (response.ok){
                searchUserResultData.current = data["data"]
            }
            totalSearchBarUser.current = data["total_user"]
            setBackdropSearchUserActive(false)
        } catch (error){
            console.error("An unexpected error occurred: ", error);
        } finally {
            setBackdropSearchUserActive(false)
            window.scrollTo(0,0);
        }
    }

    // GET RESULT FROM THE SEARCH BAR FILTER
    const onClickedSearchUserItem = async({item: item, page: page}) => {
        setSearchUserBarValue(item)
        setBackdropSearchUserActive(true)
        const response = await fetch(`/api/user/search_result/?page=${page}`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(item)
        })
        const data = await response.json()
        if (response.ok){
            searchUserResultData.current = data["data"]
            showSearchUserBarData.current = null   // If basic search applied, filteredUser is cleared so the basic search only will be applied
            resetPage()  // RESET PAGINATION NUMBER TO 1
        }
        totalSearchBarUser.current = data["total_user"]
        setBackdropSearchUserActive(false)
        window.scrollTo(0,0);
    }


    const resetPage = () => {
        // RESET PAGINATION NUMBER TO 1
        setIsPaginationReset(true)
        setTimeout(() => {
            setIsPaginationReset(false)
        }, 1)
    }

    let contextData = {
        searchResultSearchBarData,
        searchJobBarValue,
        searchUserBarValue,
        searchBarEmpTypeData,
        searchBarSkillsData,
        searchBarLocationData,
        isSearchBarOpen,
        onLoadSearchBarData,
        onLoadJobSearch,
        onChangeSearchJobBox,
        onSearchKeyJobEnter,
        onSearchKeyUserEnter,
        onClickedSearchJobItem,
        showSearchJobBarData,
        isPaginationReset,
        resetPage,
        searchJobResultData,
        backdropSearchUserActive,
        totalSearchBarJob,
        totalSearchBarUser,
        onLoadSearchUser,
        backdropSearchJobActive,
        setBackdropSearchJobActive,
        onClickedSearchUserItem,
        searchUserResultData,
        onChangeSearchUserBox
    }

    return (
        <SearchBarContext.Provider value={contextData}>
            {children}
        </SearchBarContext.Provider>
    )
}