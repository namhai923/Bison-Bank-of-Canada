import React from 'react';
import { render, screen } from '@testing-library/react';
import Register from '../views/authentication/Register';
import { Provider } from 'react-redux';
import store from '../app';
import { BrowserRouter } from 'react-router-dom';
import config from '../assets/data/config';
import '@testing-library/jest-dom';
import { vSchema } from '../views/authentication/form/RegisterForm';

const customRender = (component) =>
    render(
        <BrowserRouter basename={config.basename}>
            <Provider store={store}>{component}</Provider>
        </BrowserRouter>
    );

describe('Register', () => {
    test('See if all the text is loaded', async () => {
        customRender(<Register />);
        expect(screen.getByText('Enter your credentials to continue')).toBeInTheDocument();
        expect(screen.getByText('Already have an account?')).toBeInTheDocument();
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByText('Email Address / Username')).toBeInTheDocument();
        expect(screen.getByText('Account Balance')).toBeInTheDocument();
        const signUpButton = screen.getByTestId('signUpButton');
        expect(signUpButton).toBeInTheDocument();
        expect(signUpButton).toHaveTextContent('Sign up');
    });

    test('See if the validation schema can detect that a valid account is being created', async () => {
        expect(vSchema.__isYupSchema__);
        expect(await vSchema.isValid({ email: 'a@b.c', password: 'validpassword123', fname: 'Elon', lname: 'musk', balance: 100 })).toBe(
            true
        );
        expect(
            await vSchema.isValid({
                email: 'daddybezodiz@amazon.com',
                password: 'validpassword123',

                fname: 'Daddy',
                lname: 'Bezos',
                balance: 0
            })
        ).toBe(true);
        expect(
            await vSchema.isValid({
                email: 'elonmusk@twitter.com',
                fname: 'Elon',
                lname: 'Musk',
                password: 'validpassword123',
                balance: 100
            })
        ).toBe(true);
    });

    test('See if the validation schema can detect an invalid email', async () => {
        expect(vSchema.__isYupSchema__);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter', fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.', fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@.com', fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusktwitter.com', fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk.com', fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: '@twitter', fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: '@twitter.com', fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: '@.c', fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ fname: 'Elon', lname: 'Musk', balance: 100 })).toBe(false);
        expect(
            await vSchema.isValid({
                email: 'daddydaddydaddydaddydaddydaddydaddydaddydaddydaddydaddy@daddy.com',
                fname: 'Elon',
                lname: 'Musk',
                balance: 100
            })
        ).toBe(false);
    });

    test('See if the validation schema can detect an invalid first name', async () => {
        expect(vSchema.__isYupSchema__);
        expect(
            await vSchema.isValid({
                email: 'elonmusk@twitter.com',
                fname: 'daddydaddydaddydaddydaddydaddydaddydaddydaddydaddydaddy',
                lname: 'Musk',
                balance: 100
            })
        ).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: '12314', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: '', lname: 'Musk', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 11037, lname: 'Musk', balance: 100 })).toBe(false);
    });

    test('See if the validation schema can detect an invalid last name', async () => {
        expect(vSchema.__isYupSchema__);
        expect(
            await vSchema.isValid({
                email: 'elonmusk@twitter.com',
                fname: 'Elon',
                lname: 'daddydaddydaddydaddydaddydaddydaddydaddydaddydaddydaddy',
                balance: 100
            })
        ).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', lname: '2314234324', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', lname: '', balance: 100 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', lname: 11037, balance: 100 })).toBe(false);
    });

    test('See if the validation schema can detect an invalid balance number', async () => {
        expect(vSchema.__isYupSchema__);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', lname: 'Musk', balance: -5 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', lname: 'Musk', balance: 999999999999999999 })).toBe(
            false
        );
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', lname: 'Musk', balance: 50.2 })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', lname: 'Musk', balance: 'string' })).toBe(false);
        expect(await vSchema.isValid({ email: 'elonmusk@twitter.com', fname: 'Elon', lname: 'Musk' })).toBe(false);
    });
});
