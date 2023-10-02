import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import {LeaderboardBox} from "./LeaderboardBox";
import renderer from "react-test-renderer";
import {act} from 'react-dom/test-utils';
import 'isomorphic-fetch';

const mockApiResponse = {
    leaderboard: [
        {
            organization: 'ExampleOrg',
            active_percentage: 50,
            rank: 1,
        },
    ],
};

jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve(new Response(JSON.stringify(mockApiResponse), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    }))
);

const fetchMock = global.fetch as jest.MockedFunction<typeof global.fetch>;

describe('LeaderboardBox', () => {
    it('renders without crashing', async () => {
        await act(async () => {
            render(
                <RecoilRoot>
                    <MemoryRouter>
                        <LeaderboardBox/>
                    </MemoryRouter>
                </RecoilRoot>
            );
        });
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    });

    it('matches snapshot', async () => {
        let testRenderer: renderer.ReactTestRenderer | null = null;

        await act(async () => {
            testRenderer = renderer.create(
                <RecoilRoot>
                    <MemoryRouter>
                        <LeaderboardBox/>
                    </MemoryRouter>
                </RecoilRoot>
            );
        });

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
        expect(testRenderer!.toJSON()).toMatchSnapshot();
    });
});

// Clean up the mock implementation after tests
afterAll(() => {
    jest.restoreAllMocks();
});
