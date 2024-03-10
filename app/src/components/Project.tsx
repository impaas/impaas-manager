import HomeIcon from '@mui/icons-material/Home';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import GroupList from './GroupList';

const Project: React.FC = () => {
    const query = new URLSearchParams(useLocation().search);
    const name = query.get('name') || 'All Groups';
    const projectName = name.replace(/ /g, '_').toLowerCase();

    return (
        <Box p={2}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" startIcon={<HomeIcon />} component={RouterLink} to="/">
                        Return to Home
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {name}
                            </Typography>
                            <GroupList project={projectName} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Project;
