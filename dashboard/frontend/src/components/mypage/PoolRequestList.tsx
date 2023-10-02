import React from 'react';
import {Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

interface OrgRequest {
    id: number;
    contact_organization: string;
    application_name: string;
    family: string | null;
    family_version: string | null;
    family_edition: string | null;
    request: 'add' | 'remove';
    request_date: string;
    approved: boolean;
    completed: boolean;
    reviewed_by: string | null;
    reviewed_date: string | null;
    spc_id: number;
    requested_by: string;
}

interface PoolRequestListProps {
    poolRequests: OrgRequest[];
    isOwnRequest: boolean;
    isHistory: boolean;
    onApprove: (requestId: number) => void;
    onDisapprove: (requestId: number) => void;
}

/**
 * A component that displays a list of active or historical poolrequests.
 */
const PoolRequestList: React.FC<PoolRequestListProps> = ({
                                                             poolRequests,
                                                             isOwnRequest,
                                                             isHistory = false,
                                                             onApprove,
                                                             onDisapprove
                                                         }) => {
    return (
        // Create a TableContainer component with Paper as its base component
        <TableContainer component={Paper} sx={{marginTop: 4, width: '100%'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                            <b>Lisensnavn </b>
                        </TableCell>
                        <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                            <b>Forespørsel opprettet</b>
                        </TableCell>
                        {!isHistory && (
                            <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                <b>Forespørsel av</b>
                            </TableCell>
                        )}
                        <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                            <b>Forespørsel</b>
                        </TableCell>
                        {isHistory && (
                            <>
                                {/* <TableCell sx={{ fontFamily: 'Source Sans Pro,sans-serif' }}>
                  <b>Prossesert av</b>
                </TableCell> */}
                                <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                    <b>Prossesert dato</b>
                                </TableCell>
                                <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                    <b>Status</b>
                                </TableCell>
                            </>
                        )}
                        {/* Added table headers if both isHistory and isOwnRequest is false*/}
                        {!isOwnRequest && !isHistory ? (
                            <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                <b>Handling</b>
                            </TableCell>
                        ) : (
                            <TableCell></TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Iterate over poolRequests array and generate TableRow for each request */}
                    {poolRequests.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                {request.application_name}
                            </TableCell>
                            <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                {request.request_date}
                            </TableCell>
                            {!isHistory && (
                                <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                    {request.requested_by}
                                </TableCell>
                            )}
                            <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                {request.request == 'add'
                                    ? 'Overfør til lisensportalen'
                                    : 'Kjøp fra lisensportalen'}
                            </TableCell>
                            {/* If isHistory is true, include additional cells for the reviewed_by, reviewed_date, and approval status */}
                            {isHistory && (
                                <>
                                    {' '}
                                    {/*<TableCell sx={{ fontFamily: 'Source Sans Pro,sans-serif' }}>
                    {request.reviewed_by}
              </TableCell>*/}
                                    <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                        {request.reviewed_date}
                                    </TableCell>
                                    <TableCell sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                        {request.approved ? 'Godkjent' : 'Ikke godkjent'}
                                    </TableCell>
                                </>
                            )}
                            {/* If isOwnRequest is false and isHistory is false, include a TableCell with approve and disapprove buttons */}
                            {!isOwnRequest && !isHistory && (
                                <TableCell>
                                    <Stack direction={'row'} spacing={2}>
                                        <Button
                                            onClick={() => onApprove(request.id)}
                                            variant="contained"
                                            color="success"
                                            data-testid="approve-button"
                                            sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                            Godkjenn
                                        </Button>
                                        <Button
                                            onClick={() => onDisapprove(request.id)}
                                            variant="contained"
                                            color="error"
                                            data-testid="disapprove-button"
                                            sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                            Avslå
                                        </Button>
                                    </Stack>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PoolRequestList;
