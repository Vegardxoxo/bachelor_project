import * as React from 'react';
import {Grid} from '@mui/joy';
import {DataGrid} from '@mui/x-data-grid';


interface Data {
    application_name: string;
    computer_name: string;
    status: string;
}


interface MyPageTableProps {
    data: Data[];
}


interface NorwegianStatuses {
    [key: string]: string;
}

/**
 * This component renders a table with the licenses to the user.
 * @param data The data to be rendered in the table.
 */
function MyPageTable({data}: MyPageTableProps) {
    // Define an object to map status values to their Norwegian counterparts
    const norwegianStatuses: NorwegianStatuses = {
        active: 'Aktiv',
        inactive: 'Ubrukt',
        pending: 'Venter',
    };

    // Define the columns for the DataGrid component
    const columns = [{field: 'application_name', headerName: 'Lisensnavn', flex: 3}, {
        field: 'status',
        headerName: 'Status',
        flex: 1
    },];

    // Create a new array with the same structure as the input data, but with status values translated to Norwegian
    const norwegianData = data.map((row, index) => ({
        id: index,
        application_name: row.application_name,
        computer_name: row.computer_name,
        status: norwegianStatuses[row.status.toLowerCase()] ?? row.status,
    }));

    // Render the DataGrid component with the formatted data
    return (
        <Grid container sx={{marginTop: '3%'}}>
            <div
                style={{
                    padding: '30px',
                    marginTop: '20%',
                    maxWidth: '455px',
                    margin: '40px auto',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    height: '100%',
                    overflow: 'auto',
                    maxHeight: '450px',
                    width: '100%',
                    backgroundColor: '#fff',
                }}
            >
                <DataGrid
                    style={{fontFamily: 'Source Sans Pro,sans-serif',}}
                    rows={norwegianData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    autoHeight
                    disableSelectionOnClick
                />
            </div>
        </Grid>
    );
}

export default MyPageTable;
