import React, { useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import { toast } from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Import the hooks
import useFetchData from 'hooks/useFetchData';
import usePagination from 'hooks/usePagination';
import apiClient from 'utils/apiService';

const ActionWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 6px',
});

/**
 * A fully reusable DataGrid component that handles its own data fetching,
 * pagination, and actions.
 * @param {object} props
 * @param {string} props.fetchUrl - The API URL to fetch data from.
 * @param {Array<object>} props.columns - The column definitions for the grid.
 * @param {string} props.editUrl - The base URL for the edit page (e.g., '/masters/class/edit').
 * @param {string} props.deleteUrl - The API URL for deleting an item.
 * @param {string} props.viewUrl - The base URL for the view page (e.g., '/masters/timetable/view').
 * @param {object} [props.filters={}] - Optional filters to pass to the fetch hook.
 * @param {boolean} [props.isGetRequest=false] - Whether to use GET instead of POST for fetching data.
 * @param {boolean} [props.showEdit=true] - Whether to show the edit button.
 * @param {boolean} [props.showDelete=true] - Whether to show the delete button.
 * @param {boolean} [props.showView=false] - Whether to show the view button.
 */
const ReusableDataGrid = ({ 
    fetchUrl, 
    columns: propColumns, 
    editUrl, 
    deleteUrl, 
    viewUrl,
    filters = {}, 
    isGetRequest = false,
    showEdit = true,
    showDelete = true,
    showView = false
}) => {
    const navigate = useNavigate();
    const { paginationModel, setPaginationModel } = usePagination();

    const {
        data,
        loading,
        refetch,
    } = useFetchData(fetchUrl, paginationModel, filters, isGetRequest);

    // This effect will refetch data whenever the pagination or filters change.
    // CORRECTED: Removed `refetch` from the dependency array to prevent an infinite loop.
    useEffect(() => {
        if (fetchUrl) {
            refetch();
        }
    }, [paginationModel, filters, fetchUrl]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }
        try {
            await apiClient.delete(`${deleteUrl}?id=${id}`);
            toast.success('Item deleted successfully!');
            refetch();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete item.');
        }
    };
    
    // The handleDelete function is now wrapped in useCallback to ensure it has a stable reference,
    // which is important for performance and preventing unnecessary re-renders of the action column.
    const memoizedHandleDelete = useCallback(handleDelete, [deleteUrl, refetch]);

    const actionColumn = useMemo(() => ({
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        sortable: false,
        filterable: false,
        hideable: false,
        renderCell: (params) => (
            <ActionWrapper>
                {showView && viewUrl && (
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`${viewUrl}/${params.row.id}`)}
                        startIcon={<VisibilityIcon />}
                        title="View"
                    >
                        View
                    </Button>
                )}
                {showEdit && editUrl && (
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`${editUrl}/${params.row.id}`)}
                        startIcon={<EditOutlinedIcon />}
                    >
                        Edit
                    </Button>
                )}
                {showDelete && deleteUrl && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => memoizedHandleDelete(params.row.id)}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                )}
            </ActionWrapper>
        ),
    }), [navigate, editUrl, deleteUrl, viewUrl, showEdit, showDelete, showView, memoizedHandleDelete]);

    const columns = useMemo(() => [...propColumns, actionColumn], [propColumns, actionColumn]);

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={data?.content || []}
                columns={columns}
                // loading={loading}
                rowCount={data?.totalElements || 0}
                pageSizeOptions={[5, 10, 25]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode="server"
                getRowId={(row) => row.id}
            />
        </Box>
    );
};

export default ReusableDataGrid;
