import { Box, Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from "react";
import Group from "./Group";
import { headers } from "./Group";

interface GroupListProps {
  project: string;
}

const GroupList: React.FC<GroupListProps> = ({ project }) => {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  const fetchGroups = async () => {
    const response = await fetch('/teams', { headers });
    const data = await response.json();
    setGroups(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups
    .filter((group: any) => group.name.toLowerCase().startsWith(project))
    .filter((group: any) => group.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  return (
    <Grid item xs={12}>
      <Card>
        <Box p={2}>
          <Typography variant="h5">Groups</Typography>
          <TextField fullWidth label="Search" variant="outlined" onChange={e => setSearch(e.target.value)} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">Group</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGroups.map((group: any, index: number) => (
                  <Group key={index} name={group.name} updateList={fetchGroups}  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Grid>
  );
};

export default GroupList;
