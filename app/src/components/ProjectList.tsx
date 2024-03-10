import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {useState, useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';


const ProjectList = ({activeAcct, reload}: { activeAcct: any, reload: boolean}) => {
    const [projs, setProjs] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://manager-api.impaas.uk/query', {
                    method: 'GET',
                    headers: {
                        'teacher': activeAcct.username
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const projects = data.projects.map((project: any) => ({
                    name: project.project_name,
                    description: project.description
                }));
                setProjs(projects);
            } catch (error: any) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeAcct, reload]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
                    {projs.map((project, index) => (
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
