import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import React from 'react';
import { create } from './UploadButton';

const ScientiaButton = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
      setOpen(false);
    };

    const importGroups = (project: string) => {
      
    }

    return (
        <div>
        <Button variant="contained" component="label" style={{ marginTop: 'auto', width: 'fit-content' }} startIcon={<UploadIcon />} onClick={handleClickOpen}>
            Import from Scientia
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose a project</DialogTitle>
        <DialogActions>
          <Button onClick={() => importGroups("wacc")}>WACC</Button>
          <Button onClick={() => importGroups("devops")}>DevOps</Button>
          <Button onClick={() => importGroups("pintos")}>Pintos</Button>
        </DialogActions>
        </Dialog>
        </div>
    );
};

export default ScientiaButton;