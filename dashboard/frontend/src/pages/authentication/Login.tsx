import {useEffect, useState} from 'react';
import {Box, Button, Container, TextField} from '@mui/material';
import Typography from '@mui/joy/Typography';
import './Login.css'
import {useSetRecoilState} from "recoil";
import {isAuthAtom} from "../../globalVariables/variables";
import {useNavigate} from "react-router-dom";

/**
 * The login page.
 */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const setIsAuthenticated = useSetRecoilState(isAuthAtom);
    const navigate = useNavigate();

    async function onSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    primary_user_email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                handleAuth(data);
                setIsAuthenticated(true);
                navigate('/');
            } else {
                setErrorMessage(data.detail);
            }
        } catch (error) {
            console.error(error);
        }
    }


    //Stores the access and refresh token in local storage.
    const handleAuth = (data: { access: string, refresh: string }) => {
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)

    }

    useEffect(() => {
        const token = localStorage.getItem('access')
        const isLoggedIn = async () => {
            if (token) {
                const response = await fetch('http://127.0.0.1:8000/api/login/verify/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: token,
                    }),

                })
                if (response.ok) {
                    navigate('/');
                    setIsAuthenticated(true)
                }

            }
        }
        isLoggedIn()

    }, [])


    return (
        <>
            <Container component='main' maxWidth='sm'>
                <Box id="LogIn">
                    <Typography id="Headline">
                        Logg inn
                    </Typography>
                    {errorMessage && <Typography sx={{color: "red"}}>{errorMessage}</Typography>}
                    <Box component='form'
                         onSubmit={onSubmit}
                         sx={{mt: 1}}
                    >
                        <TextField onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorMessage('');
                        }} margin='normal' required fullWidth
                                   id='loginID' label='E-post' data-testid='emaill' name='LoginID' autoFocus
                                   type={"email"}/>
                        <TextField onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage('')
                        }} margin='normal'
                                   required
                                   fullWidth
                                   id='password'
                                   data-testid='passwordd'
                                   label='Passord'
                                   name='password'
                                   type='password'/>
                        <Button type='submit' fullWidth variant='contained' data-testid='buttonn'
                                sx={{mt: 3, mb: 2, backgroundColor: '#005aa7'}}>Logg inn</Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
