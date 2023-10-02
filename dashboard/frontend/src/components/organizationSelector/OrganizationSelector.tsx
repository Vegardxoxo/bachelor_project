import React, {SyntheticEvent, useEffect, useState} from 'react';
import {fetchOrganizations} from '../../api/calls';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {useSetRecoilState} from 'recoil';
import {orgAtom} from '../../globalVariables/variables';


/**
 * Component for fetching organizations from the backend and displaying them in a dropdown with search.
 * @constructor
 */
const OrganizationSelector: React.FC = () => {
    const storedOrganizationString: string | null = localStorage.getItem('organization');
    const [organizations, setOrganizations] = useState<string[]>([]);
    const [value, setValue] = React.useState<string | null>(
        storedOrganizationString ? JSON.parse(storedOrganizationString) : null
    );
    const [inputValue, setInputValue] = React.useState<string>('');
    const setOrg = useSetRecoilState(orgAtom);

    useEffect(() => {
        const fetchData = async () => {
            const data: string[] | undefined = await fetchOrganizations();
            if (data !== undefined) {
                setOrganizations(data);
            }
        };


        setOrg(value as string);
        fetchData();
    }, []);


    return (
        <>
            {organizations ? (
                <div data-testid="autocomplete-search">
                    <Autocomplete
                        value={value}
                        onChange={(event: SyntheticEvent, newValue: string | null) => {
                            setValue(newValue);
                            localStorage.setItem('organization', JSON.stringify(newValue));
                            setOrg(newValue as string);
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        id='controllable-states-demo'
                        options={organizations}
                        sx={{width: 350}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                style={{background: "white"}}
                                label='Velg organisasjon'
                                data-testid='search-box'
                            />
                        )}
                    />
                </div>
            ) : (
                <div>Loading organizations...</div>
            )}
        </>
    );

};


export default OrganizationSelector;