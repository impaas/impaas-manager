import React, { useState, useEffect } from 'react';
import { ExpandMore } from "@mui/icons-material";
import ExtensionIcon from '@mui/icons-material/Extension';
import StorageIcon from '@mui/icons-material/Storage';
import DeleteIcon from '@mui/icons-material/Delete';
import { tsuruToken } from "../auth/Tsuru";
import { Box, Collapse, Table, TableBody, TableCell,TableHead, TableRow, IconButton } from '@mui/material';

export const headers = { 'Authorization': `Bearer ${tsuruToken}` }

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
  
    return (
      <>
        <TableRow>
          <TableCell>{name}</TableCell>
          <TableCell>
          <IconButton onClick = {async () => {
            var response = await fetch(`/teams/${name}/users`, { method: 'GET', headers });
            if (groupRoles.includes("team-member_service")) {
              if (response.ok) {
                const data = await response.json()
                data.map(async (teamUser: any) => {
                    console.log("removing service perms")
                  await fetch(`/roles/team-member_service/user/${teamUser.email}?context=${name}`, { method: 'DELETE', headers })
                    setGroupRoles([...groupRoles.filter((role) => role !== "team-member_service")])

                //   fetchGroupRoles()
                
                })
              }
            } else {
              if (response.ok) {
                const data = await response.json()
                data.map(async (teamUser: any) => {
  
                  var details : { [key: string]: any } = {
                    "email": teamUser.email,
                    "context": name
                  };
                  
                  var formBody : string[] = [];
                  for (const property in details) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(details[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                  }
                  const formBodyConcat = formBody.join("&");
  
                  const newHeaders = { 'Authorization': `Bearer ${tsuruToken}`, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
                  
                  fetch('/roles/team-member_service/user', {
                    method: 'POST',
                    headers: newHeaders,
                    body: formBodyConcat
                  }).then((response) => { 
                    console.log("adding service perms")
                    setGroupRoles([...groupRoles, "team-member_service"])
                  })
  
                })
              }
            }
          }}>
          <><ExtensionIcon titleAccess="Service" style={{ color: groupRoles.includes("team-member_service") ? "black" : "grey" }}/></>
          </IconButton>
          <IconButton onClick = {() => {}}>
          <><StorageIcon titleAccess="Volume" style={{ color: findColor("team-member_volume") }}/></>
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