import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import PostCard from "../../components/discussions/Postcard";
import Stack from '@mui/joy/Stack';


export default function Discussions() {
  const [discussions, setDiscussions] = useState(null);

  const fetchData = async () => {
    const response = await fetch("http://localhost:8000/discussions/", {
      headers: {
        authorization: localStorage.getItem("jwt"),
      },
    });
    const data = await response.json();

    setDiscussions(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <div>
        <h1>Discussions</h1>
      </div>
      <div>{JSON.stringify(discussions)}</div>
      <PostCard/>
      <div>
        <form>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </form>
      </div>
    </main>
  );
}
