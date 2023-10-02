import {Box, Checkbox, Container, FormControlLabel, Grid, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import ActiveLastBreadcrumb from '../../components/dashboard/ActivateLastBreadcrumb/ActivateLastBreadcrumb';
import {useRecoilValue} from 'recoil';
import {userAtom} from '../../globalVariables/variables';
import PoolRequestUserList from '../../components/mypage/PoolRequestUserList';
import {Count, OrgRequest} from '../../Interfaces';
import {fetchInfoBoxData} from '../../api/calls';
import DonutChart from '../../components/dashboard/DonutChart/DonutChart';
import PoolRequestList from '../../components/mypage/PoolRequestList';
import MuiLoadingSpinner from '../../components/spinner/MuiLoadingSpinner';
import MyPageTable from '../../components/mypage/MyPageTable';
import Info from '../../components/mypage/Info';
import {IUser} from '../../components/mypage/types';
import './MyPage.css';

interface RequestObject {
    own_requests: OrgRequest[];
    org_requests: OrgRequest[];
    history: OrgRequest[];
}

interface Data {
    application_name: string;
    computer_name: string;
    status: string;
}

/**
 * This component renders the MyPage page.
 */
function MyPage() {
    const userInfo = useRecoilValue(userAtom);
    const [showHistory, setShowHistory] = useState(false);
    const [licenseData, setLicenseData] = useState<Data[]>([]);
    const [boxData, setBoxData] = useState<Count[]>([]);
    const [isBoxDataFetched, setIsBoxDataFetched] = useState<boolean>(false);
    const username = userInfo.primary_user_full_name;
    const accessToken = localStorage.getItem('access');
    const [poolRequests, setPoolRequests] = useState<RequestObject>({
        own_requests: [],
        org_requests: [],
        history: []
    });

    const user: IUser = {
        name: 'Bertil Nedregård',
        email: 'bertil.nedregard@trondheim.kommune.no',
        avatarUrl: 'https://example.com/avatar.jpg'
    };

    // Handle showing history
    const handleShowHistory = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowHistory(event.target.checked);
    };

    // Fetch licenses for the user
    useEffect(() => {
        const fetchOwnLicenses = async () => {
            try {
                const response = await fetch(
                    'http://127.0.0.1:8000/api/licenses/userlicenses/',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setLicenseData(data);

                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchOwnLicenses();
    }, [username]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const boxDataResponse: Count[] | undefined = await fetchInfoBoxData(
                    userInfo.organization,
                    userInfo.primary_user_email
                );
                if (boxDataResponse !== undefined) {
                    setBoxData(boxDataResponse);
                }
                setIsBoxDataFetched(true);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);


    // Fetch pool requests
    useEffect(() => {
        const fetchPoolRequests = async () => {
            try {
                const response = await fetch(
                    'http://127.0.0.1:8000/api/requests/get/',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setPoolRequests(data)
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchPoolRequests();
    }, []);

    // Handle approving a request
    const handleApprove = async (requestId: number) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/requests/${requestId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        action: 'approve'
                    })
                }
            );

            if (response.ok) {
                setPoolRequests((prevState) => {
                    const updatedOrgRequests = prevState.org_requests.filter(
                        (request) => request.id !== requestId
                    );
                    return {...prevState, org_requests: updatedOrgRequests};
                });
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error('Error while approving request:', error);
        }
    };

    // Handle disapproving a request
    const handleDisapprove = async (requestId: number) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/requests/${requestId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        action: 'disapprove'
                    })
                }
            );

            if (response.ok) {
                setPoolRequests((prevState) => {
                    const updatedOrgRequests = prevState.org_requests.filter(
                        (request) => request.id !== requestId
                    );
                    return {...prevState, org_requests: updatedOrgRequests};
                });
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error('Error while disapproving request:', error);
        }
    };


    return (
        <>
            {/* Check if box data is fetched, and if true, render the container */}
            {isBoxDataFetched ? (
                <Container>
                    {/* Render breadcrumb navigation */}
                    <Grid item sx={{marginLeft: '-10%'}}>
                        <ActiveLastBreadcrumb/>
                    </Grid>
                    {/* Render user information and layout */}
                    <Box sx={{padding: 2, width: '110%', marginLeft: '-1.5%'}}>
                        <Grid container spacing={2} justifyContent="center">
                            {/* Render user's full name */}
                            <Grid item xs={12} sx={{marginLeft: 8}}>
                                <h2 style={{textAlign: 'left'}}>
                                    {userInfo.primary_user_full_name}
                                </h2>
                            </Grid>
                            {/* Render user avatar and email */}
                            <Grid item xs={12}>
                                <div className="centered">
                                    <Info
                                        name={userInfo.primary_user_full_name}
                                        email={userInfo.primary_user_email}
                                        avatarUrl={user.avatarUrl}
                                    />
                                </div>
                            </Grid>
                            {/* If the user is not a unit head, render the PoolRequestUserList */}
                            {!userInfo.is_unit_head && (
                                <Grid
                                    sx={{
                                        paddingTop: '30px',
                                        paddingBottom: '5px',
                                        width: '90%'
                                    }}>
                                    {/* Render the title for active requests that need approval */}
                                    <Grid item sx={{marginLeft: '1.5%'}}>
                                        <h2 style={{
                                            textAlign: 'left',
                                            marginTop: '1rem',
                                            fontFamily: 'Source Sans Pro,sans-serif'
                                        }}>
                                            Aktive forespørsler (må godkjennes)
                                        </h2>
                                    </Grid>
                                    {/* Render the PoolRequestUserList component */}
                                    <Grid item sx={{marginLeft: '1.5%', width: '91.2%'}}>
                                        <PoolRequestUserList
                                            userRequests={poolRequests.own_requests}
                                            isHistory={false}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            {/* Render the donut chart and table */}
                            <Grid container direction={'row'} id="rowGrid">
                                <Grid item id="donutChartMyPage" xs={14} sm={6}>
                                    <DonutChart
                                        data-testid="donut-chart"
                                        // Pass the chart data (with null coalescing operator for fallback values)
                                        never_used={boxData && boxData[0] ? boxData[0].never_used : 0}
                                        total_licenses={boxData && boxData[0] ? boxData[0].total_licenses : 0}
                                        unused_licenses={boxData && boxData[0] ? boxData[0].unused_licenses : 0}
                                        active_licenses={boxData && boxData[0] ? boxData[0].active_licenses : 0}
                                        width={530}
                                        height={432}
                                        showInformation={false}
                                        title='Min oversikt'
                                    />
                                </Grid>
                                <Grid item xs={14} sm={6} sx={{marginLeft: '-6%'}}>
                                    <MyPageTable data-testid="table" data={licenseData}/>
                                </Grid>
                            </Grid>
                            {/* Render requests and history based on the user's role */}
                            <Grid item xs={10.8}>
                                {/* If the user is a unit head, render requests and history for the unit */}
                                {userInfo.is_unit_head ? (
                                    // Render the title for active requests that need approval
                                    <Box>
                                        <h2 style={{textAlign: 'left'}}>
                                            Aktive forespørsler (må godkjennes)
                                        </h2>
                                        {/* Render the PoolRequestList component for organization requests */}
                                        <Grid sx={{width: '92.6%'}}>
                                            <PoolRequestList
                                                poolRequests={poolRequests.org_requests}
                                                onApprove={handleApprove}
                                                onDisapprove={handleDisapprove}
                                                isOwnRequest={false}
                                                isHistory={false}
                                            />
                                        </Grid>
                                        {/* Render the user's history section */}
                                        <Box
                                            alignItems="center"
                                            sx={{paddingTop: '30px'}}>
                                            <Grid item>
                                                <h2 style={{textAlign: 'left'}}>Min historikk</h2>
                                                {/* Render the "Show History" checkbox */}
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={showHistory}
                                                            onChange={handleShowHistory}
                                                            color="primary"
                                                            sx={{fontFamily: 'Source Sans Pro,sans-serif'}}
                                                            data-testid="vishistorikk-id"
                                                        />
                                                    }
                                                    label={<Typography
                                                        style={{fontFamily: 'Source Sans Pro,sans-serif'}}>Vis
                                                        historikk</Typography>}
                                                    data-testid="vishistorikk-id"

                                                />
                                            </Grid>
                                            {/* Render the PoolRequestList component for the user's history if the "Show History" checkbox is checked */}
                                            {showHistory && (
                                                <Grid item id="history">
                                                    <Box sx={{width: '92.5%'}}>
                                                        <PoolRequestList
                                                            poolRequests={poolRequests.history}
                                                            onApprove={handleApprove}
                                                            onDisapprove={handleDisapprove}
                                                            isOwnRequest={false}
                                                            isHistory={true}
                                                        />
                                                    </Box>
                                                </Grid>
                                            )}
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box alignItems={'center'}>
                                        <Grid container>
                                            <h2 style={{textAlign: 'left'}}>Min historikk</h2>
                                            <Grid container spacing={1} alignItems="left">
                                                <Grid item>
                                                    {/* Render the "Show History" checkbox */}
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={showHistory}
                                                                onChange={handleShowHistory}
                                                                color="primary"
                                                            />
                                                        }
                                                        label={<Typography
                                                            style={{fontFamily: 'Source Sans Pro,sans-serif'}}>Vis
                                                            historikk</Typography>}
                                                        sx={{width: '150px'}}
                                                    />
                                                </Grid>
                                            </Grid>
                                            {/* Render the PoolRequestList component for the user's history if the "Show History" checkbox is checked */}
                                            {showHistory && (
                                                <Grid item>
                                                    <Box sx={{width: '125.5%', marginTop: '-20px'}}>
                                                        <PoolRequestList
                                                            data-testid="request-history"
                                                            poolRequests={poolRequests.history}
                                                            onApprove={handleApprove}
                                                            onDisapprove={handleDisapprove}
                                                            isOwnRequest={false}
                                                            isHistory={true}
                                                        />
                                                    </Box>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
                // Render the MuiLoadingSpinner if the data is still being fetched
            ) : (
                <MuiLoadingSpinner data-testid="loading-spinner"/>
            )}
        </>
    );
}

export default MyPage;
