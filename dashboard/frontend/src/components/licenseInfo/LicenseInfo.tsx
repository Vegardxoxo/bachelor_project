import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {fetchInfoBoxLicense, fetchSoftwareUsedInOrg} from '../../api/calls';
import SoftwareSearchBar from '../search/SoftwareSeachBar';
import {OwnOrgData} from "../../Interfaces";
import {Box, Grid, Stack} from '@mui/material';
import OwnTable from "../licensepool/ownTable/OwnTable";
import Pagination from '@mui/material/Pagination';
import ActiveLastBreadcrumb from '../dashboard/ActivateLastBreadcrumb/ActivateLastBreadcrumb';
import MuiLoadingSpinner from '../spinner/MuiLoadingSpinner';
import {useRecoilValue} from "recoil";
import {refreshTableAtom, userAtom} from "../../globalVariables/variables";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Typography} from 'antd';

/**
 * This component is responsible for rendering the license information for the unit.
 */
const LicenseInfo: React.FC = () => {
    const storedOrganization: string | null = JSON.parse(localStorage.getItem('organization') ?? 'null');
    const {title} = useParams();
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    const query = useQuery();
    const searchTermFromUrl = query.get("searchTerm");
    const [data, setData] = useState<OwnOrgData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(searchTermFromUrl || "");
    const [orgSoftware, setOrgSoftware] = useState<string[]>([]);
    const [status, setStatus] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [count, setCount] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('application_name')
    const [loaded, setLoaded] = React.useState(false);
    const refreshTable = useRecoilValue(refreshTableAtom)
    const [checked, setChecked] = useState<boolean>(false);
    const userData = useRecoilValue(userAtom)
    const email = checked ? userData.primary_user_email : ''


    useEffect(() => {
        switch (title) {
            case 'Totale Lisenser':
                setStatus('active')
                break;
            case 'Ubrukte Lisenser':
                setStatus('unused')
                break;
            case 'Ledige Lisenser':
                setStatus('available')
                break;
            default:
                setStatus(null);
                break;
        }
        // Fetches distinct software names.
        const fetchSoftwareNames = async () => {
            if (status && storedOrganization) {
                try {
                    const data: string[] | undefined = await fetchSoftwareUsedInOrg(status, 'false', storedOrganization, email);
                    if (data !== undefined) {
                        setOrgSoftware(data);
                    }
                } catch (error) {
                    console.error('Error fetching software names:', error);
                }
            }
        };


        fetchSoftwareNames();
    }, [status, refreshTable, checked]);

    useEffect(() => {
        fetchData();
    }, [searchTerm, currentPage, status, sortBy, refreshTable, checked]);

    // Fetches license information
    const fetchData = async () => {
        if (status && storedOrganization) {
            try {
                const data = await fetchInfoBoxLicense(currentPage, status as string,
                    sortBy as string, storedOrganization as string, searchTerm, email);
                data?.results && setData(data.results);
                data?.count && setCount(data.count);
                setLoaded(true);
            } catch (error) {
                console.error('Error fetching license data:', error);
            }
        }
    };

    // Function that gets input from the searchBar component.
    const handleChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    }

    // Function that gets input from the Checkbox component
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        setCurrentPage(1);
    }


    const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        setLoaded(false)
        setCurrentPage(value);
    };

    const handleSorting = async (sortBy: string) => {
        setLoaded(false)
        setSortBy(sortBy);
        fetchData()
    };


    return (
        <>
            <div>
                <Grid>
                    <ActiveLastBreadcrumb/>
                </Grid>
                {loaded ? (
                    <Box id={'licensepool_container'}
                         style={{
                             display: 'flex',
                             justifyContent: 'center',
                             alignContent: "center",
                             marginTop: "20px",
                             fontFamily: 'Source Sans Pro,sans-serif'
                         }}>
                        <Grid container className='license_pool' marginLeft={"-2%"}>
                            <Grid container justifyContent="center" alignItems="center" className={'license_table'}
                                  width={"100%"}>
                                <Stack direction={"column"} spacing={1} width={"70%"} marginBottom={"10px"}>
                                    <h2 style={{fontFamily: 'Source Sans Pro,sans-serif'}}>
                                        {title} i {storedOrganization}
                                    </h2>
                                    <Stack direction={'row'} spacing={5} width={"95%"} marginBottom={"30px"}
                                           alignItems="center"
                                           marginTop={"10px"}
                                           paddingBottom={"20px"}>
                                        <SoftwareSearchBar data={orgSoftware} setSelectedSoftware={handleChange}
                                                           initialValue={searchTerm}/>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checked}
                                                    onChange={handleCheckboxChange}
                                                    inputProps={{'aria-label': 'controlled'}}
                                                />
                                            }

                                            label={<Typography
                                                style={{fontFamily: 'Source Sans Pro,sans-serif', fontSize: '13pt'}}>Vis
                                                mine lisenser</Typography>}
                                        />
                                    </Stack>
                                    <OwnTable data={data} handleSorting={handleSorting}/>
                                    <Pagination
                                        count={Math.ceil(count / 10)}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color={"primary"}
                                        style={{marginTop: '1rem'}}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>) : (<MuiLoadingSpinner/>)}
            </div>
        </>)
};

export default LicenseInfo;