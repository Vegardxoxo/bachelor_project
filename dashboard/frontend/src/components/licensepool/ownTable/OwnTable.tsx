import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {OwnOrgData} from '../../../Interfaces';
import ReleaseButton from "../ReleaseButton/ReleaseButton";
import {userAtom} from "../../../globalVariables/variables";
import {useRecoilValue} from "recoil";


interface RowProps {
    row: OwnOrgData;
}

interface Props {
    data: OwnOrgData[];
    handleSorting: (sortBy: string) => void;
}


/**
 * Custom row for the OwnTable component
 */
function Row(props: RowProps) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const userData = useRecoilValue(userAtom)

    // Function to calculate the time since last used in a readable format
    function timeSince(lastUsed: string | null): string {
        if (!lastUsed) return 'Aldri tatt i bruk/registrert   .';

        const now = new Date();
        const lastUsedDate = new Date(lastUsed);
        const diffInDays = Math.floor((now.getTime() - lastUsedDate.getTime()) / (1000 * 60 * 60 * 24));
        return `${lastUsedDate.toLocaleDateString()} (${diffInDays} dager siden)`;
    }

    // Render the row component and its content
    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                    {row.application_name}
                </TableCell>
                <TableCell sx={{
                    textAlign: "left",
                    paddingRight: "20px",
                    fontFamily: 'Source Sans Pro,sans-serif'
                }}>{row.primary_user_full_name}</TableCell>
                <TableCell sx={{
                    textAlign: "left",
                    paddingRight: "20px",
                    fontFamily: 'Source Sans Pro,sans-serif'
                }}>{row.computer_name}</TableCell>
                <TableCell sx={{
                    textAlign: "left",
                    paddingRight: "20px", fontFamily: 'Source Sans Pro,sans-serif'
                }}>{row.details.length > 0 ? row.details[0].status : 'No status available'}</TableCell>

            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1, marginLeft: '70px', paddingTop: '10px', paddingBottom: '10px'}}>
                            <Typography variant="h6" gutterBottom component="div"
                                        sx={{fontFamily: 'Source Sans Pro,sans-serif', paddingBottom: '5px'}}>
                                {row.application_name}
                            </Typography>

                            <Table size="small" aria-label="purchases" sx={{
                                [`& .${tableCellClasses.root}`]: {
                                    borderBottom: "none"
                                }
                            }}>
                                <colgroup>
                                    <col style={{width: '35%'}}/>
                                    <col style={{width: '30%'}}/>
                                    <col style={{width: '35%%'}}/>
                                </colgroup>
                                <TableHead sx={{borderBottom: '#eee solid'}}>
                                    <TableRow>
                                        <TableCell align="left" sx={{
                                            fontFamily: 'Source Sans Pro,sans-serif',
                                            fontSize: '12pt',
                                            fontWeight: 800
                                        }}><b>Sist åpnet</b></TableCell>
                                        <TableCell align="left" sx={{
                                            fontFamily: 'Source Sans Pro,sans-serif',
                                            fontSize: '12pt',
                                            fontWeight: 800
                                        }}><b>Pris</b></TableCell>
                                        <TableCell align={"left"} sx={{
                                            fontFamily: 'Source Sans Pro,sans-serif',
                                            fontSize: '12pt',
                                            fontWeight: 800
                                        }}><b>Frigjør</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.details.map((detailRow) => (
                                        <TableRow key={detailRow.id}>
                                            <TableCell component="th" scope="row" sx={{
                                                fontFamily: 'Source Sans Pro,sans-serif',
                                                fontSize: '11pt'
                                            }}>
                                                {timeSince(detailRow.last_used)}
                                            </TableCell>
                                            <TableCell sx={{
                                                fontFamily: 'Source Sans Pro,sans-serif',
                                                fontSize: '11pt'
                                            }}>{detailRow.price},-</TableCell>
                                            <TableCell
                                                sx={{fontFamily: 'Source Sans Pro,sans-serif', fontSize: '11pt'}}>
                                                {userData.primary_user_email === row.primary_user_email || userData.is_unit_head ? (
                                                    <ReleaseButton
                                                        spc_id={detailRow.id}
                                                        primary_user_email={row.primary_user_email}
                                                        application_name={row.application_name}
                                                        organization={row.organization}
                                                        price={detailRow.price}
                                                    />
                                                ) : <p>Ingen tillatelse</p>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


/**
 * Table component for the LicenseInfo page.
 * @param data - The data to be displayed in the table
 * @param handleSorting - Function to handle sorting of the table
 */
export default function OwnTable({data, handleSorting}: Props) {

    const software = data;
    const [loaded, setLoaded] = React.useState(false);

    // Check if the software data is loaded
    useEffect(() => {
        if ((software.length) > 0) {
            setLoaded(true);
        }
    }, [software]);

    // Render the table component and its content
    return (
        <>
            {loaded &&
                <div style={{width: "103%"}}>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <colgroup>
                                <col style={{width: '5%'}}/>
                                <col style={{width: '30%'}}/>
                                <col style={{width: '25%'}}/>
                                <col style={{width: '20%'}}/>
                                <col style={{width: '10%'}}/>
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell/>
                                    <TableCell onClick={() => handleSorting("application_name")}
                                               style={{
                                                   cursor: "pointer",
                                                   fontFamily: 'Source Sans Pro,sans-serif',
                                                   fontSize: '12pt',
                                                   fontWeight: 800
                                               }}><b>Lisensnavn &#9660;</b></TableCell>
                                    <TableCell onClick={() => handleSorting("primary_user_full_name")}
                                               align={"left"} style={{
                                        cursor: "pointer",
                                        fontFamily: 'Source Sans Pro,sans-serif',
                                        fontSize: '12pt',
                                        fontWeight: 800
                                    }}><b>Bruker &#9660;</b></TableCell>
                                    <TableCell onClick={() => handleSorting("computer_name")}
                                               align={"left"} style={{
                                        cursor: "pointer",
                                        fontFamily: 'Source Sans Pro,sans-serif',
                                        fontSize: '12pt',
                                        fontWeight: 800
                                    }}><b>Løpenummer &#9660;</b></TableCell>
                                    <TableCell onClick={() => handleSorting("status")}
                                               align={"left"} style={{
                                        cursor: "pointer",
                                        fontFamily: 'Source Sans Pro,sans-serif',
                                        fontSize: '12pt',
                                        fontWeight: 800
                                    }}><b>Status &#9660;</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {software.map((user, index) => (
                                    <Row key={index} row={user}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>}
        </>
    );
}