import React from 'react';
import { QuizApp } from './components/QuizApp';
import './App.css';

function App(): JSX.Element {
	return (
		<div className="learndash-wrapper">
			<div className="wpProQuiz_content">
				<QuizApp />
			</div>
		</div>
	);
}

export default App;
