import React from 'react';
import HelpIcon from '@mui/icons-material/Help';
import {useNavigate} from 'react-router-dom';
import {Box, Card, Stack, Tooltip, Typography} from '@mui/material';
import {Chart, ReactGoogleChartEvent} from 'react-google-charts';


type Props = {
    total_licenses: number,
    active_licenses: number,
    never_used: number,
    unused_licenses: number,
    width?: number;
    height?: number;
    title?: string,
    showInformation?: boolean,
}

/**
 * Returns a DonutChart component displaying the number of active, unused and never used licenses.
 * @param infoBoxData - The data to display in the chart.
 */
function DonutChart(infoBoxData: Props) {

    // Get the function for navigating to different routes
    const navigate = useNavigate();

    // Set default width and height for the chart if not provided
    const {width = 670, height = 425} = infoBoxData;

    // Set default title and display information option for the chart if not provided
    const {title = 'Total oversikt', showInformation = true} = infoBoxData;

    // Define what happens when a slice of the chart is clicked
    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "select",
            callback: ({chartWrapper}) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                if (selection.length === 1) {
                    const [selectedItem] = selection;
                    const dataTable = chartWrapper.getDataTable();
                    let column = selectedItem.column;
                    if (column === null || column === undefined) {
                        column = 0;
                    }
                    const row = selectedItem.row;
                    console.log("You selected:", {
                        row,
                        column,
                        value: dataTable?.getValue(row, column),
                    });
                    // Navigate to different routes based on the selected slice
                    const value = dataTable?.getValue(row, column)
                    if (value === 'Aktiv') {
                        navigate(`/Totale Lisenser`);

                    }
                    if (value === 'Ledig') {
                        navigate(`/Ledige Lisenser`);
                    }
                    if (value === 'Ubrukt') {
                        navigate(`/Ubrukte Lisenser`);
                    }

                }
            },
        },
    ];

    // Define the data to display in the chart
    const data = [
        ['Type', 'Value'],
        ['Aktiv', infoBoxData.active_licenses ?? 1],
        ['Ledig', infoBoxData.unused_licenses ?? 1],
        ['Ubrukt', infoBoxData.never_used ?? 1],
    ];

    // Define the options for the chart
    const options = {
        pieHole: 0.4,
        legend: 'none',
        pieSliceText: 'percentage',
        colors: ['#80cc9f', '#f9c680', '#f28f8d'],
    };

    // Render the chart component with the data, options and events defined above
    return (
        <Card
            id={"donutChart"}
            data-testid='donutChart'
            sx={{
                height: height,
                width: width,
                mt: 7,
                borderRadius: 5,
            }}
        >
            <Stack direction="column" sx={{height: "100%"}}>
                <Stack direction="row" alignItems="center" sx={{justifyContent: 'space-between'}}>
                    <Typography
                        sx={{
                            textAlign: 'left',
                            fontSize: 27,
                            padding: 2,
                            color: '#002d53',
                            paddingTop: "30px",
                            paddingLeft: "25px",
                            fontFamily: 'Source Sans Pro,sans-serif',
                        }}
                    >
                        {title}
                    </Typography>
                    {/* An optional help icon displaying information about the chart */}
                    {showInformation &&
                        <Tooltip
                            title={
                                <h2 style={{fontSize: 15, fontWeight: 'lighter'}}>
                                    Diagrammet viser en oversikt over hvor mange aktive, ubrukte og ledige
                                    lisenser som eies i enheten.
                                </h2>
                            }
                            placement="top"
                            arrow
                        >
                            <HelpIcon
                                sx={{color: 'grey', fontSize: 25, marginRight: 2, marginTop: 2}}
                                data-testid="donutchartHelpIcon"
                            ></HelpIcon>
                        </Tooltip>
                    }
                </Stack>
                {/* Additional information about what the different colours mean in the donut chart */}
                <Stack direction="row" sx={{paddingLeft: 7, height: "100%", width: "100%", alignItems: 'center'}}>
                    <Stack spacing={5.2} sx={{paddingTop: 7.5, paddingLeft: 3, height: "100%"}}>
                        <Box sx={{width: 18, height: 18, backgroundColor: '#80cc9f'}}/>
                        <Box sx={{width: 18, height: 18, backgroundColor: '#f9c680'}}/>
                        <Box sx={{width: 18, height: 18, backgroundColor: '#f28f8d'}}/>
                    </Stack>
                    <Stack
                        spacing={4}
                        sx={{
                            paddingTop: 7,
                            paddingLeft: 3,
                            paddingRight: -50,
                            color: '#002d53',
                            fontStyle: 'Source Sans Pro,sans-serif',
                            height: "100%",
                            fontSize: "30pt",
                        }}
                    >
                        <Typography sx={{fontFamily: 'Source Sans Pro,sans-serif', fontSize: "14pt"}}>Aktiv</Typography>
                        <Typography sx={{fontFamily: 'Source Sans Pro,sans-serif', fontSize: "14pt"}}>Ledig</Typography>
                        <Typography sx={{fontFamily: 'Source Sans Pro,sans-serif', fontSize: "14pt"}}>Ubrukt</Typography>
                    </Stack>

                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="100%"
                        data={data}
                        options={options}
                        chartEvents={chartEvents}
                        style={{cursor: 'pointer'}}
                    />

                </Stack>
            </Stack>
        </Card>
    )


}

export default DonutChart;