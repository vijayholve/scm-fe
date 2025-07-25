import { useNavigate } from "react-router-dom";
// material-ui
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
//import Link from '@mui/material/Link';
//import MuiTypography from '@mui/material/Typography';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';

import api, { userDetails } from '../../../utils/apiService';
import { useEffect, useState } from "react";

const columns = [
  {
    field: 'examType', // e.g., 'Midterm', 'Final', 'Quiz 1'
    headerName: 'Exam Type',
    width: 150,
    editable: true,
  },
  {
    field: 'examScore', // The score obtained by the student
    headerName: 'Score',
    width: 100,
    type: 'number', // Helps with sorting and filtering numerical data
    editable: true,
  },
  {
    field: 'maxScore', // The maximum possible score for the exam
    headerName: 'Max Score',
    width: 100,
    type: 'number',
    editable: true,
  },
  {
    field: 'examDate', // The date the exam was taken
    headerName: 'Exam Date',
    width: 130,
    type: 'date', // Or 'string' if you store it as text
    editable: true,
  },
  {
    field: 'grade', // The letter grade (e.g., 'A', 'B+', 'C')
    headerName: 'Grade',
    width: 90,
    editable: true,
  },
  {
    field: 'passStatus', // Whether the student passed or failed
    headerName: 'Pass Status',
    width: 120,
    editable: true,
    type: 'boolean', // If it's a true/false status
  },
];
const ActionWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  padding: '6px 6px'
});
// ==============================|| USERS ||============================== //

const Exams = () =>  {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const handleOnClickDelete = (data) => {
    if (data.rollno) {
      api.delete(`api/users/delete?id=${data?.id}`).then(response => {
        const filterExams = teachers.filter(exam => exam.rollno !== data.rollno);
        setExams([...filterExams]);
      }).catch(err => console.error(err));
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
            onClick={(e) => navigate(`/masters/exams/edit/${params.row.id}`)}
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
  const fetchExams = (page, pageSize) => {
     api.post(`api/users/getAll/${userDetails.getAccountId()}?type=EXAM`, {
       page: page,
       size: pageSize,
       sortBy: "id",
       sortDir: "asc",
       search: ""
     }).then(response => {
       setExams(response.data.content || []);
       setRowCount(response.data.totalElements || 0);
     }).catch(err => console.error(err));
   };
 
   useEffect(() => {
     fetchExams(page, pageSize);
   }, [page, pageSize]);

  return (
    <MainCard title="Exams" secondary={<SecondaryAction icon ={<AddIcon onClick={(e) => navigate(`/masters/exams/add`)} />}  />}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12}>
          {/* <SubCard title="Teachers"> */}
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={exams}
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
          {/* </SubCard> */}
        </Grid>
      </Grid>
    </MainCard>
  )
};

export default Exams;
