
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function MakePostCard(id, createdAt, createdById, title, body) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {body}
          </Typography>
          <Typography> 
            <p>Posted by: {createdById} on {new Date(createdAt).toLocaleString()}</p>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}