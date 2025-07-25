import { useNavigate } from "react-router-dom";
// material-ui
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
// Make sure you have a toast library installed and imported, e.g., react-hot-toast
import { toast } from 'react-hot-toast'; 

import api, { userDetails } from '../../../utils/apiService';
import { useEffect, useState, useCallback } from "react";

const columns = [
    { field: 'rollno', headerName: 'Roll No', width: 90 },
    {
        field: 'userName',
        headerName: 'User Name',
        width: 150,
        editable: true
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: true
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 110,
        editable: true
    },
    {
        field: 'mobile',
        headerName: 'Mobile',
        width: 110,
        editable: true
    },
    {
        field: 'address',
        headerName: 'Address',
        width: 110,
        editable: true
    },
    {
        field: 'className', // Assuming your student data has a className field
        headerName: 'Class',
        width: 110,
        editable: false
    },
    {
        field: 'divisionName', // Assuming your student data has a divisionName field
        headerName: 'Division',
        width: 110,
        editable: false
    }
];

const ActionWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 6px'
});

const Students = () => {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);

    // State for filters
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDivisionId, setSelectedDivisionId] = useState('');
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [subjects, setSubjects] = useState([]); // Added for the example's usage in fetchData
    const [teachers, setTeachers] = useState([]); // Added for the example's usage in fetchData

    // Assuming userDetails.getAccountId() provides the accountId
    const accountId = userDetails.getAccountId(); // Get accountId directly here


    const handleOnClickDelete = (data) => {
        if (data.rollno) {
            api.delete(`api/users/delete?id=${data?.id}`).then(response => {
                const filterStudents = students.filter(student => student.rollno !== data.rollno);
                setStudents([...filterStudents]);

                toast.success('Student deleted successfully!');
            }).catch(err => {
                console.error(err);
                toast.error('Failed to delete student.');
            });
        }
    }

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 190,
    minWidth: 190,
    hideable: false,
    renderCell: (params) => {
      return (
        <ActionWrapper>
          <Button
            variant="outlined"
            id="approve_user"
            priority="primary"
            onClick={(e) => navigate(`/masters/student/edit/${params.row.id}`)}
            disabled={false}
            startIcon={<EditOutlinedIcon />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            id="reject_user"
            priority="primary"
            onClick={() => handleOnClickDelete(params.row)}
            disabled={false}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </ActionWrapper>
      );
    }
  };
  const fetchStudents = (page, pageSize) => {
     api.post(`api/users/getAll/${userDetails.getAccountId()}?type=STUDENT`, {
       page: page,
       size: pageSize,
       sortBy: "id",
       sortDir: "asc",
       search: ""
     }).then(response => {
       setStudents(response.data.content || []);
       setRowCount(response.data.totalElements || 0);
     }).catch(err => console.error(err));
   };
 
   useEffect(() => {
     fetchStudents(page, pageSize);
   }, [page, pageSize]);

    return (
        <MainCard title="Students" secondary={<SecondaryAction icon={<AddIcon onClick={(e) => navigate(`/masters/students/add`)} />} />}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
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
                                    disabled={!selectedClassId} // Disable division selection if no class is selected
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
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={students}
                                    getRowId={(row) => row?.id}
                                    columns={[...columns, actionColumn]}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5
                                            }
                                        }
                                    }}
                                    pageSizeOptions={[5]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    )
};

export default Students;