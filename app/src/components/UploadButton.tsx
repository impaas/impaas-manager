import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import React from 'react';
import YAML from 'yaml';

type logT = (message: string) => void;

interface UploadButtonProps {
    onUploadStart: () => void;
    log: logT;
    activeacc: any;
    reload: boolean;
    setReload: any;
}

export const create = async (data: string, log: logT, activeacc:any) => {
    const projects = YAML.parse(data).projects;
    const projectNames = Object.keys(projects);
    const projectNamesCleaned = projectNames.map((project: string) => project.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, ''));
    var canbreak = false;
    try {
        const response = await fetch('https://managertest.impaas.uk/query', {
            method: 'GET',
            headers: {
                'teacher': activeacc.username
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const fetchedProjects = data.projects.map((project: any) => (project.project_name));
        //if project specified already exists
        projectNamesCleaned.forEach((project: any) => {
            if (fetchedProjects.includes(project)){
                log("Error creating projects as " + project + " already exists")
                canbreak = true;
            }
        })
    } catch (error: any) {
        log('Error fetching data: to upload yaml. ' + error.message);
        return;
    }
    if(!canbreak){
        for (const project in projects) {
            const projectName = project.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
            const extras = projects[project].extras;
            const groups = projects[project].groups;
            const description = projects[project].description as string;
            try {
                const response = await fetch('https://managertest.impaas.uk/add_project', {
                    method: 'POST',
                    headers: {
                        'teacher': activeacc.username,
                        'projectname': projectName,
                        'description': description,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            } catch {
                console.log("error creating project in database")
            }

            for (const groupNum in groups) {
                const teamName = `${projectName}_${groupNum.padStart(2, '0')}`;
                await createTeam(teamName, log);
                for (const user of groups[groupNum]) {
                    const userEmail = `${user}@ic.ac.uk`
                    await createUser(userEmail, log);
                    await addUserToTeam(userEmail, teamName, extras, log);
                }
                log(`Processed team ${teamName}`);
            }
            log(`Processed project ${project}`);
        }
        log("Finished!");
    }
    else{
        log("Aborted.")
    }
};

const createUser = async (userEmail: string, log: logT) => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("tsurutoken")}` };
    const response = await fetch(`/users?email=${userEmail}`, {
        method: "POST",
        headers,
    });
    if (response.status === 201) {
        log(`${userEmail} has not logged in before - created user`)
    } else if (response.status === 500) {
        // User already exists
    } else {
        log(`Failed to create user ${userEmail}: ${response.status}`)
    }
};

const createTeam = async (teamName: string, log: logT) => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("tsurutoken")}` };
    const response = await fetch(`/teams?name=${teamName}`, {
        method: "POST",
        headers,
    });
    if (response.status === 201) {
        log(`Created team ${teamName}`)
    } else if (response.status === 409) {
        // Team already exists
    } else {
        log(`Failed to create team ${teamName}: ${response.status}`)
    }
};

const addUserToTeam = async (userEmail: string, teamName: string, extras: any, log: logT) => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("tsurutoken")}` };
    const response = await fetch(`/roles/team-member/user?email=${userEmail}&context=${teamName}`, {
        method: "POST",
        headers,
    });
    if (response.status === 200) {
        log(`Added user ${userEmail} to team ${teamName}`)
    } else {
        log(`Failed to add user ${userEmail} to team ${teamName}: ${response.status}`)
    }

    if (!extras) {
        return;
    }
    for (const extra of extras) {
        const response = await fetch(`/roles/team-member_${extra}/user?email=${userEmail}&context=${teamName}`, {
            method: "POST",
            headers,
        });

        if (response.status === 200) {
            log(`Added ${extra} extra to user ${userEmail} in team ${teamName}`)
        } else {
            log(`Failed to add ${extra} extra to user ${userEmail} in team ${teamName}: ${response.status}`)
        }
    }
};

const UploadButton: React.FC<UploadButtonProps> = ({ onUploadStart, log, activeacc, reload, setReload }) => {
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onload = async (evt: ProgressEvent<FileReader>) => {
            if (!evt?.target?.result) {
                return;
            }
            const { result } = evt.target;
            await create(result as string, log, activeacc);
            setReload(!reload);
        }
        onUploadStart();
        reader.readAsBinaryString(file);

        e.target.value = '';
    };

    return (
        <Button variant="contained" component="label" style={{ marginTop: 'auto' }} startIcon={<UploadIcon />}>
            Upload File
            <input type="file" accept=".yaml" hidden onChange={handleUpload} />
        </Button>
    );
};

export default UploadButton;
