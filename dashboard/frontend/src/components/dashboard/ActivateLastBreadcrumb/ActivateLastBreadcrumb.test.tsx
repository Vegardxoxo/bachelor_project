import React from 'react';
import renderer from 'react-test-renderer';
import {MemoryRouter} from 'react-router-dom';
import ActiveLastBreadcrumb from "./ActivateLastBreadcrumb";
import {render} from '@testing-library/react';

describe('ActiveLastBreadcrumb', () => {

    it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ActiveLastBreadcrumb />
      </MemoryRouter>
    );
  });
    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <MemoryRouter initialEntries={['/']}>
                <ActiveLastBreadcrumb/>
            </MemoryRouter>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    });
});
