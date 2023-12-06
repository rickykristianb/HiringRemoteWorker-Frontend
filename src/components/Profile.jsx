import React, { useState } from 'react'
import { useEffect } from 'react'

const Profile = () => {

  const [data, setData] = useState(null)

    useEffect(()=>{
      const getProfile = async () => {
        try {
          let response = await fetch(`/api/user/get_user/`)
          if (response.ok) {
            let data = await response.json()
            console.log(data);
            setData(data)
          } else {
            console.error("Failed to fetch data")
          }
        } catch (error) {
          console.error("An error occured: ", error);
        }      
      }
      getProfile()
    }, [])


  return (
    <div>{data}</div>
  )
}

export default Profile