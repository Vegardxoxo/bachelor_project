import * as React from 'react';
import {useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Box, Grid, Stack} from '@mui/material';
import ActiveLastBreadcrumb from '../dashboard/ActivateLastBreadcrumb/ActivateLastBreadcrumb';
import {useRecoilValue} from 'recoil';
import {userAtom} from '../../globalVariables/variables';

interface Leaderboard {
    organization: string;
    active_percentage: number;
    rank: number;
}

/**
 * Renders the Leaderboard component.
 * The Leaderboard component shows the user's unit rank and the top 25 units based on their active percentage.
 */
export function Leaderboard() {
    // State to store fetched leaderboard data
    const [data, setData] = React.useState<Leaderboard[]>([]);
    // Retrieve access token and user information
    const accessToken = localStorage.getItem('access');
    const userInfo = useRecoilValue(userAtom);

    // Fetch leaderboard data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/licenses/leaderboard/?organization=${userInfo.organization}`,
                    {
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json',
                            authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setData(data.leaderboard);
                }
            } catch (error) {
                console.error('Error while fetching data:', error);
            }
        };
        fetchData();
    }, []);


    /*Renders the Leaderboard table. The first table shows the users unit rank.
    And the second table shows the top 25 units based on their active percentage */
    return (
        <>
            <div>
                <Grid>
                    <ActiveLastBreadcrumb/>
                </Grid>
                <Box
                    data-testid="leaderboard"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        marginTop: '20px',
                        marginLeft: '1.8%',
                        width: '96.3%'
                    }}>
                    <Grid justifyContent={'center'} alignItems={'center'} width={'75%'}>
                        <Stack direction={'column'} width={'90%'}>
                            {/* Leaderboard title and description */}
                            <h2
                                style={{
                                    fontFamily: 'Source Sans Pro, sans serif',
                                    fontSize: '30pt',
                                    marginTop: -0.6,
                                    fontWeight: 400
                                }}>
                                Ledertavle
                            </h2>
                            <p
                                style={{
                                    fontStyle: 'italic',
                                    marginTop: '-10px',
                                    marginBottom: '40px'
                                }}>
                                Ledertavlen gir deg en visuell representasjon av hvordan din
                                enhet presterer i forhold til andre enheter, basert på andelen
                                av aktive lisenser. Topplisten gir en oversikt over de 25
                                enhetene med flest aktive lisenser, og indikerer dermed hvilke
                                enheter som har færrest ubrukte lisenser.{' '}
                            </p>
                        </Stack>

                        {/* User's unit rank table */}
                        <p>Din plassering</p>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{
                                    minWidth: 650,
                                    fontFamily: 'Source Sans Pro, sans serif',
                                    fontWeight: '700',
                                    backgroundColor: '#C5DAF2'
                                }}
                                aria-label="simple table">
                                <colgroup>
                                    <col style={{width: '10%'}}/>
                                    <col style={{width: '80%'}}/>
                                    <col style={{width: '10%'}}/>
                                </colgroup>
                                <TableHead>
                                    <TableRow
                                        sx={{fontWeight: 'bold', padding: '10px'}}></TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Render user's unit rank */}
                                    {data.map((row, index) => {
                                        if (userInfo.organization === row.organization) {
                                            return (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0,
                                                            backgroundColor: '#80cc9f'
                                                        }
                                                    }}>
                                                    <TableCell component="th" scope="row">
                                                        {row.rank}
                                                    </TableCell>
                                                    <TableCell align="left">{row.organization}</TableCell>
                                                    <TableCell align="center">
                                                        {row.active_percentage}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <div style={{padding: '10px'}}></div>
                        {/* Top 25 units table */}
                        <p>Topplisten</p>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{
                                    minWidth: 650,
                                    fontFamily: 'Source Sans Pro, sans serif',
                                    borderRadius: '50px',
                                    fontWeight: '700'
                                }}
                                aria-label="simple table">
                                <colgroup>
                                    <col style={{width: '10%'}}/>
                                    <col style={{width: '80%'}}/>
                                    <col style={{width: '10%'}}/>
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell
                                            align="left"
                                            sx={{
                                                fontFamily: 'Source Sans Pro, sans serif',
                                                fontSize: 'medium',
                                                fontWeight: 900
                                            }}>
                                            Enhet
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontFamily: 'Source Sans Pro, sans serif',
                                                fontSize: 'medium',
                                                fontWeight: 900
                                            }}>
                                            Prosent
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Render top 25 units */}
                                    {data.slice(0, 25).map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:last-child td, &:last-child th': {border: 0}
                                            }}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{fontWeight: 500}}>
                                                {row.rank}
                                            </TableCell>
                                            <TableCell align="left">{row.organization}</TableCell>
                                            <TableCell align="center">
                                                {row.active_percentage}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Box>
            </div>
        </>
    );
}
