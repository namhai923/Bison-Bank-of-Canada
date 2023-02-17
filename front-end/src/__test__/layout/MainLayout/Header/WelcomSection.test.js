import React from 'react';
import ReactDOM from 'react-dom';
import { render as rtlRender, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../store/index';
import WelcomeSection from '../../../../Layout/MainLayout/Header/WelcomeSection/index';

const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

describe('render without crashing', () => {
    it('it should not crash', () => {
        let div = document.createElement('div');
        render(<WelcomeSection />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('WelcomSection exists', () => {
      render(<div data-testid="component"><WelcomeSection data-testid="component"/></div>);
      expect(screen.getByTestId('component')).toBeDefined();
    });
});