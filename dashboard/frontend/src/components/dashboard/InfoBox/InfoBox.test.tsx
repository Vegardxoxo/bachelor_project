import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import InfoBox from './InfoBox';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import renderer from "react-test-renderer";

const infoBoxData = {
    title: 'Totale Lisenser',
    NumberOfLicenses: 40,
}

jest.mock('../../../api/calls', () => ({
    fetchInfoBoxData: () => Promise.resolve(infoBoxData)
}));

describe('Infoboxes', () => {

        beforeEach(async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <InfoBox title={infoBoxData.title} numberOfLicenses={infoBoxData.NumberOfLicenses}/>
                    </MemoryRouter>
                );
            });
        });

        afterEach(() => {
            localStorage.clear();
            cleanup();
        });

        it('renders without crashing', async () => {
            expect(screen.getByTestId('infoBox-test')).toBeInTheDocument();
            expect(screen.getByText(infoBoxData.title)).toBeInTheDocument();
            expect(screen.getByText('40')).toBeInTheDocument();
        });

        it('matches snapshot', async () => {
            const testRenderer = renderer.create(
                <MemoryRouter>
                    <InfoBox title={infoBoxData.title} numberOfLicenses={infoBoxData.NumberOfLicenses}/>
                </MemoryRouter>
            );
            expect(testRenderer.toJSON()).toMatchSnapshot();
        })


        it('renders tooltip when hovering over HelpIcon', async () => {
            fireEvent.mouseEnter(screen.getByTestId('helpIcon'))
            await screen.findByRole(/tooltip/);
            expect(screen.getByRole(/tooltip/)).toBeInTheDocument();
        });

    }
);