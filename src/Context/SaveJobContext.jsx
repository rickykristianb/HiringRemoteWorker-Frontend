import { createContext, useState, useEffect, useRef, useContext } from "react";
import AuthContext from "./AuthContext";

const SaveJobContext = createContext();

export default SaveJobContext;

export const SaveJobProvider = ({children}) => {

    const [serverResponse, setServerResponse] = useState()
    const [jobIsSaved, setJobIsSaved] = useState(false)

    const { authToken} = useContext(AuthContext)
    let userToken = null
    if (authToken){
      userToken = authToken.access
    }

    const saveJob = async(id) => {
        try{
            const response = await fetch(`/api/job/save_job/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userToken}`
                },
                body: JSON.stringify(
                    {
                        "id": id
                    }
                    )
            });
            const data = await response.json()
            if (response.ok){
                setJobIsSaved(true)
                setServerResponse({"success": data["success"]})
            } else {
              console.log(data);
                setServerResponse({"error": data["error"]  + " from another page. Please refresh"})
            }
        } catch (error){
            setServerResponse({"error": error})
        }
      }
    
      const deleteSavedJob = async(id) => {
        const response = await fetch(`/api/job/delete_saved_job/${id}/`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userToken}`
          }
        });
        const data = await response.json()
        if (response.ok){
          setJobIsSaved(false)
          setServerResponse({"success": data["success"]})
        } else {
            setServerResponse({"error": data["error"] + " from another page. Please refresh"})
        }
      }
      
      const onCheckSavedJobs = async(jobId) => {
        const response = await fetch(`/api/job/check_saved_job/${jobId}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userToken}`
          }
        });
        const data = await response.json()
        if (response.status === 302){
          setJobIsSaved(true)
        } else if (response.status === 404){
          setJobIsSaved(false)
        }
      }

      const onCheckAllSavedJobs = async(jobId) => {
        const response = await fetch(`/api/job/check_saved_job/${jobId}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userToken}`
          }
        });
        const data = await response.json()
        if (response.status === 302){
          return true
        } else if (response.status === 404){
          return false
        }
      }

      const contextData = { 
        saveJob,
        deleteSavedJob,
        serverResponse,
        jobIsSaved,
        onCheckSavedJobs,
        onCheckAllSavedJobs
      }

    return (
        <SaveJobContext.Provider value={contextData}>
            {children}
        </SaveJobContext.Provider>
    )
}