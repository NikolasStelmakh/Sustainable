import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export type User = {
  id: string;
  name: string;
};

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

export default function Header({
  setActiveUser,
  activeUser,
}: {
  setActiveUser: (user: User) => void;
  activeUser?: User;
}) {
  const { loading, error, data } = useQuery(GET_USERS);

  useEffect(() => {
    if (!activeUser && data?.users.length) setActiveUser(data.users[0]);
  }, [activeUser, data, setActiveUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const handleChange = (event: SelectChangeEvent) => {
    setActiveUser({
      id: event.target.value,
      name: data.users.filter((o: User) => o.id === event.target.value)[0].name,
    });
  };

  return (
    <div>
      {activeUser?.name ? (
        <Box sx={{ display: 'inline-flex', m: 3, p: 1, alignItems: 'center' }}>
          <Box sx={{ p: 1, m: 1, minWidth: '200px' }}>
            <FormControl fullWidth>
              <InputLabel id="active-user-select">Users</InputLabel>
              <Select
                labelId="active-user-select"
                id="user-select"
                value={activeUser.id}
                label="Age"
                onChange={handleChange}
              >
                {data.users.map(({ id, name }: User) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ p: 1, m: 1 }}>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>
              {activeUser.name.split(' ')[0][0]}
              {activeUser.name.split(' ').length > 1
                ? activeUser.name.split(' ')[1][0]
                : null}
            </Avatar>
          </Box>
        </Box>
      ) : null}
    </div>
  );
}
