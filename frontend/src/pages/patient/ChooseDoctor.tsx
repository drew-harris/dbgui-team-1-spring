/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Paper, InputBase, Divider, TextField } from "@mui/material";
import { Search, Menu } from "@mui/icons-material";

export default function ChooseDoctor() {
    const [doctors, setDoctors] = useState([]);
    const [filterDoctor, setFilterDoctor] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // const handleSearch = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const response = await fetch(`http://localhost:8000/doctors/search?query=${search}`);
    //         const data = await response.json();
    //         setDoctors(data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const handleChoose = (doctorId) => {
        navigate(`/patient/dashboard`);
    };

    // const handleFilter = (doctor) => {
    //     const query = searchTerm.toLowerCase();
    //     return (
    //         doctor.firstName.toLowerCase().includes(query) ||
    //         doctor.lastName.toLowerCase().includes(query) ||
    //         doctor.practice.toLowerCase().includes(query) ||
    //         doctor.email.toLowerCase().includes(query) ||
    //         doctor.userName.toLowerCase().includes(query) ||
    //         doctor.location.toLowerCase().includes(query)
    //     )
    // };

    return (
        <div>
            <TextField id="outlined-basic" label="Search for doctor" variant="outlined"></TextField>
            {/* <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <Menu />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Doctors"
                    inputProps={{ 'aria-label': 'search' }}
                />
                <TextField 
                    sx={{
                        width: '100%',
                        height: '100%',
                        margin: '8px',
                    }}
                    variant="outlined"
                    // onChange={(e) => handleSearch(e.target.value)}
                />

                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <Search />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper> */}
            {/* <ul>
                {
                    doctors.map((doctor) => (
                        <li key={doctor.id}>
                            {doctor.firstName} {doctor.lastName} ({doctor.practice})
                            <button onClick={() => handleChoose(doctor.id)}>Choose</button>
                        </li>
                    ))}
            </ul> */}
        </div>
    );
}