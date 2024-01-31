import { Outlet } from "react-router-dom"
import MobileOffIcon from '@mui/icons-material/MobileOff';

const PrivateRoutesMobile = () => {

    const showRestrictedDevice = () => {
        return (
        <div className=" fixed w-screen h-screen z-4 bg-soft-basic flex flex-col justify-center items-center">
            <MobileOffIcon sx={{width:"100px", height:"100px"}} />
            <br />
            <p className="text-center">You can not access this page on <span className="font-bold">mobile device</span>. Please use larger device at the moment. Wait for next release.</p>
        </div>
        )
    }
  
    if (Math.min(window.screen.width, window.screen.height) < 768){
        return showRestrictedDevice()
    } else {
        return <Outlet />
    }
}

export default PrivateRoutesMobile