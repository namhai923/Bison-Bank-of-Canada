import React from 'react';
import { render, screen } from '@testing-library/react';
import TransferHistory from '../views/dashboard/history/debt/DebtHistory';
import { Provider } from 'react-redux';
import store from '../app';
import { BrowserRouter } from 'react-router-dom';
import config from '../assets/data/config';
import '@testing-library/jest-dom';

const customRender = (component) =>
    render(
        <BrowserRouter basename={config.basename}>
            <Provider store={store}>{component}</Provider>
        </BrowserRouter>
    );

describe('Transfer History', () => {
    test('See if all the text is loaded', async () => {
        customRender(<TransferHistory />);
        expect(screen.getByText('Transfer History')).toBeInTheDocument();
        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(
            screen.getByText('You have not made or recieved any transfer so far. Send money to your friends to get started!')
        ).toBeInTheDocument();
    });
});
