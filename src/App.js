import "./App.css"
import PrivateRoutes from "./utils/PrivateRoutes";
import PrivateRoutesCompany from "utils/PrivateRoutesCompany";
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
import NotFound from "./pages/NotFound";
import UserNotFound from "pages/UserNotFound";
import PersonalView from "./pages/PersonalView";
import CompanyProfile from "./pages/CompanyProfile";
import AddJob from "components/AddJob";
import CompanyPanel from "pages/CompanyPanel";
import JobDetailPanel from "pages/JobDetailPanel";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Headers from "./components/Headers";
import Footer from "./components/Footer";
import JobDetail from "pages/JobDetail";

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
                    <Route path="/add-job/" element={<AddJob />} />
                    <Route path="/jobs/:jobId/" element={<JobDetail />} />
                    <Route path="/company-panel/" element={<CompanyPanel />} exact />
                    <Route path="/job-detail-panel/:jobId/" element={<JobDetailPanel />} />
                  </Route>
                  <Route path="/profile/" element={<UserProfile />} />
                  <Route path="/profile/company/" element={<CompanyProfile />} />
                  <Route element={<PrivateRoutesCompany />} >
                    <Route path="/users/" element={<CompanyView />} exact />
                  </Route>
                  <Route path="/jobs/" element={<PersonalView />} exact />
                  <Route path="/login/" element={<LoginPage />} />
                  <Route path="/reset-password/" element={<ResetPassword />}/>
                  <Route path="/password/reset/confirm/:uid/:token" element={<NewPassword />}/>
                  <Route path="/register/" element={<SignUp />} />
                  <Route path="/activate/:uid/:token" element={<UserActivationConfirmation />} />
                  <Route path='*' exact element={<NotFound />} />
                  <Route path='/user-not-found/' exact element={<UserNotFound />} />
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
