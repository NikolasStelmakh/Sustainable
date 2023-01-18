import Button from '@mui/material/Button';
import { gql, useQuery } from '@apollo/client';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CreateTaskModal from './CreateTaskModal/CreateTaskModal';
import { useState } from 'react';

export type Task = {
  id: string;
  name: string;
  start_date: string;
  categorie: {
    id: number;
    title: string;
  };
  recurring_interval?: {
    id: number;
    name: string;
  };
};

const GET_USER_TASKS = gql`
  query GetUserTasks($userId: ID!, $limit: Int, $offset: Int) {
    tasks(userId: $userId, limit: $limit, offset: $offset) {
      id
      name
      start_date
      categorie {
        id
        title
      }
      recurring_interval {
        id
        name
      }
    }
  }
`;
export default function UserTasksList({ userId }: { userId: string }) {
  const [isCreateTaskModalOpened, setIsCreateTaskModalOpened] = useState(false);

  const { loading, error, data, fetchMore } = useQuery(GET_USER_TASKS, {
    variables: { userId, limit: 10 },
    fetchPolicy: 'network-only',
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          setIsCreateTaskModalOpened(true);
        }}
      >
        Create Task
      </Button>

      <h2>Tasks List 🚀</h2>

      {data?.tasks?.length ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {data.tasks.map((t: Task) => (
            <Card key={t.id} sx={{ minWidth: 275, m: 3 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {new Date(Number(t.start_date)).toLocaleString()}
                </Typography>
                <Typography variant="h5" component="div">
                  {t.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {t.categorie.title}
                </Typography>
                {t.recurring_interval ? (
                  <Typography variant="body2">
                    recurring_interval:
                    <br />
                    {`"${t.recurring_interval.name}"`}
                  </Typography>
                ) : null}
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : (
        <div>No tasks found</div>
      )}

      <CreateTaskModal
        userId={userId}
        isOpened={isCreateTaskModalOpened}
        refreshTasksList={fetchMore}
        handleClose={() => setIsCreateTaskModalOpened(false)}
      />
    </div>
  );
}
