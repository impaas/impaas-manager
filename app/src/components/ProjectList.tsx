import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const projects = [
    {
        name: "wacc_24",
        description: "WACC Compiler (2nd Year)",
    },
    {
        name: "segp_24",
        description: "Software Engineering Group Project (3rd Year)",
    },
    {
        name: "devops_24",
        description: "DevOps (2nd Year)",
    }
]


const ProjectList: React.FC = () => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((project: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link component={RouterLink} to={`/project?name=${project.name}`}>
                                    {project.name}
                                </Link>
                            </TableCell>
                            <TableCell>{project.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProjectList;
