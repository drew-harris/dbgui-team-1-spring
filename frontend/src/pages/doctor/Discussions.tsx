import { Container, Typography, Card, CardContent, CardHeader, Grid, Box, Button} from '@mui/material';
import { useEffect, useState } from "react";
import AddDiscussionForm from '../../components/discussions/AddPost';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Discussions() {
  const [discussions, setDiscussions] = useState([]);
  const navigate = useNavigate();

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container sx={{ flex: '1 0 auto' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Discussion Board
        </Typography>
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
      <Box sx={{ flexShrink: 0 }}>
        <AddDiscussionForm onAdd={fetchData} />
        <Button onClick={() => navigate("/doctor/dashboard")}>
        Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
        }