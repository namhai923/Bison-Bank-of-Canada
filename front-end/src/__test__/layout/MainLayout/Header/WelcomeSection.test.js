import '@testing-library/jest-dom';
import React from 'react';
import ReactDOM from 'react-dom';

import { render as rtlRender, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../store';
import WelcomeSection from '../../../../layout/MainLayout/Header/WelcomeSection';

const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

afterEach(() => {
    cleanup();
});

describe('Testing WelcomeSection', () => {
    test('Render without crashing', () => {
        let div = document.createElement('div');
        render(<WelcomeSection />);
        ReactDOM.unmountComponentAtNode(div);
    });
    test('Display welcome text', async () => {
        render(<WelcomeSection />);
        expect(screen.getByText('Welcome, Bison!')).toBeInTheDocument();
    });
});
