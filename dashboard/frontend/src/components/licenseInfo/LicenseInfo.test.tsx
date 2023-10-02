import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import LicenseInfo from './LicenseInfo';
import renderer from "react-test-renderer";
import React from "react";

const mockOrgs = [[
    "Adobe Acrobat DC Professional",
]];

const mockData = [{
    "application_name": "Adobe Acrobat DC Professional",
    "primary_user_full_name": "Bertil Nedregård",
    "computer_name": "TK010027481557",
    "details": [
        {
            "id": 444282,
            "last_used": "2023-01-20"
        }
    ],
    "status": "Aktiv"
}];

jest.mock('../../api/calls', () => ({
    fetchSoftwareUsedInOrg: jest.fn(() => Promise.resolve(mockOrgs)),
    fetchInfoBoxLicense: jest.fn(() => Promise.resolve(mockData)),
}));
jest.mock('@mui/material/Pagination', () => {
    const MockPagination = () => <div data-testid="mock-pagination"/>;
    MockPagination.displayName = 'Pagination';
    return MockPagination;
});

describe('LicenseInfo page', () => {

    beforeEach(() => {
        localStorage.setItem('organization', JSON.stringify('IT-tjenesten'));
    });

    afterEach(() => {
        localStorage.clear();
    });
    it('renders the total license page', async () => {
        render(
            <MemoryRouter initialEntries={['/Totale Lisenser']}>
                <RecoilRoot>
                    <Routes>
                        <Route path='/:title' element={<LicenseInfo/>}/>
                    </Routes>
                </RecoilRoot>
            </MemoryRouter>
        );
        expect(await screen.findByText('Totale Lisenser i IT-tjenesten')).toBeInTheDocument();
    });

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <MemoryRouter initialEntries={['/Ubrukte Lisenser']}>
                <RecoilRoot>
                    <Routes>
                        <Route path='/:title' element={<LicenseInfo/>}/>
                    </Routes>
                </RecoilRoot>
            </MemoryRouter>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    })
    it('renders the unused license page', async () => {
        render(
            <MemoryRouter initialEntries={['/Ubrukte Lisenser']}>
                <RecoilRoot>
                    <Routes>
                        <Route path='/:title' element={<LicenseInfo/>}/>
                    </Routes>
                </RecoilRoot>
            </MemoryRouter>
        );

        expect(await screen.findByText('Ubrukte Lisenser i IT-tjenesten')).toBeInTheDocument();
    });
    it('renders the correct license data', async () => {
        render(
            <MemoryRouter initialEntries={['/Ledige Lisenser']}>
                <RecoilRoot>
                    <Routes>
                        <Route path='/:title' element={<LicenseInfo/>}/>
                    </Routes>
                </RecoilRoot>
            </MemoryRouter>
        );
        expect(await screen.findByText('Ledige Lisenser i IT-tjenesten')).toBeInTheDocument();
    });
});
