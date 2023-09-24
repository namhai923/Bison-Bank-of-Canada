import React from 'react';
import { render, screen } from '@testing-library/react';
import Transfer from '../views/banking/spend-money/Transfer';
import { Provider } from 'react-redux';
import store from '../app';
import { BrowserRouter } from 'react-router-dom';
import config from '../assets/data/config';
import '@testing-library/jest-dom';
import { vSchema } from '../views/banking/spend-money/Transfer';

const customRender = (component) =>
    render(
        <BrowserRouter basename={config.basename}>
            <Provider store={store}>{component}</Provider>
        </BrowserRouter>
    );

describe('Transfer Money', () => {
    test('See if all the text is loaded', async () => {
        customRender(<Transfer />);
        // expect(screen.getByText('Transfer')).toBeInTheDocument();
        //expect(screen.getByText('Receiver')).toBeInTheDocument();
        //expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('Send')).toBeInTheDocument();
    });

    test('See if validation can detect valid emails and amounts', async () => {
        expect(vSchema.__isYupSchema__);
        expect(await vSchema.isValid({ receiver: 'a@b.c', amount: 1 })).toBe(true);
        expect(await vSchema.isValid({ receiver: 'Jessewu1999@gmail.com', amount: 10 })).toBe(true);
        expect(await vSchema.isValid({ receiver: 'daddybezos@amazon.com', amount: 100.1 })).toBe(true);
    });
    test('See if validation can detect invalid emails', async () => {
        expect(vSchema.__isYupSchema__);
        expect(await vSchema.isValid({ receiver: '', amount: 1 })).toBe(false);
        expect(await vSchema.isValid({ receiver: 'Jessewu1999gmail.com', amount: 1 })).toBe(false);
        expect(await vSchema.isValid({ receiver: 'daddybezos@amazon', amount: 1 })).toBe(false);
        expect(await vSchema.isValid({ receiver: 'daddybezos@', amount: 1 })).toBe(false);
        expect(await vSchema.isValid({ receiver: 'daddybezos@.com', amount: 1 })).toBe(false);
        expect(await vSchema.isValid({ receiver: 'daddybezos.com', amount: 1 })).toBe(false);
        expect(await vSchema.isValid({ receiver: '@gmail.com', amount: 1 })).toBe(false);
        expect(await vSchema.isValid({ receiver: '.com', amount: 1 })).toBe(false);
        expect(await vSchema.isValid({ receiver: 'daddydaddydaddydaddydaddydaddydaddydaddydaddydaddydaddy@daddy.com', amount: 1 })).toBe(
            false
        );
    });
    test('See if validation can detect invalid amounts', async () => {
        expect(vSchema.__isYupSchema__);
        expect(await vSchema.isValid({ receiver: 'a@b.c', amount: 0 })).toBe(false);
        expect(await vSchema.isValid({ receiver: 'Jessewu1999@gmail.com', amount: -10 })).toBe(false);
        expect(await vSchema.isValid({ receiver: 'daddybezos@amazon.com', amount: -100.1 })).toBe(false);
    });
});
