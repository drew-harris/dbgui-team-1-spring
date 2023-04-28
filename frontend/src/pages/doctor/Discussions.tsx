/* eslint-disable no-unused-vars */
import {
    Box, Card,
    CardContent,
    CardHeader, Container, Grid, Typography
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddDiscussionForm from "../../components/discussions/AddPost";
import NavBar from "../../components/nav/DoctorNavBar";
import { API_URL } from "../../utils/url";



export default function Discussions() {

  const [discussions, setDiscussions] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL + "/discussions/", {
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
      <br>
      </br>
      <br>
      </br>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center">
                Discussion Board
        </Typography>
        <Grid container>
          <Grid item xs={10}>
            <Container>
              <Box>
                <AddDiscussionForm onAdd={fetchData} />
              </Box>
              
              <Grid container spacing={3}>
                {discussions.sort((a, b) => {
                    var date1 = new Date(a.createdAt);
                    var date2 = new Date(b.createdAt);
                    return date2.getTime() - date1.getTime();
                  }).map((discussion) => (
                  <Grid item xs={12} key={discussion.id}>
                    <Card>
                      <CardHeader
                        title={discussion.title}
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
