import '@testing-library/jest-dom';
import React from 'react';
import ReactDOM from 'react-dom';

import { render as rtlRender, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../store';
import ProfileSection from '../../../../layout/MainLayout/Header/ProfileSection';

const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

afterEach(() => {
    cleanup();
});

describe('Testing ProfileSection', () => {
    test('Render without crashing', () => {
        let div = document.createElement('div');
        render(<ProfileSection />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
    test('ProfileSection is clickable', async () => {
        render(<ProfileSection />);
        let button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });
});
