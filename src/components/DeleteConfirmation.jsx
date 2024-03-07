import React from 'react'
import Button from './Button'

const DeleteConfirmation = (props) => {
  return (
    <div id='delete-confirmation-container'>
        <div id='delete-confirmation-wrapper'>
            <p>{props.deleteLabel}</p>
            <br />
            <div id="delete-confirmation-button-action">
                <Button clickedButton={props.onClickYes} customClassName="delete-confirmation-yes-button" buttonType="button" label="Yes" />
                <Button clickedButton={props.onClickNo} buttonType="button" label="No" />
            </div>
        </div>
    </div>
  )
}

export default DeleteConfirmation