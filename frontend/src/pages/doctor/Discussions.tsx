import { Container, Typography, Card, CardContent, CardHeader, Grid } from '@mui/material';
import { useEffect, useState } from "react";
import AddDiscussionForm from '../../components/discussions/AddPost';
import axios from 'axios';

export default function Discussions() {
  const [discussions, setDiscussions] = useState([]);

  const fetchData = async () => {
    try{
    const response = await axios.get("http://localhost:8000/discussions/", {
      headers: {
        authorization: localStorage.getItem("jwt"),
      },
    });
    setDiscussions(response.data);
    } catch(error) {
    console.error('Error fetching discussions:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Discussion Board
      </Typography>
      <AddDiscussionForm onAdd={fetchData} />
      <Grid container spacing={3}>
        {discussions.map((discussion) => (
          <Grid item xs={12} key={discussion.id}>
            <Card>
              <CardHeader
                title={discussion.title}
                subheader={`Created by ${discussion.createdById} at ${discussion.createdAt}`}
              />
              <CardContent>
                <Typography variant="body1">{discussion.body}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
        }