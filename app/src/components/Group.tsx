import React, { useState, useEffect } from 'react';
import { ExpandMore } from "@mui/icons-material";
import ExtensionIcon from '@mui/icons-material/Extension';
import StorageIcon from '@mui/icons-material/Storage';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Box, Collapse, Table, TableBody, TableCell,TableHead, TableRow, IconButton } from '@mui/material';

export const headers = { 'Authorization': `Bearer ${localStorage.getItem("tsurutoken")}` }

interface GroupProps {
    name: string;
    updateList: any;
  }

const Group: React.FC<GroupProps> = ({ name, updateList }) => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [colour, setColour] = useState("grey");

    const toggleOpen = () => {
      if (!open) {
        fetchUsers();
      }
      setOpen(!open);
    }

    const fetchUsers = async () => {
      const response = await fetch(`/teams/${name}/users`, { headers });
      const data = await response.json();
      setUsers(data);
    };

    const handleDeleteForTeam = async () => {
      const response = await fetch(`/teams/${name}`, { method: 'DELETE', headers });
      if (response.ok) {
        updateList()
      }
    };

    const [groupRoles, setGroupRoles] = useState([""])

    const fetchGroupRoles = async () => {
      const response = await fetch(`/teams/${name}/users`, { method: 'GET', headers });
      const data = await response.json()
      setGroupRoles(data[0].roles)
    };

    useEffect(() => {
      fetchGroupRoles();
    }, []);

    function findColor(role: string) : string {
      var colour = "grey"
      if (groupRoles.includes(role)) {
          colour = "black"
      }
      return colour
    }

    async function updatePermissions(buttonRole : string) {
      var response = await fetch(`/teams/${name}/users`, { method: 'GET', headers });
      if (groupRoles.includes(buttonRole)) {
        if (response.ok) {
          const data = await response.json()
          var users : string[] = []
          var formBody = {users: users, context: name, role: buttonRole}
          for (const user in data) {
            formBody.users.push(data[user].email);
          }
          const newHeaders = { 'Authorization': `Bearer ${localStorage.getItem("tsurutoken")}`, 'Content-Type': 'application/json'}
          fetch('/roles/dissociate', {
            method: 'DELETE',
            headers: newHeaders,
            body: JSON.stringify(formBody)
          }).then(() => {
            setGroupRoles([...groupRoles.filter((role: any) => role !== buttonRole)])
          })
        }
      } else {
        if (response.ok) {
          const data = await response.json()
          var users : string[] = []
          var formBody = {users: users, context: name, role: buttonRole}
          for (const user in data) {
            formBody.users.push(data[user].email);
          }

          const newHeaders = { 'Authorization': `Bearer ${localStorage.getItem("tsurutoken")}`, 'Content-Type': 'application/json'}

          fetch('/roles/associate', {
            method: 'POST',
            headers: newHeaders,
            body: JSON.stringify(formBody)
          }).then(() => {
            setGroupRoles([...groupRoles, buttonRole])
          })
        }
      }
    }

    return (
      <>
        <TableRow>
          <TableCell>{name}</TableCell>
          <TableCell>
          <IconButton onClick = {() => updatePermissions("team-member_service")}>
          <><ExtensionIcon titleAccess="Service" style={{ color: groupRoles.includes("team-member_service") ? "black" : "grey" }}/></>
          </IconButton>
          <IconButton onClick = {() => updatePermissions("team-member_volume")}>
          <><StorageIcon titleAccess="Volume" style={{ color: groupRoles.includes("team-member_volume") ? "black" : "grey" }}/></>
          </IconButton>
          </TableCell>
          <TableCell align="right" style={{ paddingRight: 10 }}>
            <IconButton aria-label="expand row" size="small" onClick={toggleOpen}>
              <ExpandMore style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton onClick={handleDeleteForTeam} style={{ float: 'right', paddingRight: '10px' }}>
              <DeleteIcon color="error" fontSize="large"/>
            </IconButton>
          </TableCell>
        </TableRow>
        {open && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <Table size="small" aria-label="users">
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableHead>
                    <TableCell>
                      <IconButton color="primary" onClick={async () => {
                        const email = prompt('Please enter your email:');
                        for (var role in groupRoles) {
                          var details : { [key: string]: any } = {
                            "email": email,
                            "context": name
                          };

                          var formBody : string[] = [];
                          for (const property in details) {
                            var encodedKey = encodeURIComponent(property);
                            var encodedValue = encodeURIComponent(details[property]);
                            formBody.push(encodedKey + "=" + encodedValue);
                          }
                          const formBodyConcat = formBody.join("&");

                          const newHeaders = { 'Authorization': `Bearer ${localStorage.getItem("tsurutoken")}`, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}

                          fetch(`/roles/${groupRoles[role]}/user`, {
                            method: 'POST',
                            headers: newHeaders,
                            body: formBodyConcat
                          }).then(() => {
                            setGroupRoles([...groupRoles, groupRoles[role]])
                            fetchUsers()
                          })

                        }
                        }}>
                          <AddIcon />
                        </IconButton>
                      </TableCell>
                    </TableHead>
                    <TableBody>
                      {users.map((user: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <IconButton onClick={async () => {
                              var response = await fetch(`/teams/${name}/users`, { method: 'GET', headers });
                              if (response.ok) {
                                const data = await response.json()
                                data.map(async (teamUser: any) => {
                                  if (teamUser.email === user.email) {
                                    for (var i in teamUser.roles) {
                                      await fetch(`/roles/${teamUser.roles[i]}/user/${user.email}?context=${name}`, { method: 'DELETE', headers })
                                    }
                                    fetchUsers()
                                  }
                                })
                              }}} style={{ float: 'right', paddingRight: '10px' }}>
                              <DeleteIcon color="error" fontSize="large"/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  export default Group;
