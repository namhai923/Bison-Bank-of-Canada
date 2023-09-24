import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../views/authentication/Login';
import { Provider } from 'react-redux';
import store from '../app';
import { BrowserRouter } from 'react-router-dom';
import config from '../assets/data/config';
import '@testing-library/jest-dom';
import { vSchema } from '../views/authentication/form/LoginForm';

const customRender = (component) =>
    render(
        <BrowserRouter basename={config.basename}>
            <Provider store={store}>{component}</Provider>
        </BrowserRouter>
    );

describe('Login', () => {
    //test to see if all components are loaded
    test('See if all the text is loaded', async () => {
        customRender(<Login />);
        const userNameInput = screen.getByTestId('UsernameInputBox');
        expect(userNameInput).toBeInTheDocument();
        expect(userNameInput).toHaveTextContent('Email Address / Username');
        expect(screen.getByText('Sign in')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByText('Hi, Welcome Back')).toBeInTheDocument();
        expect(screen.getByText('Enter your credentials to continue')).toBeInTheDocument();
    });

    test('See if validation can detect valid emails', async () => {
        expect(vSchema.__isYupSchema__);
        expect(await vSchema.isValid({ email: 'a@b.c', password: 'validpassword123' })).toBe(true);
        expect(await vSchema.isValid({ email: 'Jessewu1999@gmail.com', password: 'validpassword123' })).toBe(true);
        expect(await vSchema.isValid({ email: 'daddybezos@amazon.com', password: 'validpassword123' })).toBe(true);
    });

    test('See if validation can detect invalid emails', async () => {
        expect(vSchema.__isYupSchema__);
        expect(await vSchema.isValid({ email: '' })).toBe(false);
        expect(await vSchema.isValid({ email: 'Jessewu1999gmail.com' })).toBe(false);
        expect(await vSchema.isValid({ email: 'daddybezos@amazon' })).toBe(false);
        expect(await vSchema.isValid({ email: 'daddybezos@' })).toBe(false);
        expect(await vSchema.isValid({ email: 'daddybezos@.com' })).toBe(false);
        expect(await vSchema.isValid({ email: 'daddybezos.com' })).toBe(false);
        expect(await vSchema.isValid({ email: '@gmail.com' })).toBe(false);
        expect(await vSchema.isValid({ email: '.com' })).toBe(false);
        expect(await vSchema.isValid({ email: 'daddydaddydaddydaddydaddydaddydaddydaddydaddydaddydaddy@daddy.com' })).toBe(false);
    });
});
