import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <React.StrictMode>
            <RecoilRoot>
                <App/>
            </RecoilRoot>
        </React.StrictMode>
    </BrowserRouter>
);

