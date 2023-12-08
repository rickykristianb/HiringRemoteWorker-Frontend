import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import EmailContext from '../Context/EmailContext'
import AuthContext from '../Context/AuthContext'

const InboxPagination = (props) => {

    const DOTS = "..."

    const { 
        totalInboxMessage, 
        onLoadMessages, 
        messages, 
        sentMessages,
        deletedMessages,
        onCheckSentMessages, 
        totalSentMessage, 
        onCheckDeletedMessages,
        totalDeletedMessage } = useContext(EmailContext)
    const [isCLicked, setIsClicked] = useState(false)
    const [isDisabled, setIsDisabled] = useState()
    const [totalPages, setTotalPages] = useState(0)
    const page = useRef(1)  // default page 1
    const maxNumber = 5;


    const onClickPageNumber = (item) => {
        // When user click the number on the pagination, load the message (call api) based on the type
        console.log(props.message_type)
        if (props.message_type === "inbox"){
            onLoadMessages(item)
        } else if (props.message_type === "sent"){
            console.log("SENT");
            onCheckSentMessages(item)
        } else if (props.message_type === "deleted"){
            onCheckDeletedMessages(item)
        }
        page.current = item  // set the current page that user has clicked
        setIsClicked(item) // set what item is clicked. This is to defined the color of the item number
        setIsDisabled(item)
    }

    const getTotalPages = () => {
        const totalMessagePerPage = 5
        let totalPages = 0

        if (props.message_type === "inbox"){
            totalPages = Math.ceil(totalInboxMessage / totalMessagePerPage)
        } else if (props.message_type === "sent"){
            totalPages = Math.ceil(totalSentMessage / totalMessagePerPage)
        } else if (props.message_type === "deleted"){
            totalPages = Math.ceil(totalDeletedMessage / totalMessagePerPage)
        }
        console.log(totalPages);
        setTotalPages(totalPages)

    }

    useEffect(() => {
        getTotalPages()
    }, [props.message_type, messages, sentMessages, deletedMessages])


    const loadPreviousNextData = (buttonType, type) => {

        switch (buttonType){
            case "prev":
                if (page.current > 1){
                    if (type.type === "inbox"){
                        onLoadMessages(page.current - 1)
                    } else if (type.type === "sent"){
                        onCheckSentMessages(page.current - 1)
                    } else if (type.type === "deleted"){
                        onCheckDeletedMessages(page.current - 1)
                    }
                    page.current = page.current - 1
                    setIsClicked(page.current)
                }
                break;

            case "next":
                if (page.current < totalPages){
                    if (type.type === "inbox"){
                        onLoadMessages(page.current + 1)
                    } else if (type.type === "sent"){
                        onCheckSentMessages(page.current + 1)
                    } else if (type.type === "deleted"){
                        onCheckDeletedMessages(page.current + 1)
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
                <>
                <a disabled={isDisabled === 1} onClick={() => loadPreviousNextData("prev", type)} className='prev-next-button'>&lt;&lt; Prev</a>
                    <ul className='pagination-number'>
                        {paginateNumber.map((item, index) => (
                            <li key={index} className={
                                isCLicked === false ? 
                                    (item === 1 ? 
                                        "page-number-clicked" 
                                        : "number-li") 
                                    : isCLicked === item ? 
                                        "page-number-clicked" 
                                        : "number-li"
                                    } 
                                onClick={item === "..."? null : () => onClickPageNumber(item)} >{item}</li>
                        ))}
                    </ul>
                <a disabled={isDisabled === totalPages} onClick={() => loadPreviousNextData("next", type)} className='prev-next-button'>Next &gt;&gt;</a>
                </>              
                }
            </>
            
        )
    }

    const onCheckPaginationConditional = (type) => {
        const paginateNumber = [];
        
        if (totalPages <= maxNumber || (page.current >= totalPages - maxNumber && totalPages <= 10)){
            // console.log("MASK 1");
            for(let i=1; i <= totalPages; i++){
                paginateNumber.push(i)
            }
            return (
                pageNumberList({paginateNumber, totalPages, type})
            )
        } else if (page.current < maxNumber){
            // console.log("MASUK 2");
            for(let i=1; i <= maxNumber; i++){
                paginateNumber.push(i)
                if (i == 5){
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
            // console.log("MASK 4");
            paginateNumber.push(1)
            paginateNumber.push(DOTS)
            for(let i = totalPages-5 ; i <= totalPages; i++){
                paginateNumber.push(i)
            }
            return (
                pageNumberList({paginateNumber, totalPages, type})
            )
        } else if(page.current >= maxNumber && page.current < totalPages - maxNumber){
            // console.log("MASUK 5");
            const siblings = 2
            paginateNumber.push(1)
            paginateNumber.push(DOTS)
            for(let i = page.current - siblings ; i <= page.current + siblings; i++){
                paginateNumber.push(i)
            }
            paginateNumber.push(DOTS)
            paginateNumber.push(totalPages)
            console.log(paginateNumber);

            return (
                pageNumberList({paginateNumber, totalPages, type})
            )
        } 
    }

  return (

    <div className='pagination-container'>
        {onCheckPaginationConditional({type: props.message_type})}
    </div>
  )
}

export default InboxPagination