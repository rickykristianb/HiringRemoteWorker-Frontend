import React, { useContext, useEffect, useRef, useState } from 'react'
import { Divider } from '@mui/material'
import AuthContext from 'Context/AuthContext'
import { DataGrid } from '@mui/x-data-grid';
import RateGenerator from 'components/RateGenerator'
import Button from 'components/Button';
import AppliedJobStatus from 'components/AppliedJobChangeStatus';
import AlertNotification from 'components/AlertNotification';
import ViewInterestedUserProfile from 'components/ViewInterestedUserProfile'
import Backdrop from 'components/Backdrop';

const InterestedUsers = (props) => {

  const { authToken } = useContext(AuthContext)

  const [applicantsData, setApplicantsData] = useState([])
  const [viewProfileUserId, setViewProfileUserId] = useState()
  const [totalInterestedUser, setTotalInterestedUser] = useState(0)
  const [openPopUpMenu, setOpenPopUpMenu] = useState(false)
  const [mappedData, setMappedData] = useState()
  const [openChangeStatus, setOpenChangeStatus] = useState(false)
  const [openProfileDetail, setOpenProfileDetail] = useState(false)
  const [changeStatusUserData, setChangeStatusUserData] = useState()
  const [backdropActive, setBackdropActive] = useState(false)
  const [alertResponse, setAlertResponse] = useState()
  const wrapperRef = useRef(null);

  let userToken;
  if (authToken){
    userToken = authToken.access
  }

  const onLoadAllInterestedUser = async() => {
    const response = await fetch(`/api/job/get_job_interested_user/?id=${props.jobId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization" : `JWT ${userToken}`
      }
    });
    const data = await response.json()
    if (response.ok){
      setApplicantsData(data["data"].map((item) => {
         return {
          userId: item.user.id,
          name: item.user.name,
          rateRatio: item.user.rate_ratio,
          expectedSalary: {
            nominal: item.user.expected_salary.nominal,
            paidPeriod: item.user.expected_salary.paid_period
          },
          status: item.status.status,
          dateApplied: item.applied_on,
          updatedAt: item.last_status_updated_on,
         }
      }))
      setTotalInterestedUser(data["total_user"])
    }
  }

  useEffect(() => {
    onLoadAllInterestedUser()

    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, [props.jobId])

  const handleClickOutside = (event) => {
    if (event.target.classList.contains("button") || event.target.label === "More"){
      return false
    } else if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpenPopUpMenu(false);
    }
  };

  const handleButtonClick = (e, row) => {
    setOpenPopUpMenu(row.id)
  };

  const onClickChangeStatus = async(row) => {
    setChangeStatusUserData(row)
    setOpenChangeStatus(true)
    document.body.classList.add("disable-scroll")
  }

  const onClickViewProfile = (row) => {
    setChangeStatusUserData(row)
    setOpenProfileDetail(true)
    setViewProfileUserId(row["id"])
    document.body.classList.add("disable-scroll")
  }

  const columns = [
    { field: 'no', headerName: 'No', width: 50 },
    { field: 'name', headerName: 'Name', width: 220 },
    { field: 'rateRatio', headerName: 'Rate', width: 150,
      renderCell: (params) => ( 
      <div id="interested-user-table-rate">
        <RateGenerator rating={params.value} />
      </div>
      )
    },
    { field: 'expectedSalary', headerName: 'Expected Salary', width: 130 },
    { field: 'dateApplied', headerName: 'Applied On', width: 170 },
    { field: 'updatedAt', headerName: 'Status Updated On', width: 170 },
    { field: 'status', headerName: 'Status', width: 100,
    renderCell: (params) => {
      let statusClassName = ""
      switch (params.row.status){
        case "Eliminated":
          statusClassName = "eliminated-status";
          break;
        case "Applied":
          statusClassName = "applied-status";
          break;
        case "Reviewed":
          statusClassName = "reviewed-status";
          break;
        case "Whitelist":
          statusClassName = "whitelist-status";
          break;
        case "Accepted":
          statusClassName = "accepted-status"
          break;
      }

      return <span className={statusClassName}>{params.row.status}</span>
    }
    },
    { field: 'action', headerName: 'Action', sortable: false, width: 85, 
      renderCell: (params) => (
        <>
          <Button
            clickedButton={(e) => handleButtonClick(e, params.row)}
            label="More"
            buttonType="button"
          />
          {openPopUpMenu === params.id &&
            <div id="job-panel-more-button" ref={wrapperRef}>
              <ul className='company-job-panel-menu-action'>
                <li onClick={() => onClickViewProfile(params.row)}>View Profile</li>
                  <Divider />
                <li onClick={() => onClickChangeStatus(params.row)}>Change Status</li>
              </ul>
            </div>
          }
        </>      
      ), },
    ]

  const mappingToTableData = () => {
    const tableData = applicantsData?.map((item, i) => {
      return {
        no: i + 1,
        id: item.userId,
        name: item.name,
        rateRatio: item.rateRatio,
        expectedSalary: "$" + item.expectedSalary.nominal + '/' + item.expectedSalary.paidPeriod,
        dateApplied: item.dateApplied.split("T")[0] + ", " + item.dateApplied.split("T")[1].split(".")[0],
        updatedAt: item.updatedAt.split("T")[0] + ", " + item.updatedAt.split("T")[1].split(".")[0],
        status: item.status,
        action: ""
      }
    })
    setMappedData(tableData)
  }

  useEffect(() => {
    mappingToTableData()
  }, [applicantsData])

  const onChangeUserStatus = async(changeData) => {
    const {itemId, userId} = changeData

    const response = await fetch(`/api/job/update_interested_user_status/?jid=${props.jobId}&uid=${userId}&iid=${itemId}`,{
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "Authorization": `JWT ${userToken}`
      }
    });
    const data = await response.json()
    if (response.ok){
      setBackdropActive(true)
      await onLoadAllInterestedUser()
      setBackdropActive(false)
      setAlertResponse({"success": data["success"]})
    }
    setOpenChangeStatus(false)
    if (!openProfileDetail){
      document.body.classList.remove("disable-scroll")
    }
  }

  const onClickCloseViewProfile = () => {
    setOpenProfileDetail(false)
    document.body.classList.remove("disable-scroll")
  }

  const onClickCloseChangeStatus = () => {
    setOpenChangeStatus(false)
    document.body.classList.remove("disable-scroll")
  }

  return (
    <div className='w-full '>
      <div className='w-full'>
        <br />
        <Divider />
        <div className='flex justify-between my-5'>
          <p className='text-2xl font-bold'>Interested User </p>
          <p className='font-bold'>{totalInterestedUser} applicant{totalInterestedUser > 1 && <span>s</span>}</p>
        </div>
        <div id="interested-user-list">
          {mappedData && mappedData.length > 0 
            ?
            <div style={{ height: 630, width: 1100 }}>
              <DataGrid
                rows={mappedData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                loading={mappedData.length === 0}
              />
              </div>
            :
            <p>No applicants at the moment</p>
            }
        </div>
      </div>
      {openProfileDetail && <ViewInterestedUserProfile userId={viewProfileUserId} selectedStatus={onChangeUserStatus} defaultStatusSelection={changeStatusUserData} close={() => onClickCloseViewProfile()} />}
      {openChangeStatus && <AppliedJobStatus defaultSelection={changeStatusUserData} selectedStatus={onChangeUserStatus} close={onClickCloseChangeStatus} />}
      {backdropActive && <Backdrop />}
      {alertResponse && <AlertNotification alertData={alertResponse} />}
    </div>
  )
}

export default InterestedUsers