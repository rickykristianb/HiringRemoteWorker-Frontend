import React, { useEffect, useState } from 'react'
import PanelMenu from 'components/CompanyPanel/PanelMenu'
import PanelProfile from 'components/CompanyPanel/PanelProfile'
import PanelJob from 'components/CompanyPanel/PanelJob'
import { useParams, useLocation } from 'react-router-dom'

const CompanyPanel = () => {

  const [menuClicked, setMenuClicked] = useState()
  const location = useLocation();

  const onMenuClicked = (item) => {
    setMenuClicked(item)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedTab = params.get('tab');

    setMenuClicked(selectedTab);
  }, [location.search]);

  return (
    <div className='grid grid-cols-4 my-20 mx-20 md:mx-10'>
      <div id="company-panel-menu-asd" className='col-start-1 col-end-1'>
        <PanelMenu menuClicked={onMenuClicked} params={menuClicked}  />
      </div>
      <div className='company-panel-content-asd col-start-2 col-end-5'>
        {(() => {
          switch(menuClicked){
            case "profile":
              return <PanelProfile />;
              break;
            case "jobs":
              return <PanelJob />;
              break
            default:
              return <PanelProfile />;
          }
        })()}
      </div>
    </div>
  )
}

export default CompanyPanel