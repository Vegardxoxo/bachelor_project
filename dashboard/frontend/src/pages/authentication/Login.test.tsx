import React from 'react';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import 'isomorphic-fetch';
import {RecoilRoot} from 'recoil';
import {MemoryRouter} from 'react-router-dom';
import userEvent from "@testing-library/user-event";
import {act} from "react-dom/test-utils";
import renderer from "react-test-renderer";

describe('Login component', () => {
    beforeEach(async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve(
                new Response(JSON.stringify({access: 'fakeAccessToken', refresh: 'fakeRefreshToken'}))
            )
        );

        jest.spyOn(global.localStorage, 'setItem');
        await act(async () => {
            render(
                <RecoilRoot>
                    <MemoryRouter>
                        <Login/>
                    </MemoryRouter>
                </RecoilRoot>
            );
        });
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders login form', () => {
        expect(screen.getByTestId('emaill')).toBeInTheDocument();
    });

    it('submits login form successfully', async () => {
        const emailInput = screen.getByTestId('emaill');
        const passwordInput = screen.getByTestId('passwordd');
        const submitButton = screen.getByTestId('buttonn');
        await act(async () => {
            userEvent.type(emailInput, 'test@example.com');
            userEvent.type(passwordInput, 'password');
            userEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });

    it('matches snapshot', async () => {
        await act(async () => {
            const testRenderer = renderer.create(
                <RecoilRoot>
                    <MemoryRouter>
                        <Login/>
                    </MemoryRouter>
                </RecoilRoot>
            );
            expect(testRenderer.toJSON()).toMatchSnapshot();
        });
    });
});
