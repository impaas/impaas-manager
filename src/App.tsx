import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import { Box, Typography } from '@mui/material';
import { PublicClientApplication } from '@azure/msal-browser';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './auth/Config';
import SignInPage from './components/SignInPage';
import Home from './components/Home';
import Project from './components/Project';
import './App.css';

const AuthedWrapper = () => {
  const { instance } = useMsal();
  const [logoutMessage, setLogoutMessage] = useState('');

  const activeAcct = instance.getActiveAccount();

  const handleRedirect = () => {
    instance.loginRedirect({
      ...loginRequest,
      prompt: 'create'
    });
  };

  const handleLogout = () => {
    instance.logout();
    setLogoutMessage('You have been logged out.');
  };

  return (
    <Box>
      <AuthenticatedTemplate>
        {activeAcct ? (
          <Router>
            <Routes>
              <Route path="/" element={<Home activeAcct={activeAcct} handleLogout={handleLogout} />} />
              <Route path="/project" element={<Project />} />
            </Routes>
          </Router>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInPage handleRedirect={handleRedirect} />
        {logoutMessage && <Typography>{logoutMessage}</Typography>}
      </UnauthenticatedTemplate>
    </Box>
  );
};


const App = ({ instance }: { instance: PublicClientApplication }) => {

  return (
    <MsalProvider instance={instance}>
      <AuthedWrapper />
    </MsalProvider>
  );
}

export default App;
