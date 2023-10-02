import React from 'react';
import '@testing-library/jest-dom';
import {cleanup, render, screen} from "@testing-library/react";
import PoolTable from "./PoolTable";
import {LicensePoolData} from "../../../Interfaces";
import userEvent from "@testing-library/user-event";
import handleSorting from '../LicensePool';
import {RecoilRoot} from "recoil";
import renderer from "react-test-renderer";

const mockData: LicensePoolData[] = [
    {
        application_name: "Blackfish IE Tab 15",
        freed_by_organization: "IT-tjenesten",
        details: [
            {
                id: 1,
                freed_by_organization: "IT-tjenesten",
                application_name: "Blackfish IE Tab 15",
                date_added: "2023-04-08",
                family: "Blackfish IE Tab",
                family_version: "101500",
                family_edition: "100",
                price: 750,
                spc_id: 520185
            }
        ]
    }
];

describe('The pool table', () => {
    const handleSortingMock = jest.fn();

    beforeEach(() => {
        render(<RecoilRoot><PoolTable data={mockData} handleSorting={handleSortingMock}/></RecoilRoot>);
    })
    afterEach(() => {
        cleanup()
    })

    // Test if the component renders without crashing
    it('renders without crashing', async () => {
        expect(await screen.findByText('Lisensnavn ▼')).toBeInTheDocument();
        expect(await screen.findByText('IT-tjenesten')).toBeInTheDocument();
    })

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <RecoilRoot><PoolTable data={mockData} handleSorting={handleSortingMock}/></RecoilRoot>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    })

    it('can expand and display expected details', async () => {
        const input = screen.getByTestId('KeyboardArrowDownIcon');
        expect(input).toBeInTheDocument();
        userEvent.click(input);
        expect(await screen.findByText('Dato lagt til')).toBeInTheDocument();
        expect(await screen.findByText('Pris')).toBeInTheDocument();
        expect(await screen.findByText('Kjøp')).toBeInTheDocument();
    })

    it('calls handleSorting when column header is clicked', async () => {
        const columnHeaders = await screen.findAllByText('Lisensnavn ▼');
        const columnHeader = columnHeaders[0]
        userEvent.click(columnHeader);
        expect(handleSortingMock).toHaveBeenCalledTimes(1);
        expect(handleSortingMock).toHaveBeenCalledWith('application_name');
    })

    // Test if the table renders correctly when data is empty
    it('renders empty message when data is empty', () => {
        render(<RecoilRoot><PoolTable data={[]} handleSorting={handleSorting}/></RecoilRoot>);
        expect(screen.getByText('Velg programvare')).toBeInTheDocument();
    })
})
