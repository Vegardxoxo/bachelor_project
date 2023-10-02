import {cleanup, render, screen} from '@testing-library/react';
import Navbar from './Navbar';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import renderer from "react-test-renderer";

describe('Testing render, Navbar', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Navbar/>
            </MemoryRouter>
        );
    });

    afterEach(() => {
        cleanup();
    });

    it('renders navbar without crashing', () => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <MemoryRouter>
                <Navbar/>
            </MemoryRouter>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    })

    it('renders sidebar when menu icon is clicked', () => {
        const menuIcon = screen.getByTestId('menuIcon');
        userEvent.click(menuIcon);
        const navMenu = screen.getByTestId('sidebar');
        expect(navMenu).toHaveClass('nav-menu active');
    });

    it('hides sidebar when clear icon is clicked', () => {
        const menuIcon = screen.getByTestId('menuIcon');
        userEvent.click(menuIcon);
        const clearIcon = screen.getByTestId('clearIcon');
        userEvent.click(clearIcon);
        const navMenu = screen.getByTestId('sidebar');
        expect(navMenu).toHaveClass('nav-menu');
    });

    it('renders sidebar links correctly', () => {
        const menuIcon = screen.getByTestId('menuIcon');
        userEvent.click(menuIcon);
        const sidebarLinks = screen.getAllByRole('link', {hidden: true});
        expect(sidebarLinks.length).toBeGreaterThan(0);
    });
});
