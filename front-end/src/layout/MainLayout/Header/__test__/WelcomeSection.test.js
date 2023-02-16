import React from 'react';
import ReactDOM from 'react-dom';
import { render as rtlRender, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../store/index';
import WelcomeSection from '../WelcomeSection';

const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

describe('render without crashing', () => {
    it('please dont crash', () => {
        let div = document.createElement('div');
        render(<WelcomeSection />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
    it('have welcome text', () => {
        render(<WelcomeSection />);
        expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
});
