import React, {useEffect} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

interface SoftwareSearchBarProps {
    setSelectedSoftware: (value: string) => void;
    data: string[];
    initialValue?: string;
}

const SoftwareSearchBar: React.FC<SoftwareSearchBarProps> = ({data, setSelectedSoftware, initialValue}) => {
    const [value, setValue] = React.useState<string | null>(null);
    const [inputValue, setInputValue] = React.useState<string>('');

    const handleSearch = () => {
        setSelectedSoftware(inputValue);
    };

    useEffect(() => {
        if (initialValue) {
            setValue(initialValue);
        }
    }, [initialValue]);

    return (
        <>
            {data ? (
                <Autocomplete
                    popupIcon={null}
                    clearIcon={null}
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        setSelectedSoftware(newValue || '');
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    id="controllable-states-demo"
                    options={data}
                    sx={{width: 450}}
                    renderInput={(params) => (
                        <TextField
                            data-testid="autocomplete-search"
                            {...params}
                            label="Søk"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        <IconButton
                                            edge="end"
                                            onClick={handleSearch}
                                            style={{
                                                position: 'absolute',
                                                right: 15,
                                            }}
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                                sx: {

                                    height: '50px',
                                    borderRadius: '12px',
                                    backgroundColor: 'white',
                                    '&:before': {
                                        display: 'none',
                                    },
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                                sx: {
                                    borderRadius: '12px',
                                },
                            }}
                        />
                    )}
                />
            ) : (
                <h1>Loading</h1>
            )}
        </>
    );
};
export default SoftwareSearchBar;
