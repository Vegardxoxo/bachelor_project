import './SavingsBox.css';
import React, {useEffect, useState} from 'react';
import {Card, CardContent, Stack, Tooltip, Typography} from '@mui/material';
import CardOverflow from '@mui/joy/CardOverflow';
import {orgAtom} from '../../../globalVariables/variables';
import {useRecoilValue} from 'recoil';
import {fetchPotentialSavings} from '../../../api/calls';

/**
 * Returns a box displaying the potential savings for the organization.
 */
export function SavingsBox() {

    // Declare and initiate state variables
    const [potentialSavings, setpotentialSavings] = useState<number | undefined>(undefined);
    const organization = useRecoilValue(orgAtom)

    // Fetch data from API when component mounts or access token/organization changes
    useEffect(() => {
        const fetchData = async () => {
            if (organization) {
                try {
                    const data: string[] | undefined = await fetchPotentialSavings(organization);
                    if (data !== undefined) {
                        const numberData: number = +data;
                        setpotentialSavings(numberData);
                    }
                } catch (error) {
                    console.error('Error fetching potential savings:', error);
                }
            }
        };

        fetchData();
    }, [organization]);

    /* Function returns a SavingsBox card with information on potential savings fetched from the API */
    return (
        <Tooltip title={<h2 style={{fontSize: 15, fontWeight: 'lighter'}}>
            Potensiell sparing viser hvor mye enheten kan spare ved å frigi alle ledige og ubrukte lisenser.
        </h2>} followCursor arrow placement='top'>
            <Card sx={{width: 300, height: 140, borderRadius: 5, backgroundColor: '#002d53'}} data-testid='savingsBox'>
                <CardOverflow>
                    <CardContent>
                        <Stack direction={'row'}>
                            <Typography id="title">
                                Potensiell sparing
                            </Typography>
                        </Stack>
                        <Typography id="numbers">
                            {potentialSavings?.toLocaleString('nb-NO', {useGrouping: true})} kr
                        </Typography>
                    </CardContent>
                </CardOverflow>
            </Card>
        </Tooltip>
    )
}