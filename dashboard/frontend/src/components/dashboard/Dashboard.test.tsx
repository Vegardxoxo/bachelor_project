import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import Dashboard from "./Dashboard";
import renderer from "react-test-renderer";

describe('Dashboard', () => {
    it('renders without crashing', () => {
        render(
            <RecoilRoot>
                <MemoryRouter>
                    <Dashboard/>
                </MemoryRouter>
            </RecoilRoot>
        );
    });

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <RecoilRoot>
                <MemoryRouter>
                    <Dashboard/>
                </MemoryRouter>
            </RecoilRoot>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    });


})