import React, { useContext, useEffect, useState } from 'react'
import AuthContext from 'Context/AuthContext';
import { ReactComponent as Logo } from "../assets/images/google-icon.svg"

const GoogleOauthLogin = ({label}) => {

    const {googleLogin} = useContext(AuthContext)

  return (
    <div onClick={() => googleLogin()} className='flex justify-center items-center gap-2 h-[50px] w-[200px] rounded-lg shadow-box-shadow cursor-pointer hover:shadow-lg '>
      <Logo className='w-[30px] h-[30px]' />
      <p>{label}</p>
    </div>
  )
}

export default GoogleOauthLogin