import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import EmailContext from '../Context/EmailContext'
import AuthContext from '../Context/AuthContext'

const Pagination = (props) => {

    const DOTS = "..."

    const { 
        onLoadMessages, 
        messages, 
        sentMessages,
        deletedMessages,
        onCheckSentMessages, 
        onCheckDeletedMessages } = useContext(EmailContext)

    const [isCLicked, setIsClicked] = useState(false)
    const [isDisabled, setIsDisabled] = useState()
    const [totalPages, setTotalPages] = useState(0)
    const [pageResetNumberOne, setPageResetNumberOne] = useState(false)
    const page = useRef(1)  // default page 1
    const maxNumber = 2;
    const countTotalPages = useRef(0)


    const onClickPageNumber = (item) => {
        // When user click the number on the pagination, load the message (call api) based on the type
        setPageResetNumberOne(false) // DO NOT RESET PAGINATION NUMBER TO 1
        if (props.type === "inbox"){
            onLoadMessages(item)
        } else if (props.type === "sent"){
            onCheckSentMessages(item)
        } else if (props.type === "deleted"){
            onCheckDeletedMessages(item)
        } else if (props.type === "userList"){
            props.loadUserList(item)
        } else if (props.type === "userSearchList"){
            props.loadUserSearchList({page: item})
        } else if (props.type === "jobPosted"){
            props.onLoadJobPostedPaginate({page: item})
        } else if (props.type === "jobSearchList"){
            props.loadJobSearchList(item)
        } else if (props.type === "allJobList"){
            props.loadJobList({page: item})
        }
        page.current = item  // set the current page that user has clicked
        setIsClicked(item) // set what item is clicked. This is to defined the color of the item number
        setIsDisabled(item)
    }

    const getTotalPages = () => {
        let totalDataPerPage = 0;

        if (props.type === "userList" || props.type === "userSearchList") {
            totalDataPerPage = 12     // need to match with the backend pagination setting, check your UserListResultsSetPagination page size.
        } 
        if (props.type === "allJobList" || props.type == "jobSearchList"){
            totalDataPerPage = 12
        }
        if (props.type === "jobPosted"){
            totalDataPerPage = 5
        }
        if (props.type !== "allJobList" && props.type !== "userList" && props.type !== "userSearchList" && props.type !== "jobSearchList" && props.type !== "jobPosted"){
            totalDataPerPage = 5     // need to match with the backend pagination setting, check your MessagesResultsSetPagination page size.
        }
        
        countTotalPages.current = Math.ceil(props.totalData / totalDataPerPage)
        setTotalPages(countTotalPages.current)
    }

    useEffect(() => {
        getTotalPages()
    }, [props.type, props.totalData, messages, sentMessages, deletedMessages])
    
    useEffect(() => {
        page.current = 1
    }, [props.searchData])


    useEffect(() => {
        page.current = 1
        onCheckPaginationConditional({type: props.type})
        setPageResetNumberOne(true)
    }, [props.paginationReset])


    const loadPreviousNextData = (buttonType, type) => {

        switch (buttonType){
            case "prev":
                if (page.current > 1){
                    setPageResetNumberOne(false) // DO NOT RESET PAGINATION NUMBER TO 1
                    if (type.type === "inbox"){
                        onLoadMessages(page.current - 1)
                    } else if (type.type === "sent"){
                        onCheckSentMessages(page.current - 1)
                    } else if (type.type === "deleted"){
                        onCheckDeletedMessages(page.current - 1)
                    } else if (type.type === "userList"){
                        props.loadUserList(page.current - 1)
                    } else if (type.type === "userSearchList"){
                        props.loadUserSearchList({page: page.current - 1})
                    } else if (type.type === "jobPosted"){
                        props.onLoadJobPostedPaginate({page: page.current - 1})
                    } else if (type.type === "allJobList"){
                        props.loadJobList({page: page.current - 1})
                    } else if (type.type === "jobSearchList"){
                        props.loadJobSearchList(page.current - 1)
                    }
                    page.current = page.current - 1
                    setIsClicked(page.current)
                }
                break;

            case "next":
                if (page.current < totalPages){
                    setPageResetNumberOne(false) // DO NOT RESET PAGINATION NUMBER TO 1
                    if (type.type === "inbox"){
                        onLoadMessages(page.current + 1)
                    } else if (type.type === "sent"){
                        onCheckSentMessages(page.current + 1)
                    } else if (type.type === "deleted"){
                        onCheckDeletedMessages(page.current + 1)
                    } else if (type.type === "userList"){
                        props.loadUserList(page.current + 1)
                    } else if (type.type === "userSearchList"){
                        props.loadUserSearchList({page: page.current + 1})
                    } else if (type.type === "jobPosted"){
                        props.onLoadJobPostedPaginate({page: page.current + 1})
                    } else if (type.type === "allJobList"){
                        props.loadJobList({page: page.current + 1})
                    }else if (type.type === "jobSearchList"){
                        props.loadJobSearchList(page.current + 1)
                    }
                    page.current = page.current + 1
                    setIsClicked(page.current)
                }
                break;
        }        
    }

    const pageNumberList = ({paginateNumber, totalPages, type}) => {
        return (
            <>  
                {totalPages !== 0 
                &&
                <div className='flex justify-between sm:gap-[250px] max-sm:px-4 max-sm:w-screen'>
                <a disabled={isDisabled === 1} onClick={() => loadPreviousNextData("prev", type)} className='cursor-pointer'>&lt;&lt; Prev</a>
                <ul className='flex gap-2 justify-center max-sm:gap-4'>
                    {paginateNumber.map((item, index) => (
                        <li key={index} className={
                            pageResetNumberOne ?  // IF CHANGE THE FILTER, RESET PAGINATION NUMBER TO 1
                                item === 1 ?
                                        "page-number-clicked max-sm:bg-white max-sm:w-0 max-sm:p-0 max-sm:text-dark-basic max-sm:text-2xl"
                                        :
                                        "number-li max-sm:w-0 max-sm:bg-white max-sm:p-0"
                                :
                            isCLicked === false ? 
                                (item === 1 ? 
                                    "page-number-clicked max-sm:bg-white max-sm:w-0 max-sm:p-0 max-sm:text-dark-basic max-sm:text-2xl" 
                                    : "number-li max-sm:w-0 max-sm:bg-white max-sm:p-0") 
                                : isCLicked === item ? 
                                    "page-number-clicked max-sm:bg-white max-sm:w-0 max-sm:p-0 max-sm:text-dark-basic max-sm:text-2xl" 
                                    : "number-li max-sm:w-0 max-sm:bg-white max-sm:p-0"
                                } 
                            onClick={item === "..."? null : () => onClickPageNumber(item)} >{item}</li>
                    ))}
                </ul>
                <a disabled={isDisabled === totalPages} onClick={() => loadPreviousNextData("next", type)} className='cursor-pointer'>Next &gt;&gt;</a>
                </div>              
                }
            </>
            
        )
    }

    const onCheckPaginationConditional = (type) => {
        const paginateNumber = [];
        
        if (totalPages <= maxNumber || (page.current >= totalPages - maxNumber && totalPages <= 10)){
            for(let i=1; i <= totalPages; i++){
                paginateNumber.push(i)
            }
            return (
                pageNumberList({paginateNumber, totalPages, type})
            )
        } else if (page.current < maxNumber){
            for(let i=1; i <= maxNumber; i++){
                paginateNumber.push(i)
                if (i === 5){
                    paginateNumber.push(DOTS)
                    paginateNumber.push(totalPages)
                }
            }
            return (
                pageNumberList({paginateNumber, totalPages, type})
            )
        } if (page.current === totalPages - 5){
            paginateNumber.push(1)
            paginateNumber.push(DOTS)
            for(let i = page.current - 1 ; i <= totalPages; i++){
                paginateNumber.push(i)
            }
            return (
                pageNumberList({paginateNumber, totalPages, type})
            )
        } 
        
        else if(page.current >= maxNumber && page.current >= totalPages - 5){
            paginateNumber.push(1)
            paginateNumber.push(DOTS)
            for(let i = totalPages-5 ; i <= totalPages; i++){
                paginateNumber.push(i)
            }
            return (
                pageNumberList({paginateNumber, totalPages, type})
            )
        } else if(page.current >= maxNumber && page.current < totalPages - maxNumber){
            const siblings = 2
            paginateNumber.push(1)
            paginateNumber.push(DOTS)
            for(let i = page.current - siblings ; i <= page.current + siblings; i++){
                paginateNumber.push(i)
            }
            paginateNumber.push(DOTS)
            paginateNumber.push(totalPages)

            return (
                pageNumberList({paginateNumber, totalPages, type})
            )
        } 
    }

  return (
    <div className='flex gap-[200px] justify-center items-center'>
        {onCheckPaginationConditional({type: props.type})}
    </div>
  )
}

export default Pagination