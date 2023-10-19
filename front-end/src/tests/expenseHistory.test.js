import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpenseHistory from '../views/dashboard/history/favor/FavorHistory';
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

describe('Expense History', () => {
    test('See if all the text is loaded', async () => {
        customRender(<ExpenseHistory />);
        expect(screen.getByText('Expense History')).toBeInTheDocument();
        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(
            screen.getByText('Your Expenses Will Appear Here! Make Your First Transaction In Order To Show Display It Here')
        ).toBeInTheDocument();
    });
});
