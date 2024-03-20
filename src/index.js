import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

root.render(
    <GoogleOAuthProvider clientId={googleClientId} >
        <App />
    </GoogleOAuthProvider>
    
);