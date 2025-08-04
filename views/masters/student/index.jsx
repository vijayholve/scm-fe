import React, { useState, useEffect } from 'react';

// material-ui
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';

// Define the columns specifically for the Students data grid.
// The 'actions' column will be added automatically by the ReusableDataGrid.
const columns = [
    { field: 'rollno', headerName: 'Roll No', width: 90 },
    { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'email', headerName: 'Email', width: 110, flex: 1 },
    { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
    { field: 'address', headerName: 'Address', width: 110, flex: 1 },
    { field: 'className', headerName: 'Class', width: 110, flex: 1 },
    { field: 'divisionName', headerName: 'Division', width: 110, flex: 1 }
];

// ==============================|| SIMPLIFIED STUDENTS LIST ||============================== //

const Students = () => {
    const accountId = userDetails.getAccountId();
    
    // State for filters
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDivisionId, setSelectedDivisionId] = useState('');
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);

    // Fetch classes and divisions for filters
    useEffect(() => {
        // Fetch classes
        api.get(`/api/schoolClasses/getAll/${accountId}`).then(response => {
            setClasses(response.data.content || []);
        }).catch(err => console.error(err));

        // Fetch divisions
        api.get(`/api/divisions/getAll/${accountId}`).then(response => {
            setDivisions(response.data.content || []);
        }).catch(err => console.error(err));
    }, [accountId]);

    // Create filters object for ReusableDataGrid
    const filters = {
        classId: selectedClassId,
        divisionId: selectedDivisionId
    };

    return (
        <MainCard
            title="Manage Students"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/students/add" />}
        >
            <Grid container spacing={gridSpacing}>
                {/* Filter Section */}
                <Grid item xs={12}>
                    <Grid container direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="class-select-label">Class</InputLabel>
                                <Select
                                    labelId="class-select-label"
                                    id="class-select"
                                    value={selectedClassId}
                                    label="Class"
                                    onChange={(event) => setSelectedClassId(event.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {classes.map((cls) => (
                                        <MenuItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id="division-select-label">Division</InputLabel>
                                <Select
                                    labelId="division-select-label"
                                    id="division-select"
                                    value={selectedDivisionId}
                                    label="Division"
                                    onChange={(event) => setSelectedDivisionId(event.target.value)}
                                    disabled={!selectedClassId}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {divisions.map((div) => (
                                        <MenuItem key={div.id} value={div.id}>
                                            {div.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                
                {/* Data Grid */}
                <Grid item xs={12}>
                    <ReusableDataGrid
                        fetchUrl={`/api/users/getAll/${accountId}?type=STUDENT`}
                        columns={columns}
                        editUrl="/masters/student/edit"
                        deleteUrl="/api/users/delete"
                        filters={filters}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Students;