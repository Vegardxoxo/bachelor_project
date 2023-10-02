import {Box, Grid, Stack, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import SoftwareSearchBar from '../search/SoftwareSeachBar';
import PoolTable from "./PoolTable/PoolTable";
import {LicensePoolData} from "../../Interfaces";
import {fetchPoolData, fetchSoftwareUsedInOrg} from "../../api/calls";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from "@mui/material/Pagination";
import ActiveLastBreadcrumb from "../dashboard/ActivateLastBreadcrumb/ActivateLastBreadcrumb";
import {useRecoilValue} from "recoil";
import {refreshTableAtom} from "../../globalVariables/variables";

function LicensePool() {
    const org = JSON.parse(localStorage.getItem('organization') ?? 'null');
    const [searchTerm, setSearchTerm] = useState<string>();
    const [orgSoftware, setOrgSoftware] = useState<string[]>([]);
    const [data, setData] = useState<LicensePoolData[]>([]);
    const [checked, setChecked] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 10;
    const [count, setCount] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('application_name')
    const refreshTable = useRecoilValue(refreshTableAtom)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        setCurrentPage(1);
    };

    const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const handleSorting = async (sortBy: string) => {
        setSortBy(sortBy);
        await fetchData()
    };

    // Function that gets input from the searchBar component.
    const updateSearchTerm = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    }

    useEffect(() => {
        setErrorMessage('')
        // Fetches distinct software names.
        const fetchSoftwareNames = async () => {
            try {
                const data: string[] | undefined = await fetchSoftwareUsedInOrg('available', 'true', checked ? org as string : '');
                if (data !== undefined) {
                    setOrgSoftware(data);
                }
            } catch (error) {
                console.error('Error fetching software names:', error);
            }
        };
        fetchSoftwareNames();
    }, [checked, refreshTable]);

    const fetchData = async () => {
        try {
            const {
                results,
                count,
                error,
                message
            } = await fetchPoolData(currentPage, sortBy as string,
                searchTerm, checked ? org as string : undefined);
            if (error) {
                setErrorMessage(message);
                setData([]);
            } else {
                setData(results);
                setCount(count);
            }
        } catch (error) {
            console.error('Error fetching license data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, sortBy, checked, searchTerm, refreshTable]);


    return (
        <div>
            <Grid>
                <ActiveLastBreadcrumb/>
            </Grid>
            <Box id={'licensepool_container'}
                 style={{display: 'flex', justifyContent: 'center', alignContent: "center", marginTop: "20px"}}>
                <Grid container className='license_pool' justifyContent={"center"}>
                    <Grid container justifyContent="center" alignItems="center" className={'license_table'}
                          width={"75%"}>
                        <Stack direction={"column"} width={"95%"} marginBottom={"10px"} marginLeft={'-1%'}>
                            <h2 style={{
                                fontFamily: 'Source Sans Pro, sans-serif',
                                fontSize: '30pt',
                                marginTop: -0.6,
                                fontWeight: 400
                            }}>
                                Lisensportalen
                            </h2>
                            <h4 style={{
                                fontFamily: 'Source Sans Pro, sans-serif',
                                fontStyle: "italic",
                                fontWeight: 200,
                                marginTop: "-2%"
                            }}>
                                -Velg gjenbruk!
                            </h4>
                        </Stack>
                        <Stack direction={'row'} spacing={5} width={"95%"} marginBottom={"30px"} alignItems="center"
                               marginTop={"10px"}>
                            <SoftwareSearchBar
                                data-testid={'software_search_bar'}
                                setSelectedSoftware={updateSearchTerm}
                                data={orgSoftware}/>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={handleChange}
                                        inputProps={{'aria-label': 'controlled'}}
                                    />
                                }
                                label={<Typography style={{fontFamily: 'Source Sans Pro,sans-serif', fontSize: '13pt'}}>Vis
                                    bare lisenser fra min enhet</Typography>}
                            />
                            {errorMessage && <h3 style={{color: 'red'}}>{errorMessage}</h3>}

                        </Stack>
                        <Stack direction={'column'} width={"100%"} marginLeft={3}>
                            <PoolTable data={data} handleSorting={handleSorting}/>
                            <Pagination
                                count={Math.ceil(count / ITEMS_PER_PAGE)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color={"primary"}
                                style={{marginTop: '1rem'}}
                            />

                        </Stack>

                    </Grid>
                </Grid>
            </Box>
        </div>
    );


}

export default LicensePool;