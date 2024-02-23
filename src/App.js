import React, { lazy, Suspense} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import "./App.css"
import PrivateRoutes from "./utils/PrivateRoutes";
import PrivateRoutesCompany from "utils/PrivateRoutesCompany";
import PrivateRoutesPersonal from "utils/PrivateRoutesPersonal";
import PrivateRoutesLogin from 'utils/PrivateRoutesLogin';
import { AuthProvider } from "./Context/AuthContext";
import { ProfileProvider } from "./Context/ProfileContext";
import { EmailProvider } from "./Context/EmailContext";
import { NotificationProvider } from "Context/NotificationContext";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import SignUp from "./pages/SignUp";
import UserActivationConfirmation from "./pages/UserActivationConfirmation";
import Messages from "./pages/Messages";
import ReplyMessage from "./pages/ReplyMessage";
import NotFound from "./pages/NotFound";
import AddNewJob from "pages/AddNewJob";
import Headers from "./components/Headers";
import Footer from "./components/Footer";

import LazyLoad from 'components/LazyLoad';
const LazyUserProfile = lazy(() => import('./pages/UserProfile'));
const LazyPersonalInterestedJobs = lazy(() => import('pages/PersonalInterestedJobs'));
const LazyJobDetail = lazy(() => import('pages/JobDetail'))
const LazyJobDetailPanel = lazy(() => import('pages/JobDetailPanel'))
const LazyCompanyProfile = lazy(() => import('./pages/CompanyProfile'))
const LazyCompanyPanel = lazy(() => import('pages/CompanyPanel'))
const LazyCompanyView = lazy(() => import('./pages/CompanyView'))
const LazyPersonalView = lazy(() => import('./pages/PersonalView'))

function App() {

  return (

    <div className="App">
      <Router>
        <AuthProvider>
        <ProfileProvider>
          <EmailProvider>
            <NotificationProvider>
              <Headers />
                <Routes >
                  <Route element={<PrivateRoutes />} >
                    <Route path="/messages/" element={<Messages />} />
                    <Route path="/reply/message/" element={<ReplyMessage />} />
                    <Route path="/add-job/" element={<AddNewJob />} />
                    <Route path="/job-detail-panel/:jobId/" element={
                      <Suspense fallback={<LazyLoad />} >
                        <LazyJobDetailPanel />
                      </Suspense>}
                    />
                  </Route>

                  {/* PRIVATE ROUTE COMPANY */}
                  <Route element={<PrivateRoutesCompany />} >
                    <Route path="/company-panel/" element={
                      <Suspense fallback={<LazyLoad />} >
                        <LazyCompanyPanel />
                      </Suspense> } exact
                    />
                    <Route path="/users/" element={
                      <Suspense fallback={<LazyLoad />} >
                        <LazyCompanyView />
                      </Suspense>} exact
                    />
                  </Route>

                  {/* PRIVATE ROUTE PERSONAL */}
                  <Route element={<PrivateRoutesPersonal />} >
                    <Route path="/" element={
                    <Suspense fallback={<LazyLoad />}>
                        <LazyPersonalView />
                      </Suspense>} exact
                  />
                    <Route path="/interested-jobs/" element={
                      <Suspense fallback={<LazyLoad />}>
                        <LazyPersonalInterestedJobs />
                      </Suspense>} exact
                    />
                  </Route>

                    <Route path="/profile/company/" element={
                      <Suspense fallback={<LazyLoad />} >
                        <LazyCompanyProfile />
                      </Suspense>}
                    />
                  
                  <Route path="/profile/" element={
                    <Suspense fallback={<LazyLoad />}>
                      <LazyUserProfile />
                    </Suspense> }
                  />
                  
                  <Route path="/jobs/:jobId/" element={
                    <Suspense fallback={<LazyLoad />}>
                      <LazyJobDetail />
                    </Suspense>} exact
                  />

                  <Route element={<PrivateRoutesLogin />} >
                    <Route path="/login/" element={<LoginPage />} />
                  </Route>
                  <Route path="/reset-password/" element={<ResetPassword />}/>
                  <Route path="/password/reset/confirm/:uid/:token" element={<NewPassword />}/>
                  <Route path="/register/" element={<SignUp />} />
                  <Route path="accounts/activate/:uid/:token" element={<UserActivationConfirmation />} />
                  <Route path='*' exact element={<NotFound label={"Page Not Found"} />} />
                  <Route path='/user-not-found/' exact element={<NotFound label={"User Not Found"} />} />
                  <Route path='/job-not-found/' exact element={<NotFound label={"Job Not Found"} />} />
                </Routes>
              <Footer />
            </NotificationProvider>
          </EmailProvider>
        </ProfileProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;