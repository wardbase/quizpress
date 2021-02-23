import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test( 'renders start quiz link', () => {
	render( <App /> );
	const linkElement = screen.getByText( /Start Quiz/i );
	expect( linkElement ).toBeInTheDocument();
} );
