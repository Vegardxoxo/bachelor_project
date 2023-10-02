import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import Mypage from './Mypage';
import {fetchInfoBoxData} from '../../api/calls';
import {RecoilRoot} from 'recoil';
import {userAtom} from "../../globalVariables/variables";
import {BrowserRouter} from "react-router-dom";
import 'isomorphic-fetch';
import renderer, { act } from 'react-test-renderer';

const infoBoxData = {
    "total_licenses": 7,
    "active_licenses": 0,
    "never_used": 5,
    "unused_licenses": 2,
    "available_licenses": 0
}
const data = {
    "own_requests": [],
    "org_requests": [],
    "history": [
        {
            "id": 100,
            "contact_organization": "IT-tjenesten",
            "application_name": "Anaconda Python 2022",
            "family": null,
            "family_version": null,
            "family_edition": null,
            "request": "add",
            "request_date": "2023-04-26",
            "approved": true,
            "completed": true,
            "reviewed_by": "bertil.nedregard@trondheim.kommune.no",
            "reviewed_date": "2023-04-26",
            "price": null,
            "spc_id": 147830,
            "requested_by": "leendert.wienhofen@trondheim.kommune.no"
        },
        {
            "id": 101,
            "contact_organization": "IT-tjenesten",
            "application_name": "APSIS Pro [Web]",
            "family": null,
            "family_version": null,
            "family_edition": null,
            "request": "add",
            "request_date": "2023-05-01",
            "approved": true,
            "completed": true,
            "reviewed_by": "bertil.nedregard@trondheim.kommune.no",
            "reviewed_date": "2023-05-01",
            "price": null,
            "spc_id": 147822,
            "requested_by": "leendert.wienhofen@trondheim.kommune.no"
        }]
}
const own_applications = [
    {
        "application_name": "Zebra Designer 3",
        "computer_name": "TKCND140BK03",
        "status": "Active"
    },
    {
        "application_name": "Microsoft Office 2016 OneNote",
        "computer_name": "TKCND140BK03",
        "status": "Active"
    },
]
const renderWithRecoil = (
    ui: React.ReactElement,
    initialState: any
) => {
    return render(
        <RecoilRoot
            initializeState={({set}) => set(userAtom, initialState)}
        >
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </RecoilRoot>
    );
};
const renderWithRecoilSnapshot = (ui: React.ReactElement, initialState: any) => {
    return renderer.create(
        <RecoilRoot
            initializeState={({set}) => set(userAtom, initialState)}
        >
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </RecoilRoot>
    );
};


const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
};
jest.mock('../../api/calls', () => ({
    fetchInfoBoxData: jest.fn()
}));

Object.defineProperty(global, 'localStorage', {value: localStorageMock});

describe('MyPage component', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockImplementation((url) => {
            const urlString = typeof url === 'string' ? url : url.toString();

            if (urlString === 'http://127.0.0.1:8000/api/licenses/userlicenses/') {
                return Promise.resolve(
                    new Response(JSON.stringify(own_applications))
                );
            } else if (urlString === 'http://127.0.0.1:8000/api/requests/get/') {
                return Promise.resolve(
                    new Response(JSON.stringify(data))
                );

            } else if (urlString === 'http://127.0.0.1:8000/api/licenses/infobox/') {
                return Promise.resolve(
                    new Response(JSON.stringify([infoBoxData]))
                );
            } else {
                return Promise.reject(new Error("Invalid URL"));
            }
        });
    });


    afterEach(() => {
        jest.restoreAllMocks();
    });


    it('renders when data has been loaded', async () => {
        renderWithRecoil(<Mypage/>, {primary_user_full_name: 'Bertil Nedregård'});

        await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Bertil Nedregård')).toBeInTheDocument(), {timeout: 3000});
    });


    it('matches snapshot', async () => {
        (fetchInfoBoxData as jest.Mock).mockReturnValueOnce([infoBoxData]);
        (localStorage.getItem as jest.Mock).mockReturnValueOnce('fakeToken');

        const testRenderer = renderWithRecoilSnapshot(<Mypage/>, {primary_user_full_name: 'Bertil Nedregård'});
        expect(testRenderer.toJSON()).toMatchSnapshot();
    });


});
