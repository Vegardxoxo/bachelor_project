import React from 'react';
import '@testing-library/jest-dom'
import {cleanup, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import FAQ from './FAQ';
import userEvent from '@testing-library/user-event';
import renderer from "react-test-renderer";

describe('Testing FAQ page', () => {

    beforeEach(() => {
        render(
            <MemoryRouter>
                <FAQ/>
            </MemoryRouter>
        )
    })

    afterEach(() => {
        cleanup()
    })

    it('renders without crashing', async () => {
        expect(await screen.findByText('Ofte stilte spørsmål')).toBeInTheDocument();
        expect(await screen.getByTestId('Dashboard')).toBeInTheDocument();
        expect(await screen.findByText('Lisensportalen')).toBeInTheDocument();
        expect(await screen.findByText('Ledertavlen')).toBeInTheDocument();
    })

    it('can expand and display answers', async () => {
        const input = screen.getByTestId('expandIcon');
        expect(input).toBeInTheDocument();
        userEvent.click(input);
        expect(await screen.findByText('Hva er ledertavlen?')).toBeInTheDocument();
        expect(await screen.findByText('Ledertavlen sammenligner alle enheter i Trondheim Kommune basert på hvor stor andel av alle lisensene eid i enheten er aktive.')).toBeInTheDocument();
    })

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <MemoryRouter>
                <FAQ/>
            </MemoryRouter>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    })

});