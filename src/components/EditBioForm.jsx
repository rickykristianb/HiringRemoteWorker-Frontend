import { Divider } from '@mui/material'
import Button from 'components/Button';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from "react-select";

const EditBioForm = (props) => {

  const [loadedLocation, setLoadedLocation] = useState([])

  const {register, handleSubmit, reset,
      formState: {
        errors, isSubmitting
      }} = useForm({
        defaultValues: {
          "name": props.userData?.headerData.name,
          "email": props.userData?.headerData.email,
          "phoneNumber": props.userData?.headerData.phoneNumber,
          "address": props.userData?.headerData.address,
          "bio": props.userData?.bioData.bio,
        }
      })

  const onLoadLocation = async() => {
    // get location list as an select option
    const response = await fetch("/api/user/get_location/", {
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    })
    const data = await response.json()
    setLoadedLocation(data)
  }

  useEffect(() => {
    onLoadLocation()
  }, [])
        
  return (
    <div className='edit-company-profile-container'>
      <div className='company-profile-form-container' >
        <div id='edit-company-profile-title'>
          <p>EDIT COMPANY PROFILE</p>
          <Divider />
        </div>
        <div id='company-profile-form-container-in'>
          <form onSubmit={handleSubmit(props.saveEditProfile)} className='company-profile-form'>
            <label for="name" >Name</label>
            <input {...register("name", {"required": "Name is required"})} 
                id="name"
                value={props.userData?.headerData.name}
                onChange={props.onChangeHeaderFormInput}
                name="name"
                className="company-bio-input" 
                disabled={ isSubmitting ? true : false } 
              />
              {errors.name && <span className='error-field'>{errors.name.message}</span>}
            <label for="email" >Email</label>
            <input {...register("email", {
                  "required": "Email is required", 
                  "pattern": { 
                    "value": /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    "message": "Please Insert Correct Email"
                  }})} 
                id="email"
                value={props.userData?.headerData.email}
                onChange={props.onChangeHeaderFormInput}
                name="email"
                className="company-bio-input" 
                disabled
              />
              {errors.email && <span className='error-field'>{errors.email.message}</span>}
            <label for="email" >Phone Number</label>
            <input {...register("phoneNumber", {
                  "required": "Phone Number is required", 
                  "pattern": {
                    "value": /^[0-9]+$/,
                    "message": "Insert only Number"
                  }})} 
              id="phoneNumber"
              value={props.userData?.headerData.phoneNumber}
              onChange={props.onChangeHeaderFormInput}
              name="phoneNumber"
              className="company-bio-input" 
              disabled={ isSubmitting ? true : false }
            />
            {errors.phoneNumber && <span className='error-field'>{errors.phoneNumber.message}</span>}
            <label for="company-location" >Location</label>
            <Select
                id="company-location"
                name="location"
                options={loadedLocation.map((item) => ({id:item.id, value: item.location, label: item.location}))}
                className='company-bio-input-select'
                value={{
                  value: props.userData.locationData?.location ? props.userData.locationData?.location : "Select Location..", 
                  label: props.userData.locationData?.location ? props.userData.locationData?.location : "Select Location.."
                }}
                onChange={(options) => props.onChangeLocationForm(options)}
            />
            {props.locationFieldError && <span className='error-field'>{props.locationFieldError["error"]}</span>}
            <label for="address" >Address</label>
            <input {...register("address")} 
              id="address"
              value={props.userData?.headerData.address}
              onChange={props.onChangeHeaderFormInput}
              name="address"
              className="company-bio-input" 
              disabled={ isSubmitting ? true : false }
            />
            {errors.address && <span className='error-field'>{errors.address.message}</span>}
            <label for="bio" >Profile</label>
            <textarea {...register("bio")} 
              id="bio"
              value={props.userData?.bioData.bio}
              onChange={props.onChangeBioForm}
              name="bio"
              className="company-bio-input-text-area" 
              disabled={ isSubmitting ? true : false }
              rows="30"
            />
            {errors.bio && <span className='error-field'>{errors.bio.message}</span>}
            <br />
              <div id="company-profile-action-button">
                <Button buttonType="input" label={isSubmitting ? "Saving..." : "Save"} disabled={isSubmitting ? true : false} />
                <Button clickedButton={props.onClickCancel} customClassName="company-profile-cancel-button" buttonType="input" label="Cancel" disabled={isSubmitting ? true : false} />
              </div>
          </form>
          
        </div>
      </div>
    </div>
  )
}

export default EditBioForm