import { createContext, useCallback, useContext, useState } from "react";
import AuthContext from './AuthContext';

const NotificationContext = createContext();
export default NotificationContext;

export const NotificationProvider = ({ children }) => {

    const [totalUnreadNotification, setTotalUnreadNotification] = useState(0)
    let { authToken } = useContext(AuthContext)
    const userToken = authToken?.access
    
    const onLoadTotalUnreadNotification = useCallback(async() => {
        const response = await fetch(`/api/job/get_total_unread_notification/`,{
          method: "GET",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userToken}`
          }
        });
        const data = await response.json()
        if (response.ok){
          setTotalUnreadNotification(data)
        }
      })

      const contextData = {
        onLoadTotalUnreadNotification: onLoadTotalUnreadNotification,
        totalUnreadNotification: totalUnreadNotification
      }

      return (
        <NotificationContext.Provider value={contextData}>
            { children }
        </NotificationContext.Provider>
    )
}

