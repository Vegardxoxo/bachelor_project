import {Card, CardActionArea, CardContent} from '@mui/material';
import CardOverflow from '@mui/joy/CardOverflow';
import BarChartIcon from '@mui/icons-material/BarChart';
import {useNavigate} from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import React, {useEffect} from 'react';
import {userAtom} from '../../../globalVariables/variables';

interface Leaderboard {
    organization: string;
    active_percentage: number;
    rank: number;
}

/**
 * Returns a LeaderboardBox card with information on the organization's rank in the leaderboard.
 */
export function LeaderboardBox() {

    // Get the function for navigating to different routes
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/leaderboard`);
    };

    // Declare and initiate state variables
    const [data, setData] = React.useState<Leaderboard[]>([]);
    const accessToken = localStorage.getItem('access');
    const userInfo = useRecoilValue(userAtom);

    /* Fetched leaderboard data from API when component mounts or access token/organization changes */
    useEffect(() => {
        const fetchData = async () => {
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
            if (response) {
                const data = await response.json();
                if (response.ok) {
                    setData(data.leaderboard);
                }
            }
        };
        fetchData();
    }, []);

    /*The leaderboard card*/
    return (
        <Card
            sx={{
                width: 300,
                height: 250,
                borderRadius: 5,
                ':hover': {boxShadow: 20}
            }}
            data-testid="savingsBox">
            <CardActionArea sx={{paddingBottom: 4}} onClick={handleCardClick}>
                <CardOverflow>
                    <CardContent>
                        <div color="text.secondary" id="numbersBoxes">
                            <BarChartIcon
                                sx={{fontSize: 100, color: '#80CC9F'}}></BarChartIcon>
                            <p
                                style={{
                                    fontSize: '25px',
                                    fontWeight: 'semi-bold',
                                    marginTop: '-10px'
                                }}>
                                Din enhet er på{' '}
                                <span style={{fontWeight: 'bold'}}>
                  {data.map((row) => {
                      if (userInfo.organization === row.organization) {
                          return row.rank.toString();
                      } else {
                          return null;
                      }
                  })}
                                    . plass
                </span>
                            </p>
                            <p style={{fontSize: '15px', fontStyle: 'italic'}}>
                                {' '}
                                Se oversikt over topplisten med andre enheter.
                            </p>
                        </div>
                    </CardContent>
                </CardOverflow>
            </CardActionArea>
        </Card>
    );
}
