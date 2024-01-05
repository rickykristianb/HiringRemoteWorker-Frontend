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
    <div id="company-panel-container">
      <div id="company-panel-menu">
        <PanelMenu menuClicked={onMenuClicked} params={menuClicked}  />
      </div>
      <div className='company-panel-content'>
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