import React from 'react';
import * as recoil from 'recoil';
import {RecoilRoot} from 'recoil';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BuyButton from './BuyButton';
import 'isomorphic-fetch';
import renderer from 'react-test-renderer';

describe('BuyButton component user-based', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve(new Response(JSON.stringify({})))
        );
        jest.spyOn(recoil, 'useRecoilValue').mockReturnValue({is_unit_head: false});
        render(<RecoilRoot><BuyButton spc_id={1} application_name="test app"/></RecoilRoot>);
    })

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    })

    it('renders without crashing', () => {
        const buyButton = screen.getByLabelText('add to shopping cart');
        expect(buyButton).toBeInTheDocument();
    });

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <RecoilRoot>
                <BuyButton spc_id={1} application_name="TestApp"/>
            </RecoilRoot>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    })

    it('opens dialog when buy button is clicked', async () => {
        const buyButton = screen.getByLabelText('add to shopping cart');
        fireEvent.click(buyButton);

        await waitFor(() => {
            const dialogTitle = screen.getByText('Du har ingen uåpnede lisens(er) av test app.');
            expect(dialogTitle).toBeInTheDocument();
        });
    });

    it('Kjøp lisens button is visible in the dialog', async () => {
        const buyButton = screen.getByLabelText('add to shopping cart');
        fireEvent.click(buyButton);

        await waitFor(() => {
            const kjopLisensButton = screen.getByText(/Kjøp lisens/i);
            expect(kjopLisensButton).toBeInTheDocument();
        });
    });

    it('closes the dialog when the close button is clicked', async () => {
        const buyButton = screen.getByLabelText('add to shopping cart');
        fireEvent.click(buyButton);

        await waitFor(() => {
            const dialogTitle = screen.getByText('Du har ingen uåpnede lisens(er) av test app.');
            expect(dialogTitle).toBeInTheDocument();
        });

        const closeButton = screen.getByLabelText('close');
        fireEvent.click(closeButton);

        await waitFor(() => {
            const dialogTitle = screen.queryByText('Du har ingen uåpnede lisens(er) av test app.');
            expect(dialogTitle).not.toBeInTheDocument();
        });
    });

    it('Shows an error message if the user allready has requred the license', async () => {
        const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url) => {
            if (url.toString().includes('check')) {
                return Promise.resolve(new Response(JSON.stringify({error: 'Du har allerede en aktiv forespørsel for denne lisensen.'}), {status: 400}));
            } else {
                return Promise.resolve(new Response(JSON.stringify({})));
            }
        });

        const buyButton = screen.getByLabelText('add to shopping cart');


        fireEvent.click(buyButton);
        await waitFor(() => {
            const errorMessage = screen.getByText(/Du har allerede en aktiv forespørsel for denne lisensen./i);
            expect(errorMessage).toBeInTheDocument();
        });

        fetchMock.mockRestore();
    });


    it('requests a license as a user', async () => {


        const buyButton = screen.getByLabelText('add to shopping cart');
        fireEvent.click(buyButton);

        await waitFor(() => {
            const kjopLisensButton = screen.getByText(/Kjøp lisens/i);
            expect(kjopLisensButton).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Kjøp lisens/i));

        await waitFor(() => {
            const successMessage = screen.getByText(/Forespørsel sendt til lisens ansvarlig!/i);
            expect(successMessage).toBeInTheDocument();
        });
    });

});

describe('BuyButton component unit-head-based', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve(new Response(JSON.stringify({})))
        );
        jest.spyOn(recoil, 'useRecoilValue').mockReturnValue({is_unit_head: true});
        render(<RecoilRoot><BuyButton spc_id={1} application_name="test app"/></RecoilRoot>);
    })

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    })

    it('buys a license as a unit head', async () => {
        jest.spyOn(recoil, 'useRecoilValue').mockReturnValue({is_unit_head: true});

        const buyButton = screen.getByLabelText('add to shopping cart');
        fireEvent.click(buyButton);

        await waitFor(() => {
            const kjopLisensButton = screen.getByText(/Kjøp lisens/i);
            expect(kjopLisensButton).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Kjøp lisens/i));

        await waitFor(() => {
            const successMessage = screen.getByText(/Lisens kjøpt!/i);
            expect(successMessage).toBeInTheDocument();
        });
    });


})

