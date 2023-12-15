import { createContext, useState, useEffect, useRef, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ProfileContext from "./ProfileContext";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    const navigate = useNavigate();
    // get user token from the local storage

    const dataUser = () => {
        return localStorage.getItem("authToken") ? jwtDecode(localStorage.getItem("authToken")) : null
    }

    const dataToken = () => {
        return localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")) : null
    }
    let [user, setUser] = useState(dataUser)   // callback function, will not rendered every time. called once only on initial load
    let [authToken, setAuthToken] = useState(dataToken) // callback function, will not rendered every time. called once only on initial load
    let [loading, setLoading] = useState(false);  // make the loading on the first page load
    let [alert, setAlert] = useState(null); // set alert if login failed

    const successRegistration = useRef(false)
    let [resendLoading, setResendLoading] = useState(false)
    let [resendActivationAlert, setResendActivationAlert] = useState()

    const [passwordError, setPasswordError] = useState(null);
    const [rePasswordError, setRePasswordError] = useState(null);
    const [newRegisteredEmail, setNewRegisteredEmail] = useState(null)
    
    const onLoadUserHeader = async(userToken) => {
      const response = await fetch("/api/user/profile_image_name/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userToken}`
        }
      })
      const data = await response.json()
      console.log("CEK DATA: ", data);
      if (response.ok){
        let localLoginProfilePicture = localStorage.getItem("login_user_profile_picture")
        let localUserName = localStorage.getItem("username")
        let localUserId = localStorage.getItem("userId")
        
        // Check if the localstorage has profile picture, if not, create
        if (localLoginProfilePicture === null) {
          localStorage.setItem("login_user_profile_picture", data["profile_picture"])
        } else if (localLoginProfilePicture && localLoginProfilePicture !== data["profile_picture"]){
          // Check if the localstorage has profile picture, if yes, check if the content is same, if not, create
          localStorage.setItem("login_user_profile_picture", data["profile_picture"])
        }

        // Check if the localstorage has username, if not, create
        if (localUserName && localUserName !==  data["username"]){
          localStorage.setItem("username", data["username"])
          // Check if the localstorage has username, if yes, check if the content is same, if not, create
        } else if (localUserName === null){
          localStorage.setItem("username", data["username"])
        }

        // Check if the localstorage has userId, if not, create
        if (localUserId === null) {
          localStorage.setItem("userId", data["user_id"])
        } else if (localUserId && localUserId !== data["user_id"]){
          // Check if the localstorage has profile picture, if yes, check if the content is same, if not, create
          localStorage.setItem("userId", data["user_id"])
        }
      }
    }

    let loginUser = async (e) => {
        let response = await fetch("/api/user/token/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "email": e.email,
                "password": e.password
            })
        })
        let data = await response.json()

        if (response.status === 200){
            setAuthToken(data)
            setUser(jwtDecode(data.access))
            onLoadUserHeader(data.access)
            localStorage.setItem("authToken", JSON.stringify(data))
            navigate("/")
            setAlert(null)
            console.log("DATA");
        } else {
            setAlert({"error": "Username or password not found"})
        }
    }

    const userRegistration = async (e) => {
        try {
          const response = await fetch("/api/user/auth/create_user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: e.username,
              name: e.name,
              email: e.email,
              password: e.password,
              re_password: e.re_password,
              user_type: e.user_type
            }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            if (successRegistration){
              successRegistration.current = true
            } else {
              successRegistration.current = false
            }
            setNewRegisteredEmail(data.email)
          } else if (response.status === 400) {
            if (data.email && data.username) {
              setAlert({
                error: "Email and username already exist",
              });
            } else if (data.email) {
              setAlert({
                error: "Email already exists",
              });
            } else if (data.username) {
              setAlert({
                error: "Username already exists",
              });
            } else if (data.password) {
              setPasswordError(data.password);
            } else if (data.non_field_errors) {
              setRePasswordError(data.non_field_errors);
            } else {
              setAlert({
                error: "Bad Request 404"
              })
            }
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      };

    const resendActivationLink = async (email) => {
      setResendLoading(true)
      
      try{
        let response = await fetch("/auth/users/resend_activation/", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            "email": email ? email : newRegisteredEmail
          })
        })

        setResendActivationAlert({
          "success": `Please check your email ${email ? email : newRegisteredEmail}`
        })
      } catch (error){
        console.error(error)
      } finally {
        setResendLoading(false)
      } 
    }

    let logoutUser = () => {
        setAuthToken(null)
        setUser(null)
        localStorage.clear()
        navigate("/")
    }

    let updateToken = async () => {
      try {
          let response = await fetch("/api/user/token/refresh/", {
              method: "POST",
              headers: {
                  "content-type": "application/json"
              },
              body: JSON.stringify({
                  "refresh": authToken?.refresh,
              })
          });
  
          if (response.ok) {
              let data = await response.json();
              const newData = {
                  access: data.access,
                  refresh: authToken.refresh
              };
  
              setAuthToken(newData);
              setUser(jwtDecode(newData.access));
  
              localStorage.setItem("authToken", JSON.stringify(newData));
          } else if (response.status === 401) {
              // Handle unauthorized error (e.g., logout user)
              logoutUser();
          } else {
              // Handle other errors
              console.error("Token refresh failed:", response.status, response.statusText);
              // You might want to logout the user or handle the error in an appropriate way
          }
      } catch (error) {
          console.error("An error occurred during token refresh:", error);
          // Handle the error, e.g., show a user-friendly message or log out the user
          logoutUser();
      } finally {
          // Set loading to false regardless of the outcome
          setLoading(false);
      }
      console.log(JSON.parse(localStorage.getItem("authToken"))["access"]);
  };
  
    useEffect( () => {

        if (loading){
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4;
        let interval = setInterval( () => {
            if(authToken){
                updateToken()
            }
        }, fourMinutes)

        return () => clearInterval(interval)
    }, [authToken, loading]);

    const ResetPasswordConfirm = async (e) => {
        const response = await fetch("/users/reset_password_confirm/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "uid": e.uid,
                "token": e.token,
                "new_password": e.new_password,
                "re_new_password": e.re_new_password
              })
        })
    } 

    let contextData = {
        user:user,
        alert:alert,
        loginUser:loginUser,
        logoutUser:logoutUser,
        userRegistration:userRegistration,
        resendActivationLink:resendActivationLink,
        authToken:authToken,
        passwordError:passwordError,
        rePasswordError:rePasswordError,
        successRegistration:successRegistration,
        resendLoading:resendLoading,
        resendActivationAlert:resendActivationAlert,
        ResetPasswordConfirm:ResetPasswordConfirm
    }

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}