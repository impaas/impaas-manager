export const msalConfig = {
    auth: {
        clientId: "a8e6877c-314a-462d-94f6-5e73d80bb153",
        authority: "https://login.microsoftonline.com/2b897507-ee8c-4575-830b-4f8267c3d307",
        redirectUri: "http://localhost:3000/webauth",
    },
    cache: {
        cacheLocation: "sessionStorage"
    }
}

export const loginRequest = {
    scopes: ['user.read']
}
