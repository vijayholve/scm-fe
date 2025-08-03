import { useNavigate } from "react-router-dom";
import {
    Grid,
    Box,
    Button
} from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import api, { userDetails } from "../../../utils/apiService";

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'name',
        headerName: 'Name',
        width: 150
    },
    {
        field: 'schoolbranchName', // Assuming the API returns the name
        headerName: 'School',
        width: 150,
    },
    {
        field: 'instituteName', // Assuming the API returns the name
        headerName: 'Institute',
        width: 150,
    }
];

const ActionWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 6px'
});

// ==============================|| CLASSES LIST ||============================== //

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const [rowCount, setRowCount] = useState(0);

    const handleOnClickDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            api.delete(`api/schoolClasses/delete?id=${id}`).then(() => {
                toast.success('Class deleted successfully!');
                // Refetch data for the current page
                fetchSchoolClasses(paginationModel.page, paginationModel.pageSize);
            }).catch(err => {
                console.error(err);
                toast.error('Failed to delete class.');
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
                        onClick={() => navigate(`/masters/class/edit/${params.row.id}`)}
                        startIcon={<EditOutlinedIcon />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOnClickDelete(params.row.id)}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </ActionWrapper>
            );
        }
    };

    const fetchSchoolClasses = async (page, pageSize) => {
        setLoading(true);
        try {
            const response = await api.post(`api/schoolClasses/getAll/${userDetails.getAccountId()}`, {
                page: page,
                size: pageSize,
                sortBy: "id",
                sortDir: "asc",
                search: ""
            });
            setClasses(response.data.content || []);
            setRowCount(response.data.totalElements || 0);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch classes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchoolClasses(paginationModel.page, paginationModel.pageSize);
    }, [paginationModel.page, paginationModel.pageSize]);

    return (
        <MainCard title="Class" secondary={<SecondaryAction icon={<AddIcon />} title="Add Class" onClick={() => navigate(`/masters/class/add`)} />}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={classes}
                            columns={[...columns, actionColumn]}
                            loading={loading}
                            rowCount={rowCount}
                            pageSizeOptions={[5, 10, 25]}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            paginationMode="server"
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    )
};

export default Classes;
