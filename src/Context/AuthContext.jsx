import { createContext, useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { BroadcastChannel } from "broadcast-channel";
import { useGoogleLogin } from '@react-oauth/google';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {
  

    const location = useLocation();
    const [googleLoginStatus, setGoogleLoginStatus] = useState(false)
    const [googleLoginLoading, setGoogleLoginLoading] = useState(false)
    
    const logoutChannel = new BroadcastChannel("logout");
    const loginChannel = new BroadcastChannel("login");

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
      // TO CAPTURE PROFILE, IMAGE, AND USERNAME
      const response = await fetch("/api/user/profile_image_name/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userToken}`
        }
      })
      const data = await response.json()

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
            onLoadUserHeader(data.access)
            localStorage.setItem("authToken", JSON.stringify(data))
            redirectUserPage(data.access)
            setAlert(null)
        } else {
            setAlert({"error": "Username or password not found"})
        }
    }

    // Redirect user to specific page after login based on the user type
    const redirectUserPage = async (access) => {
      const response = await fetch("/api/user/get_login_user_type/",{
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${access}`
        }
      })
      const data = await response.json()
      if (response.ok){
        if (data === "personal"){
          window.location.href = "/"
          loginChannel.postMessage("personal-login");
        } else if (data === "company"){
          window.location.href = "/users/"
          loginChannel.postMessage("company-login")
        }
        localStorage.setItem("userType", data)
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
        const response = await fetch(`/api/user/accounts/resend_activation/${email ? email : newRegisteredEmail}`, {
          method: "GET",
          headers: {
            "content-type": "application/json"
          },
        })
        
        if (response.status === 204){
          setResendActivationAlert({
            "success": `Activation link has been sent. Please check your email ${email ? email : newRegisteredEmail}`
          })
        } else if (response.status === 400){
            setResendActivationAlert({
              "error": "No activation required. User is active."
            })
        }
      } catch (error){
        console.error(error)
      } finally {
        setResendLoading(false)
      } 
    }

    useEffect(() => {
      logoutChannel.addEventListener("message", (event) => {
        window.location.href ="/"
      });

      loginChannel.addEventListener("message", (event) => {
        
        if (event === "personal-login"){
          window.location.href ="/"
        } else if (event === "company-login") {
          if (location.pathname === "/profile/company/"){
            window.location.href = "/users/"
          } else {
            window.location.reload();
          }
        }
      });
  
      return () => {
        logoutChannel.close(); // Close the channel when the component is unmounted
        loginChannel.close()
      };
    }, []);

    let logoutUser = async () => {
      localStorage.clear()
      await logoutChannel.postMessage("logout");
      setAuthToken(null)
      setUser(null)
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
        await fetch("/users/reset_password_confirm/", {
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

    // GOOGLE OAUTH2
    const googleLogin = useGoogleLogin({
      onSuccess: (codeResponse) => sendAccess(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
    });

    const sendAccess = async(codeResponse) => {
      setGoogleLoginLoading(true)
      if (codeResponse && !authToken){
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
          method: "GET",
          headers: {
            "content-type": "application/json"
          }
        });

        const data = await response.json()
        if (response.ok){
          checkUserOnBackend(data)
        }
      }
      setGoogleLoginLoading(false)
    }

    const checkUserOnBackend = async(userData) => {
      const response = await fetch(`/api/google-auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          picture: userData.picture
        })
      });
      const responseData = await response.json()
      const { access_token, refresh_token } =  responseData?.response_data
      if (response.ok){
        setGoogleLoginStatus(true)
        const timerId = setTimeout(() => {
          setGoogleLoginStatus(false)
        }, 2000)

        clearTimeout(timerId)
        onLoadUserHeader(access_token)
        localStorage.setItem("authToken", JSON.stringify({access: access_token, refresh: refresh_token}))
        redirectUserPage(access_token)
        setAlert(null)
      }
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
        ResetPasswordConfirm:ResetPasswordConfirm,
        googleLogin,
        googleLoginStatus,
        googleLoginLoading
    }

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}