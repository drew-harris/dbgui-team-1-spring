/* eslint-disable no-unused-vars */
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddDiscussionForm from "../../components/discussions/AddPost";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/nav/DoctorNavBar";

export default function Discussions() {
  const [discussions, setDiscussions] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/discussions/", {
        headers: {
          authorization: localStorage.getItem("jwt"),
        },
      });
      setDiscussions(response.data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Grid container sx={{ paddingTop: "64px" }}>
          <Grid item xs={10} sx={{ marginLeft: "25%" }}>
            <Container sx={{ flex: "1 0 auto" }}>
              <Box sx={{ marginBottom: 2 }}>
                <AddDiscussionForm onAdd={fetchData} />
              </Box>
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
                        <Typography variant="body1">
                          {discussion.body}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
