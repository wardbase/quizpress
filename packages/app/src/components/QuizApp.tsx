/// <reference path="../../../wp-types/index.d.ts" />

import React, { useEffect, useReducer } from 'react';
import { StartPage } from './StartPage';
import { QuizData, QuizResult, UserAnswers } from './questions';
import { Quiz } from './Quiz';
import { ResultPage } from './ResultPage';
import { NoQuestionPage } from './pages/NoQuestionPage';

type AppState =
	| 'Start'
	| 'LoadingQuiz'
	| 'Quiz'
	| 'NoQuestion'
	| 'Submitting'
	| 'ShowResult'
	| 'Error';
type Action =
	| {
			type: 'QUIZ_LOAD';
	  }
	| {
			type: 'QUIZ_LOAD_DONE';
			quiz: QuizData;
	  }
	| {
			type: 'QUIZ_NO_QUESTION';
	  }
	| {
			type: 'QUIZ_ERROR';
			error: Error;
	  }
	| {
			type: 'SEND_ANSWERS';
			answers: UserAnswers;
	  }
	| {
			type: 'GOT_RESULT';
			result: QuizResult;
	  };

type State = {
	state: AppState;
	quiz: QuizData;
	answers: UserAnswers;
	result: QuizResult | null;
	error?: Error;
};

function reducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'QUIZ_LOAD':
			return {
				...state,
				state: 'LoadingQuiz',
				quiz: [],
			};
		case 'QUIZ_LOAD_DONE':
			return {
				...state,
				state: 'Quiz',
				quiz: action.quiz,
			};
		case 'QUIZ_NO_QUESTION':
			return {
				...state,
				state: 'NoQuestion',
			};
		case 'SEND_ANSWERS':
			return {
				...state,
				state: 'Submitting',
				answers: action.answers,
			};
		case 'GOT_RESULT':
			return {
				...state,
				state: 'ShowResult',
				result: action.result,
			};
		default:
			throw new Error();
	}
}

export function QuizApp(): JSX.Element {
	const [ { state, quiz, answers, result, error }, dispatch ] = useReducer(
		reducer,
		{
			state: 'Start',
			quiz: [],
			answers: {},
			result: null,
		}
	);

	useEffect( () => {
		if ( state === 'LoadingQuiz' ) {
			fetch(
				`${ window.wpApiSettings.root }ld-quiz-power-pack/v1/random-quiz`
			)
				.then( ( res ) => res.json() )
				.then(
					( res ) => {
						if ( res.length > 0 ) {
							dispatch( {
								type: 'QUIZ_LOAD_DONE',
								quiz: res,
							} );
						} else {
							dispatch( {
								type: 'QUIZ_NO_QUESTION',
							} );
						}
					},
					( err ) => {
						dispatch( {
							type: 'QUIZ_ERROR',
							error: err,
						} );
					}
				);
		} else if ( state === 'Submitting' ) {
			fetch(
				`${ window.wpApiSettings.root }ld-quiz-power-pack/v1/random-quiz/answers`,
				{
					method: 'post',
					body: JSON.stringify( answers ),
				}
			)
				.then( ( res ) => res.json() )
				.then(
					( res ) => {
						dispatch( {
							type: 'GOT_RESULT',
							result: res,
						} );
					},
					( err ) => {
						dispatch( {
							type: 'QUIZ_ERROR',
							error: err,
						} );
					}
				);
		}
	}, [ state, answers ] );

	const loadQuiz = () => {
		dispatch( { type: 'QUIZ_LOAD' } );
	};

	const sendAnswers = ( userAnswers: UserAnswers ) => {
		dispatch( { type: 'SEND_ANSWERS', answers: userAnswers } );
	};

	switch ( state ) {
		case 'Start':
			return <StartPage loadQuiz={ loadQuiz } />;
		case 'LoadingQuiz':
			return <div>Loading...</div>;
		case 'Quiz':
			return <Quiz quiz={ quiz } sendAnswers={ sendAnswers } />;
		case 'NoQuestion':
			return <NoQuestionPage />;
		case 'Submitting':
			return <div>Submitting answers...</div>;
		case 'ShowResult':
			return (
				<ResultPage
					// it is not null because the result data has been loaded from the server.
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					result={ result! }
					questionCount={ quiz.length }
					quiz={ quiz }
					answers={ answers }
					loadQuiz={ loadQuiz }
				/>
			);
		case 'Error':
			return <div>Error: { error && error.message }</div>;
	}
}
