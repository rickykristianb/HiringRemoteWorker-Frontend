import Alert from '@mui/material/Alert';
import { useEffect } from 'react';

import React, { useState } from 'react'

const AlertNotification = (props) => {

    const [alert, setAlert] = useState(null);

    useEffect(() => {
        setAlert(props.alertData)
    }, [props.alertData])

    useEffect(() => {
        if (alert){
            const timeout = setTimeout(() => {
                setAlert(null);
            }, 5000);
            return () => clearTimeout(timeout)
        }
    }, [alert])

  return (
    <div>
        {alert && <Alert severity={ alert.success ? "success" : "error"} className='alert'>{ alert.success ? alert.success : alert.error }</Alert>}
    </div>
  )
}

export default AlertNotification