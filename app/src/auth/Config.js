export const msalConfig = {
    auth: {
        clientId: "0204d583-5517-40e2-b064-6cdcd8306687",
        authority: "https://login.microsoftonline.com/2b897507-ee8c-4575-830b-4f8267c3d307",
        redirectUri: "https://manager.impaas.uk/webauth",
    },
    cache: {
        cacheLocation: "sessionStorage"
    }
}

export const loginRequest = {
    scopes: ['user.read']
}
