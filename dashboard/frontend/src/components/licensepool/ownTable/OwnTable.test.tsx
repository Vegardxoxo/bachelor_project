import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, render, screen} from "@testing-library/react";
import OwnTable from "./OwnTable";
import {OwnOrgData} from "../../../Interfaces";
import userEvent from "@testing-library/user-event";
import handleSorting from '../../licenseInfo/LicenseInfo';
import {RecoilRoot} from "recoil";
import renderer from "react-test-renderer";

const test_date = new Date('2022-12-14');
const diff = Math.floor((Date.now() - test_date.getTime()) / (1000 * 3600 * 24));
const last_opened = "12/14/2022 (" + diff + " dager siden)"

const mockData: OwnOrgData[] = [
    {
        "application_name": "APSIS Pro [Web]",
        "primary_user_full_name": "Jannik Georg Solvang",
        "primary_user_email": "kekw",
        'organization': 'Test',
        "computer_name": "TK5CG9428WVV",
        "details": [
            {
                "id": 190955,
                "last_used": "2022-12-14",
                "status": "Aktiv",
                "price": 750
            }
        ],
    }
]


describe('The own table', () => {
    beforeEach(() => {
        render(<RecoilRoot><OwnTable data={mockData} handleSorting={handleSorting}/> </RecoilRoot>);

    })
    afterEach(() => {
        cleanup()
    })

    it('renders without crashing', async () => {
        expect(await screen.findByText('Lisensnavn ▼')).toBeInTheDocument();
        expect(await screen.findByText('Bruker ▼')).toBeInTheDocument();
        expect(await screen.findByText('Løpenummer ▼')).toBeInTheDocument();
        expect(await screen.findByText('Status ▼')).toBeInTheDocument();
        expect(await screen.findByText('APSIS Pro [Web]')).toBeInTheDocument();

    })

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <RecoilRoot><OwnTable data={mockData} handleSorting={handleSorting}/> </RecoilRoot>
        ).toJSON();
        expect(testRenderer).toMatchSnapshot();

    })
    it('Can expand and display expected details', async () => {
        const input = screen.getByTestId('KeyboardArrowDownIcon');
        expect(input).toBeInTheDocument();
        userEvent.click(input);
        expect(await screen.findByText('Sist åpnet')).toBeInTheDocument();
        // expect(await screen.findByText(last_opened)).toBeInTheDocument();
        expect(await screen.findByText('Ingen tillatelse')).toBeInTheDocument();

    })
})