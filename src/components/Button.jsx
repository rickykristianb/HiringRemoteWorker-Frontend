import React, { useState } from 'react'

const Button = (props) => {
  
    return (
    <div className='allButton'>
        { props.buttonType === "button" && 
          <button className={props.customClassName ? props.customClassName : "button"} 
            onClick={ props.clickedButton } style={props.customStyle} 
          >{props.label}</button> }

        { props.buttonType === "input" && 
          <input type='Submit' className={props.customClassName ? props.customClassName : "input-button"} 
            buttonType="input" 
            onClick={ props.clickedButton } value={ props.label } /> }

        { props.buttonType === "file" && 
          <input type='file' className={props.customClassName ? props.customClassName : "input-button"} 
            buttonType="file" 
            onClick={ props.clickedButton }  /> }
    </div>
    
  )
}

export default Button