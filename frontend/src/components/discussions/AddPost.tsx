/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container} from '@mui/material';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useDoctor } from "../../hooks/useDoctor";
import { DoctorData } from "../../hooks/useDoctor";
import { API_URL } from '../../utils/url';


interface AddDiscussionFormProps {
  onAdd: () => void;
}

const AddDiscussionForm: React.FC<AddDiscussionFormProps> = ({ onAdd }) => {
  const { user } = useContext(AuthContext);
  const { doctor, isLoading, updateDoctor } = useDoctor(user.id);
  const [formData, setFormData] = useState<Partial<DoctorData>>(doctor);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [createdById, setCreatedById] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.post(
        API_URL + '/discussions/',
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
  
      if (onAdd) {
        onAdd();
      }
    } catch (error) {
      console.error('Error adding discussion:', error);
    }
  };
  

  return (
    <Container>
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
        <Button variant="contained" color="primary" type="submit">
          Post
        </Button>
      </form>
    </Container>
  );
};

export default AddDiscussionForm;
