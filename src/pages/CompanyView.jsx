import Headers from '../components/Headers';
import Profile from '../components/Profile';
import Search from '../components/Search';
import Users from '../components/Users';
import Footer from '../components/Footer';
import ProfileContext from '../Context/ProfileContext';
import AuthContext from '../Context/AuthContext';
import EmailContext from '../Context/EmailContext';

import React, { useContext, useEffect } from 'react'

const CompanyView = () => {

  let { onLoadMessages } = useContext(EmailContext)
  let { user } = useContext(AuthContext)

  useEffect(() => {
    onLoadMessages()
  }, [])

  return (
    <div className="App">
      <Search />
    </div>
  )
}

export default CompanyView;