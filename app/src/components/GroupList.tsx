import { Box, Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton } from '@mui/material';
import { useEffect, useState } from "react";
import Group from "./Group";
import { headers } from "./Group";
import ExtensionIcon from '@mui/icons-material/Extension';
import StorageIcon from '@mui/icons-material/Storage';

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
                  <TableCell>
                  {/* <IconButton onClick = {() => {console.log(filteredGroups)}}>
                  <><ExtensionIcon titleAccess="Service" style={{ }}/></>
                  </IconButton>
                  <IconButton onClick = {() => {}}>
                  <><StorageIcon titleAccess="Volume" style={{  }}/></>
                  </IconButton> */}
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
