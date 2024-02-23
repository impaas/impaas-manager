import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface SignInPageProps {
  handleRedirect: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ handleRedirect }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Imperial PaaS Admin Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRedirect}>
        Sign in
      </Button>
    </Box>
  );
};

export default SignInPage;
