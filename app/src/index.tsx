import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PublicClientApplication, EventType, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig } from './auth/Config';
import reportWebVitals from './reportWebVitals';

const msalInstance = new PublicClientApplication(msalConfig)

msalInstance.addEventCallback(async (e: any) => {
  // @ts-ignore
  if (e.eventType === EventType.LOGIN_SUCCESS && e.payload.account) {
    // @ts-ignore
    const acct = e.payload.account
    msalInstance.setActiveAccount(acct)

    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    const tokenRequest = {
      scopes: ["User.Read", "Mail.Read"],
      forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
      account: acct
    };

    await msalInstance.acquireTokenSilent(tokenRequest)
      .then(async function (accessTokenResponse) {
        let tokenResponse = await accessTokenResponse.accessToken
        localStorage.setItem("tsurutoken", tokenResponse)
        
        const graphHeaders = { 'Authorization': `Bearer ${tokenResponse}`}

        const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
          method: 'GET',
          headers: graphHeaders,
        })

        const graphJson = await graphResponse.json()

        const newHeaders = { 'Content-Type': 'application/json'}

        var formBody = {token: tokenResponse, email: graphJson.userPrincipalName}

        fetch('/auth/webLogin', {
          method: 'POST',
          headers: newHeaders,
          body: JSON.stringify(formBody)
        }).then(() => {
          return tokenResponse;
        })
        .catch((error: any) => {
          console.error(error);
        });
      }).catch(error => {
        console.warn("silent token acquisition fails. acquiring token using popup");
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          msalInstance.acquireTokenPopup(tokenRequest)
            .then(async (tokenResponse: any) => {
              localStorage.setItem("tsurutoken", tokenResponse.token)
              const graphHeaders = { 'Authorization': `Bearer ${localStorage.getItem("tsurutoken")}`, 'Content-Type': 'application/json'}

              const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
                method: 'POST',
                headers: graphHeaders,
              })

              const graphJson = await graphResponse.json()

              const newHeaders = { 'Content-Type': 'application/json'}

              var formBody = {token: tokenResponse.token, email: graphJson.userPrincipalName}

              fetch('/auth/webLogin', {
                method: 'POST',
                headers: newHeaders,
                body: JSON.stringify(formBody)
              }).then(() => {
                return tokenResponse;
              })
              .catch((error: any) => {
                console.error(error);
              });
            }).catch((error: any) => {
              console.error(error);
            });
        } else {
          console.warn(error);
        }
      });
  }
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App instance={msalInstance} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
