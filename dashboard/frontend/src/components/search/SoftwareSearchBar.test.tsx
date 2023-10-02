import {act, cleanup, render, screen} from '@testing-library/react';
import React from 'react';
import SoftwareSearchBar from './SoftwareSeachBar';
import {RecoilRoot} from 'recoil';
import '@testing-library/jest-dom';
import renderer from "react-test-renderer";

const mockfunc = jest.fn();


describe('SoftwareSearchBar', () => {
    beforeEach(async () => {
        await act(async () => {
            render(
                <RecoilRoot>
                    <SoftwareSearchBar data={['1']} setSelectedSoftware={mockfunc}/>
                </RecoilRoot>
            );
        });
    });

    afterEach(() => {
        cleanup();
    });


    it('renders without crashing', async () => {
        expect(screen.getByLabelText('Søk')).toBeInTheDocument();
        expect(screen.getByTestId('autocomplete-search')).toBeInTheDocument();
    });

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <RecoilRoot>
                <SoftwareSearchBar data={['1']} setSelectedSoftware={mockfunc}/>
            </RecoilRoot>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();

    })


});
