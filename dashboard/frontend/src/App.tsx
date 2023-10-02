import React, {useEffect, useState} from 'react';
import './App.css';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {Navigate, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/authentication/Login';
import MyPage from './pages/Mypage/Mypage';
import LicenseInfo from './components/licenseInfo/LicenseInfo';
import Licenses from './pages/Licenses';
import FAQ from './pages/FAQ/FAQ';
import {Leaderboard} from './components/leaderboard/Leaderboard';
import {isAuthAtom, orgAtom, userAtom} from "./globalVariables/variables";
import Navbar from './components/navbar/Navbar';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthAtom);
    const token = localStorage.getItem('access');
    const [isLoading, setIsLoading] = useState(true);
    const setUserData = useSetRecoilState(userAtom);
    const setOrg = useSetRecoilState(orgAtom);

    /* Fetches login-data from API*/
    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const verifyLoginResponse = await fetch('http://127.0.0.1:8000/api/login/verify/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: token,
                        }),
                    });
                    if (verifyLoginResponse.ok) {
                        setIsAuthenticated(true);

                        const userDataResponse = await fetch('http://127.0.0.1:8000/api/licenses/user/', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        const userData = await userDataResponse.json();
                        if (userDataResponse.ok) {
                            setUserData(userData);
                            localStorage.setItem('organization', JSON.stringify(userData.organization));
                            setOrg(userData.organization);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [token]);

    return (
        <>
            <Navbar/>
            {isLoading ? (
                /* While loading the application, this message is shown */
                <div>Loading...</div>
            ) : (
                /* The different pages that can be routed to if the user is logged in. */
                <Routes>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/" element={isAuthenticated ? <Home/> : <Navigate to="/Login"/>}/>
                    <Route path="/minside" element={isAuthenticated ? <MyPage/> : <Navigate to="/Login"/>}/>
                    <Route path="/lisensportal" element={isAuthenticated ? <Licenses/> : <Navigate to="/Login"/>}/>
                    <Route path="/:title" element={isAuthenticated ? <LicenseInfo/> : <Navigate to="/Login"/>}/>
                    <Route path="/FAQ" element={isAuthenticated ? <FAQ/> : <Navigate to="/Login"/>}/>
                    <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard/> : <Navigate to="/Login"/>}/>
                </Routes>
            )}
        </>
    );
}

export default App;
