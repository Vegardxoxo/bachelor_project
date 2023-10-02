import {render, screen, waitFor} from '@testing-library/react';
import {Leaderboard} from './Leaderboard';
import {MemoryRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import '@testing-library/jest-dom/extend-expect';
import renderer from "react-test-renderer";
import React from "react";

jest.mock('node-fetch');

describe('Leaderboard component', () => {
    beforeEach(async () => {
        const mockData = {
            leaderboard: [
                {
                    organization: 'IT-tjenester',
                    active_percentage: 50.1,
                    rank: 5
                },
                {
                    organization: 'Berg skole',
                    active_percentage: 7.6,
                    rank: 101
                }
            ]
        };
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData)
            })
        );

        render(
            <MemoryRouter>
                <RecoilRoot>
                    <Leaderboard/>
                </RecoilRoot>
            </MemoryRouter>
        );

        // Wait for the leaderboard data to be fetched and rendered
        await waitFor(() => screen.getByText('IT-tjenester'));
    });

    test('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <MemoryRouter>
                <RecoilRoot>
                    <Leaderboard/>
                </RecoilRoot>
            </MemoryRouter>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    })
    test('displays the correct organization', () => {
        const org1 = screen.getByText('IT-tjenester');
        const org2 = screen.getByText('Berg skole');
        expect(org1).toBeInTheDocument();
        expect(org2).toBeInTheDocument();
    });

    test('displays the correct percentage', () => {
        const org1Perc = screen.getByText('50.1');
        expect(org1Perc).toBeInTheDocument();
        const org2Perc = screen.getByText('7.6');
        expect(org2Perc).toBeInTheDocument();
    });

    test('displays the correct ranking', () => {
        const org1Rank = screen.getByText('5');
        expect(org1Rank).toBeInTheDocument();
        const org2Rank = screen.getByText('101');
        expect(org2Rank).toBeInTheDocument();
    });

    test('displays the correct header', () => {
        expect(screen.getByText('Topplisten')).toBeInTheDocument();
    });
});
