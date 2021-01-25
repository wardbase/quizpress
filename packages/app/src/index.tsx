import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

declare global {
	interface Window {
		wpReactPlugin:
			| {
					appId: string;
			  }
			| undefined;
	}
}

const rootId = window.wpReactPlugin ? window.wpReactPlugin.appId : 'root';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById( rootId )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
