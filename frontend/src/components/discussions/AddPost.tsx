import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Typography } from '@mui/material';

interface AddDiscussionFormProps {
  onAdd: () => void;
}

const AddDiscussionForm: React.FC<AddDiscussionFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [createdById, setCreatedById] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      await axios.post(
        'http://localhost:8000/discussions/',
        {
          title,
          body,
          createdById,
        },
        {
          headers: {
            Authorization: localStorage.getItem('jwt'),
          },
        }
      );
  
      setTitle('');
      setBody('');
      setCreatedById('');
  
      if (onAdd) {
        onAdd();
      }
    } catch (error) {
      console.error('Error adding discussion:', error);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h2" gutterBottom>
        Add Discussion
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <TextField
          label="Body"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
        />
        <TextField
          label="Created By"
          fullWidth
          margin="normal"
          value={createdById}
          onChange={(event) => setCreatedById(event.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Add Discussion
        </Button>
      </form>
    </Container>
  );
};

export default AddDiscussionForm;
