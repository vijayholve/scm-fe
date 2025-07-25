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
import VisibilityIcon from '@mui/icons-material/Visibility';
import api, { userDetails } from '../../../utils/apiService';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'className',
        headerName: 'Class Name',
        width: 150,
        editable: true
    },
    {
        field: 'divisionName',
        headerName: 'Division Name',
        width: 110,
        editable: true
    }
];


const ActionWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 6px'
});
// ==============================|| USERS ||============================== //

const Timetables = () => {
    const [timetables, setTimetables] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    console.log('User:', user);

    const handleOnClickDelete = (data) => {
        if (data.id) {
            api.delete(`api/timetable/delete?id=${data?.id}`).then(response => {
                const filterTimetables = timetables.filter(timetable => timetable.id !== data.id);
                setTimetables([...filterTimetables]);
            }).catch(err => console.error(err));
        }
    }

    const actionColumn = {
        field: 'actions',
        headerName: 'Actions',
        width: 250,
        minWidth: 250,
        hideable: false,
        renderCell: (params) => {
            return (
                <ActionWrapper>
                    <Button
                        variant="outlined"
                        id="approve_user"
                        priority="primary"
                        onClick={(e) => navigate(`/masters/timetable/edit/${params.row.id}`)}
                        disabled={false}
                        startIcon={<EditOutlinedIcon />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        id="reject_user"
                        priority="primary"
                        onClick={(e) => handleOnClickDelete(params.row)}
                        disabled={false}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                    <Button variant="outlined" id="approve_user" priority="primary" onClick={(e) => navigate(`/masters/timetable/view/${params.row.id}`)} disabled={false} startIcon={<VisibilityIcon />}></Button>
                </ActionWrapper>
            );
        }
    };
    const fetchTimetables = (page, pageSize) => {
        api.post(`api/timetable/getAll/${userDetails.getAccountId()}?type=TEACHER`, {
            page: page,
            size: pageSize,
            sortBy: "id",
            sortDir: "asc",
            search: ""
        }).then(response => {
            setTimetables(response.data.content || []);
            setRowCount(response.data.totalElements || 0);
        }).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchTimetables(page, pageSize);
    }, [page, pageSize]);

    return (
        <MainCard title="TimeTables" secondary={<SecondaryAction icon={<AddIcon onClick={(e) => navigate(`/masters/timetable/add`)} />} />}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    {/* <SubCard title="Teachers"> */}
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={timetables}
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

export default Timetables;

