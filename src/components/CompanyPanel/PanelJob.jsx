import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import AlertNotification from 'components/AlertNotification';
import Backdrop from 'components/Backdrop';
import AuthContext from 'Context/AuthContext';
import Button from 'components/Button';
import { Divider } from '@mui/material';
import AddJob from 'components/AddJob';
import EditJob from 'components/EditJob';
import DeleteConfirmation from 'components/DeleteConfirmation';
import { useNavigate } from 'react-router-dom';
const PanelJob = () => {

  const {authToken} = useContext(AuthContext)
  const [jobData, setJobData] = useState([])
  const [mappedData, setMappedData] = useState()
  const [openPopUpMenu, setOpenPopUpMenu] = useState(false)
  const [isBackdropActive, setIsBackdropActive] = useState(false)
  const [isAddJob, setIsAddJob] = useState(false)
  const [isEditJob, setIsEditJob] = useState(false)
  const [editData, setEditData] = useState()
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteConfirmationBoxOpen, setDeleteConfirmationBoxOpen] = useState(false)
  const [itemNeedToDelete, setItemNeedToDelete] = useState()
  const [alertResponse, setAlertResponse] = useState()
  const wrapperRef = useRef(null);

  let userToken;
  if (authToken){
    userToken = authToken?.access
  }

  const navigate = useNavigate()

  const fetchData = async () => {
    let loginUserId =localStorage.getItem('userId');
    if (loginUserId) {
      onLoadCompanyJobs(loginUserId);
    }
  };
  
  const onLoadCompanyJobs = async() => {
    const response = await fetch("/api/job/all_user_jobs-auth/", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": `JWT ${userToken}`
      }
    });
    const data = await response.json()
    if (response.ok){
      setJobData(data)
    }
  }

  useEffect(() => {
    onLoadCompanyJobs()
    
    // HANDLE CLOSE POP UP MENU IF CLICK OTHER PART OF THE PAGE
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
    
  }, [])

  const handleClickOutside = (event) => {
    if (event.target.classList.contains("button") || event.target.label === "More"){
      return false
    } else if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpenPopUpMenu(false);
    }
  };

  useEffect(() => {
    mappingToTableData()
  }, [jobData])

  const handleButtonClick = (e, row) => {
    setOpenPopUpMenu(row.id)
  };

  const onClickView = (row) => {
    const id = row["id"]
    window.open(`/job-detail-panel/${id}/`, "_blank")
  }

  const onDeleteJob = async(item) => {
    try{
      const id = item["id"]
      const response = await fetch(`/api/job/delete_job/${id}/`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userToken}`
        }
      });
      const data = await response.json()
      if (response.ok){
        setIsBackdropActive(true)
        await onLoadCompanyJobs()
        setIsBackdropActive(false)
        setAlertResponse({"success": data["success"]})
      } else {
        setAlertResponse({"error": data["error"]})
      }
    } catch (error){
      setAlertResponse({"error": error.toString()})
    } finally{
      setDeleteConfirmationBoxOpen(false)
    }
  }

  const onClickDelete = async(row) => {
    setDeleteConfirmationBoxOpen(true)
    setItemNeedToDelete(row)
    document.body.classList.add("disable-scroll")
  }

  useEffect(() => {
    if(deleteConfirmation){
      onDeleteJob(itemNeedToDelete)
    }
  }, [deleteConfirmation])

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'jobTitle', headerName: 'Job Title', width: 350 },
    { field: 'createdAt', headerName: 'Created At', width: 130 },
    { field: 'updatedAt', headerName: 'Updated At', width: 130 },
    { field: 'deadline', headerName: 'Deadline', width: 130 },
    {
      field: 'applicants',
      headerName: 'Applicants',
      type: 'number',
      width: 90,
    },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'action', headerName: 'Action', sortable: false, width: 90, 
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
              <li onClick={() => onClickView(params.row)}>View</li>
                <Divider />
              <li onClick={() => onClickEdit(params.row)}>Edit</li>
                <Divider />
              <li onClick={() => onClickDelete(params.row)}>Delete</li>
            </ul>
          </div>
        }
      </>      
    ), },
  ];

  const mappingToTableData = () => {
    const tableData = jobData?.map((jobItem) => {
      return {
        id: jobItem.id,
        jobTitle: jobItem.job_title,
        createdAt: jobItem.created_at,
        updatedAt: jobItem.updated_at,
        deadline: jobItem.deadline,
        applicants: jobItem.interesteduser?.length > 0 ? jobItem.interesteduser?.length : 0 ,
        status: jobItem.status,
        action: "",
      }
    });
    setMappedData(tableData)
  }

  const onClickAddButton = () => {
    setIsAddJob(true)

    document.body.classList.add('disable-scroll');
  }

  const onClickCancelButtonAddForm = () => {
    setIsAddJob(false)

    document.body.classList.remove('disable-scroll');
  }

  const onClickEdit = (row) => {
    const id = row["id"]
    const editData = jobData.find((item) => item.id === id)

    setEditData({
      data: {
        id: editData.id, 
        jobTitle: editData.job_title,
        jobDetail: editData.job_detail,
        skills: editData.jobskills,
        jobLocation: editData.joblocation,
        jobEmploymentType: editData.jobemploymenttype,
        jobSalary: editData.jobsalaryrates,
        jobExperienceLevel: editData.experience_level,
        jobStatus: editData.status,
        jobDeadline: editData.deadline
      }
    })
    setIsEditJob(true)
    document.body.classList.add('disable-scroll');
  }

  const onClickCancelButtonEditForm = () => {
    setIsEditJob(false)
  }

  const onClickYesDeletion = () => {
    setDeleteConfirmation(true)
    document.body.classList.remove("disable-scroll")
  }

  const onClickNoDeletion = () => {
    setDeleteConfirmation(false)
    setDeleteConfirmationBoxOpen(false)
    document.body.classList.remove("disable-scroll")
  }

  return (
    <div id="jobs-panel-container">
      <div id="jobs-panel-add-button">
        <h2>Job Posted</h2>
        <Button buttonType="button" label="Add" clickedButton={onClickAddButton} />
      </div>
      <br />
      <div style={{ height: 630}}>
        {mappedData && mappedData.length > 0 
          ?
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
          :
          <p>No job at the moment</p>
        }
      </div>
      {isAddJob 
        && 
        <div id='posted-page-add-job-form-container'>
          <AddJob 
            type="job-posted-form" 
            clickedCancel={onClickCancelButtonAddForm}
            closeForm={onClickCancelButtonAddForm}
            notification={setAlertResponse}
            onLoadJobPosted={onLoadCompanyJobs}
          />
        </div>
      }
      {isEditJob && 
          <div id='posted-page-edit-job-form-container'>
            <EditJob 
              editData={editData} 
              clickedCancel={onClickCancelButtonEditForm }
              closeForm={onClickCancelButtonEditForm } 
              notification={setAlertResponse}
              onLoadJobPosted={onLoadCompanyJobs}
              needPagination={false}
            />
          </div>
        }
      {isBackdropActive && <Backdrop />}
      <AlertNotification alertData={alertResponse}/>
      { deleteConfirmationBoxOpen && <DeleteConfirmation deleteLabel={"Are you sure you want to delete this job?"} onClickYes={onClickYesDeletion} onClickNo={onClickNoDeletion} /> }
    </div>
  )
}

export default PanelJob