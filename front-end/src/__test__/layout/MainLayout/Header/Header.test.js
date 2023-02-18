import '@testing-library/jest-dom';
import React from 'react';
import ReactDOM from 'react-dom';

import { render as rtlRender, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../store';
import Header from '../../../../layout/MainLayout/Header/';

const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

afterEach(() => {
    cleanup();
});

describe('Testing Header', () => {
    test('Render without crashing', () => {
        let div = document.createElement('div');
        render(<Header />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
    test('Check clickable buttons in header', () => {
        render(<Header />);
        let buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);
    });
});
