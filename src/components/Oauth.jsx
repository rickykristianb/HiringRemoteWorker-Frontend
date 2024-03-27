import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const Oauth = () => {
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect( () => {
      const sendAccess = async() => {
        const response = await fetch(`/auth/social/google/login/${user.access_token}`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          }
        });
      }

      sendAccess()
    }, [user])

    useEffect(
        () => {
            if (user) {
                user == [] ? console.log(user) : console.log("Empty user")
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        console.log(res.data);
                        console.log("data assigned");
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    const logOut = () => {
        googleLogout();
        setProfile([]);
    };

  return (
    <div>
        <button onClick={() => login()}>
            Sign in with Google 🚀
        </button>
    </div>
  )
}

export default Oauth