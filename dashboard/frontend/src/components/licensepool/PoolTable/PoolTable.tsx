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
import {LicensePoolData} from '../../../Interfaces';
import BuyButton from "../BuyButton/BuyButton";


interface RowProps {
    row: LicensePoolData;
}

interface Props {
    data: LicensePoolData[];
    handleSorting: (sortBy: string) => void;
}

/**
 * Custom row component for the LicensePool Table component
 * @param props - the row properties
 */
function Row(props: RowProps) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    // Render a single row and its collapsible content
    return (
        <React.Fragment>
            { /* Main row content */}
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon/>
                        ) : (
                            <KeyboardArrowDownIcon data-testid="KeyboardArrowDownIcon"/>
                        )}
                    </IconButton>

                </TableCell>
                <TableCell component="th" scope="row"
                           style={{textAlign: "left", fontFamily: 'Source Sans Pro,sans-serif'}}>
                    {row.application_name}
                </TableCell>
                <TableCell align="left" style={{
                    paddingRight: "20px",
                    fontFamily: 'Source Sans Pro,sans-serif'
                }}>{row.freed_by_organization}</TableCell>

                { /* Collapsible content row */}
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1, marginLeft: '70px', paddingTop: '10px', paddingBottom: '10px'}}>
                            <Typography variant="h6" gutterBottom component="div"
                                        sx={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                {row.application_name}
                            </Typography>

                            { /* Sub-table with additional details */}
                            <Table size="small" aria-label="purchases" sx={{
                                [`& .${tableCellClasses.root}`]: {
                                    borderBottom: "none"
                                }
                            }}>
                                <colgroup>
                                    <col style={{width: '45%'}}/>
                                    <col style={{width: '35%'}}/>
                                    <col style={{width: '20%'}}/>
                                </colgroup>
                                <TableHead sx={{borderBottom: '#eee solid'}}>
                                    <TableRow>
                                        <TableCell align="left" sx={{
                                            fontFamily: 'Source Sans Pro,sans-serif',
                                            fontSize: '12pt',
                                            fontWeight: 800
                                        }}><b>Dato lagt til</b></TableCell>
                                        <TableCell align="left" sx={{
                                            fontFamily: 'Source Sans Pro,sans-serif',
                                            fontSize: '12pt',
                                            fontWeight: 800
                                        }}><b>Pris</b></TableCell>
                                        <TableCell align="left" sx={{
                                            fontFamily: 'Source Sans Pro,sans-serif',
                                            fontSize: '12pt',
                                            fontWeight: 800
                                        }}><b>Kjøp</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.details.map((detailRow) => (
                                        <TableRow key={detailRow.id}>
                                            <TableCell sx={{
                                                fontFamily: 'Source Sans Pro,sans-serif',
                                                fontSize: '12pt'
                                            }}>{detailRow.date_added ?? 'Ukjent'}</TableCell>
                                            <TableCell align="left" sx={{
                                                fontFamily: 'Source Sans Pro,sans-serif',
                                                fontSize: '12pt'
                                            }}>{detailRow.price ?? 500},-</TableCell>
                                            <TableCell> <BuyButton spc_id={detailRow.spc_id}
                                                                   application_name={row.application_name}
                                            />
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
 * Main table component for the LicensePool page
 * @param data - the data to be displayed in the table
 * @param handleSorting - the function to be called when the user clicks a column header
 */
export default function PoolTable({data, handleSorting}: Props) {
    const software = data;
    const [loaded, setLoaded] = React.useState(false);

    // Set loaded state when data is received
    useEffect(() => {
        if ((software.length) > 0) {
            setLoaded(true);
        }

    }, [software]);

    // Render the main table
    return (
        <>
            {loaded ? (
                <div style={{width: "98.5%", marginLeft: '-0.4%'}}>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <colgroup>
                                <col style={{width: '5%'}}/>
                                <col style={{width: '50%'}}/>
                                <col style={{width: '45%'}}/>
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{textAlign: "center"}}/>
                                    <TableCell onClick={() => handleSorting("application_name")}
                                               style={{
                                                   cursor: "pointer",
                                                   textAlign: "left",
                                                   fontFamily: 'Source Sans Pro,sans-serif',
                                                   fontSize: '12pt',
                                                   fontWeight: 800
                                               }}>
                                        <b>Lisensnavn &#9660;</b>
                                    </TableCell>
                                    <TableCell onClick={() => handleSorting("freed_by_organization")} align={"left"}
                                               style={{
                                                   cursor: "pointer",
                                                   textAlign: "left",
                                                   fontFamily: 'Source Sans Pro,sans-serif',
                                                   fontSize: '12pt'
                                               }}>
                                        <b>Frigitt av &#9660;</b>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {software.map((user, index) => (
                                    <Row key={index} row={user}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ) : <h3>Velg programvare </h3>}
        </>
    );
}
