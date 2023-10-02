import React, {useState} from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import {NavLink} from 'react-router-dom';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {refreshTableAtom, userAtom} from '../../../globalVariables/variables';
import {checkIfOrgHasSoftware} from '../../../api/calls';

// Define the type for the ReserveButtonProps
type ReserveButtonProps = {
    spc_id: number;
    application_name: string;
};

/**
 * A button that allows the user to reserve or buy a license for a software application.
 * @param spc_id The id of the software application
 * @param application_name The name of the software application
 */
const BuyButton: React.FC<ReserveButtonProps> = ({spc_id, application_name}) => {
    // Set up necessary state variables and Recoil hooks
    const accessToken = localStorage.getItem('access');
    const userInfo = useRecoilValue(userAtom);
    const isUnitHead = userInfo.is_unit_head;
    const setRefresh = useSetRecoilState(refreshTableAtom);
    const [open, setOpen] = useState(false);
    const [bought, setBought] = useState(false);
    const [visible] = useState(true);
    const [unusedLicenses, setUnusedLicenses] = useState(0);
    const [error, setError] = useState('');

    // Fetch data about the software application's licenses
    const fetchData = async () => {
        try {
            if (application_name) {
                const result = await checkIfOrgHasSoftware(
                    application_name,
                    userInfo.organization
                );
                if (result && !result.error) {
                    setUnusedLicenses(result.count);
                }
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request.');
        }
    };


    // Check if the user has requested a license for the software
    const checkIfUserHasRequested = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/requests/check?spc_id=${spc_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };


    // Open the dialog when the BuyButton is clicked
    const handleClickOpen = async () => {
        await fetchData();
        await checkIfUserHasRequested();
        setOpen(true);
    };

    // Close the dialog when the Close button is clicked
    const handleClose = () => {
        setRefresh((old) => !old);
        setOpen(false);
    };

    // Handle the actual buying process
    const handleClick = async () => {
        const action = isUnitHead ? releaseLicense : requestReleaseLicense;
        const data = await action();
        if (data) {
            setBought(true);
        }
    };

    // Request to release a license
    const requestReleaseLicense = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/requests/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    contact_organization: userInfo.organization,
                    application_name: application_name,
                    request: 'remove',
                    requested_by: userInfo.primary_user_email,
                    spc_id: spc_id
                })
            });
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                alert(data.non_field_errors[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };


    // Release a license
    const releaseLicense = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/pool/buy/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    spc_id: spc_id
                })
            });
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };


// Render the BuyButton component and the dialog
    return (
        <>
            <IconButton
                onClick={handleClickOpen}
                color="primary"
                aria-label="add to shopping cart">
                <AddShoppingCartIcon/>
            </IconButton>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                padding: '10px',
                                width: 'auto'
                            }}>
                            <CloseIcon/>
                        </IconButton>
                    </div>
                    {error ? (
                        <DialogContent>
                            <DialogContentText
                                id="alert-dialog-description"
                                style={{textAlign: 'center', padding: '5px'}}>
                                <DialogTitle
                                    variant="h6"
                                    component="span"
                                    sx={{textAlign: 'center'}}>
                                    {error}
                                </DialogTitle>
                            </DialogContentText>
                        </DialogContent>
                    ) : (
                        <>
                            <DialogTitle
                                id="alert-dialog-title"
                                sx={{textAlign: 'center', padding: '25px'}}>
                                {unusedLicenses > 0
                                    ? `Du har ${unusedLicenses} uåpnede/ledige lisens(er) av ${application_name} fra før.`
                                    : `Du har ingen uåpnede lisens(er) av ${application_name}.`}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText
                                    id="alert-dialog-description"
                                    style={{textAlign: 'center', padding: '5px'}}>
                                    {unusedLicenses > 0 ? (
                                        <>
                                            Du kan finne de{' '}
                                            <NavLink
                                                to={`/Totale Lisenser?searchTerm=${application_name}`}>
                                                her
                                            </NavLink>
                                            <br/>
                                            Benytt deg av de før du du går til innkjøp fra andre
                                            enheter. Å hindre unødvendig innkjøp av lisenser sparer
                                            miljøet!
                                        </>
                                    ) : (
                                        <>
                                            Vurder nøye om du trenger en ny lisens før du kjøper.
                                            <br/>Å unngå unødvendige innkjøp av lisenser bidrar til å
                                            spare miljøet og redusere kostnader.
                                        </>
                                    )}
                                </DialogContentText>
                            </DialogContent>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <DialogActions sx={{paddingBottom: '20px'}}>
                                    {visible && (
                                        <Button
                                            variant="contained"
                                            onClick={handleClick}
                                            disabled={bought}
                                            sx={{
                                                padding: '10px',
                                                backgroundColor: bought ? '#ccc' : '#80ADD3',
                                                fontFamily: 'Source Sans 3, sans-serif',
                                                '&:hover': {
                                                    backgroundColor: bought ? '#ccc' : '#709CC2'
                                                }
                                            }}>
                                            Kjøp lisens
                                        </Button>
                                    )}
                                </DialogActions>
                            </div>
                            {bought &&
                                (isUnitHead ? (
                                    <h2
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            color: '#3A5E7A'
                                        }}>
                                        Lisens kjøpt!
                                    </h2>
                                ) : (
                                    <h2
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            color: '#3A5E7A'
                                        }}>
                                        Forespørsel sendt til lisens ansvarlig!
                                    </h2>
                                ))}
                        </>
                    )}
                </Dialog>
            </div>
        </>
    );
};

export default BuyButton;
