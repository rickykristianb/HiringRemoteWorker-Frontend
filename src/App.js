import "./App.css"
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./Context/AuthContext";
import { ProfileProvider } from "./Context/ProfileContext";
import { EmailProvider } from "./Context/EmailContext";
import CompanyView from "./pages/CompanyView";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import SignUp from "./pages/SignUp";
import UserActivationConfirmation from "./pages/UserActivationConfirmation";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";
import ReplyMessage from "./pages/ReplyMessage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Headers from "./components/Headers";
import Footer from "./components/Footer";

function App() {
  return (
    
    <div className="App">
      <Router>
        <AuthProvider>
        <ProfileProvider>
          <EmailProvider>
            <Headers />
              <Routes >
                  <Route element={<PrivateRoutes />} >
                    <Route path="/messages/" element={<Messages />} />
                    <Route path="/reply/message/" element={<ReplyMessage />} />
                  </Route>
                  <Route path="/profile/" element={<UserProfile />} />
                  <Route path="/" element={<CompanyView />} exact />
                  <Route path="/login/" element={<LoginPage />} />
                  <Route path="/reset-password/" element={<ResetPassword />}/>
                  <Route path="/password/reset/confirm/:uid/:token" element={<NewPassword />}/>
                  <Route path="/register/" element={<SignUp />} />
                  <Route path="/activate/:uid/:token" element={<UserActivationConfirmation />} />
              </Routes>
            <Footer />
          </EmailProvider>
        </ProfileProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
