import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import AuthContext from "./AuthContext";

const EmailContext = createContext();

export default EmailContext;

export const EmailProvider = ({ children }) => {
    
    let userToken = useRef()

    let {authToken} = useContext(AuthContext)
    if (authToken){
        userToken.current = authToken.access
    }
    
    const [messages, setMessages] = useState([])
    const [sentMessages, setSentMessages] = useState([])
    const [deletedMessages, setDeletedMessages] = useState([])
    const [isVisibile, setIsVisible] = useState(false)
    const [messageData, setMessageData] = useState([])
    const [messageSentData, setMessageSentData] = useState([])
    const [isRead, setIsRead] = useState([])
    const [isReadDeletedMessage, setIsReadDeletedMessage] = useState([])
    const [messageUnreadCount, setMessageUnreadCount] = useState()
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [messageDetailData, setMessageDetailData] = useState()
    const [alertDeleteResponse, setAlertDeleteResponse] = useState()
    const [alertDeleteForeverResponse, setAlertDeleteForeverResponse] = useState()
    const [alertDeleteSentMessage, setAlertDeleteSentMessage] = useState()
    const [alertResponse, setAlertResponse] = useState()
    const [isReply, setIsReply] = useState(false)
    const [totalInboxMessage, setTotalInboxMessage] = useState(0)
    const [totalSentMessage, setTotalSentMessage] = useState(0)
    const [totalDeletedMessage, setTotalDeletedMessage] = useState(0)
    // const totalInboxMessage = useRef(0)

    const messageId = useRef()

    // LOAD INBOX MESSAGES ---------------------------------------------------------------------
    const onLoadMessages = async(page) => {
        if (!page){
            page = 1
        }
        const response = await fetch(`/api/user/get_inbox_pagination/?page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken.current}`
            },
        })

        const data = await response.json()
        if (response.status === 200){
            setMessages(data["data"])
            setTotalInboxMessage(data["total_inbox"])
        }
    }

    
    const unreadMessageCount = async() => {
        if (userToken.current){
            console.log("MASUK SINI KAH????");
            const response = await fetch("/api/user/count_unread_messages/", {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userToken.current}`
                }
            })
            const data = await response.json()
            setMessageUnreadCount(data)
        }
    }

    useEffect(() => {
        unreadMessageCount()
    },[userToken.current])

    // useMemo(() => {
    //     const count = messages.filter(message => !message.is_read).length
    //     setMessageUnreadCount(count)
    // }, [messages])

    const onLoadBody = (body) => {
        if (body.length > 95){
            return <p>{body.slice(0, 95)}...</p>
        } else {
            return body
        }
    }

    const onMessageClicked = async ({index, type}) => {
        let messageDetailData;
        switch (type){
            case "inbox":
                messageDetailData = {
                    data: messages[index],
                    index: index
                }
                messageId.current = messages[index]["id"];
                break;
            case "sent":
                messageDetailData = {
                    data: sentMessages[index],
                    index: index
                };
                messageId.current = sentMessages[index]["id"];
                break;
            case "deleted":
                messageDetailData = {
                    data: deletedMessages[index],
                    index: index
                }
                messageId.current = deletedMessages[index]["id"];
                break;
        }
        const response = await fetch(`/api/user/read_message/${messageId.current}/`,{
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken.current}`
            }
        })
        const data = await response.json()

        if (type === "deleted"){
                setIsReadDeletedMessage((prevValue) => ([
                    index,
                    ...prevValue
                ]))
        } else if (response.status === 202){
            if (!isRead.includes(index) && messageUnreadCount >= 1){
                setIsRead((prevValue) => ([
                    ...prevValue,
                    index
                ]))       
                setMessageUnreadCount((prevValue) => (prevValue - 1))             
            }
        }
        setIsVisible(!isVisibile)
        setMessageData(messageDetailData)
        setMessageSentData(messageDetailData)
    }

    // DELETE MESSAGES -------------------------------------------------------------------------------

    const onDeleteMessage = async(index) => {
        console.log(index);
        console.log(messages[index]);
        const id = messages[index].id
        const response = await fetch(`/api/user/delete_message/${id}/`,{
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken.current}`
            }
        });

        const data = await response.json()
        if (response.status === 202){
            setAlertDeleteResponse(data)
            setIsVisible(false)           
            onLoadMessages()
            setIsRead([])
            setIsReadDeletedMessage([])
        }
    }

    useEffect(() => {
        setAlertResponse()
    }, [onDeleteMessage])

    
    // DELETE MESSAGE FOREVER -------------------------------------------------------------------------
    const onDeleteMessageForever = async(index) => {
        const id = deletedMessages[index].id
        const response = await fetch(`/api/user/delete_message_forever/${id}/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken.current}`
            }
        })
        const data = await response.json()

        if (response.ok){           
            onCheckDeletedMessages()
            setIsRead([])
            setIsReadDeletedMessage([])
            setAlertDeleteForeverResponse(data)
            setIsVisible(false)    
        }
    }

    // ON LOAD SENT MESSAGES ---------------------------------------------------------------------------
    const onCheckSentMessages = async(page) => {
        if (!page){
            page = 1
        }
        const response = await fetch(`/api/user/get_sent_message_pagination/?page=${page}`,{
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken.current}`
            }
        })

        const data = await response.json()
        if (response.status === 200) {
            console.log(data);
            setSentMessages(data["data"])
            setTotalSentMessage(data["total_sent_message"])
        }
    }

    // DELETE SENT MESSAGES ----------------------------------------------------------------------------------
    const onDeleteSentMessages = async(index) => {
        const id = sentMessages[index].id
        const response = await fetch(`/api/user/delete_sent_message/${id}/`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken.current}`
            }
        })

        const data = await response.json()
        if (response.ok){
            setAlertDeleteSentMessage(data)
            setIsVisible(false)           
            onCheckSentMessages()
            setIsRead([])
            setIsReadDeletedMessage([])
        }
    }

    // LOAD DELETED MESSAGES -------------------------------------------------------------------------------
    const onCheckDeletedMessages = async(page) => {
        if (!page){
            page = 1
        }
        const response = await fetch(`/api/user/get_deleted_message_pagination/?page=${page}`,{
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken.current}`
            }
        })

        const data = await response.json()
        if (response.status === 200) {
            setDeletedMessages(data["data"])
            setTotalDeletedMessage(data["total_deleted_message"])
        }
    }

    // REPLY MESSAGE -----------------------------------------------------------------------------------------
    const onSendReplyMessage = async(data) => {
        console.log("DATA",data);
        const response = await fetch("/api/user/reply_email/", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userToken.current}`
          },
          body: JSON.stringify(data)
        })
        const responseData = await response.json()
        if (response.status === 201){
          setAlertResponse(responseData)          
          setIsReply(false)
        } else {
          setAlertResponse(responseData)
        }
      }

    const onMessageDetailCloseClicked = () => {
        setIsVisible(!isVisibile)
    }

    // const getTotalInbox = async() => {
    //     const response = await fetch("/api/user/total_inbox_message/", {
    //         method: "GET",
    //         headers: {
    //             "content-type": "application/json",
    //             "Authorization": `JWT ${userToken.current}`
    //         }
    //     })

    //     const data = await response.json()
    //     if (response.ok){
    //         setTotalInboxMessage(data["total"])
    //     }
    // }


    const contextData = {
        onLoadMessages:onLoadMessages,
        messages:messages,
        sentMessages:sentMessages,
        deletedMessages:deletedMessages,
        isVisibile:isVisibile,
        messageData:messageData,
        onSendReplyMessage:onSendReplyMessage,
        isRead:isRead,
        isReadDeletedMessage:isReadDeletedMessage,
        setIsRead:setIsRead,
        messageUnreadCount:messageUnreadCount,
        onLoadBody:onLoadBody,
        onMessageClicked:onMessageClicked,
        onMessageDetailCloseClicked:onMessageDetailCloseClicked,
        onDeleteMessage:onDeleteMessage,
        onDeleteSentMessages:onDeleteSentMessages,
        onDeleteMessageForever:onDeleteMessageForever,
        deleteInProgress:deleteInProgress,
        onCheckSentMessages:onCheckSentMessages,
        onCheckDeletedMessages:onCheckDeletedMessages,
        alertDeleteForeverResponse:alertDeleteForeverResponse,
        setAlertDeleteForeverResponse:setAlertDeleteForeverResponse,
        alertDeleteResponse, 
        setAlertDeleteResponse,
        alertDeleteSentMessage,
        setAlertDeleteSentMessage,
        setIsVisible,
        alertResponse,
        setAlertResponse,
        isReply, 
        setIsReply,
        // getTotalInbox,
        totalInboxMessage,
        unreadMessageCount,
        totalSentMessage,
        totalDeletedMessage
    }

    return (
        <EmailContext.Provider value={contextData}>
            { children }
        </EmailContext.Provider>
    )
}