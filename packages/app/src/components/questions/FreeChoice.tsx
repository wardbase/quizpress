import { QuestionResult, SetUserAnswer } from './common-types';

export interface FreeChoiceQuestion {
	answer_type: 'free_answer';
	id: number;
	title: string;
	question: string;
}

interface FreeChoiceProps {
	question: FreeChoiceQuestion;
	setUserAnswer: SetUserAnswer | null;
	result: QuestionResult | null;
}

export const FreeChoice = ( {
	question: { id, question },
	setUserAnswer,
	result,
}: FreeChoiceProps ): JSX.Element => {
	let className = 'wpProQuiz_questionListItem';

	if ( result ) {
		if ( result.correct ) {
			className += ' wpProQuiz_answerCorrect';
		} else {
			className += ' wpProQuiz_answerIncorrect';
		}
	}

	return (
		<div className="wpProQuiz_question">
			<div
				className="wpProQuiz_question_text"
				dangerouslySetInnerHTML={ { __html: question } }
			/>
			<p className="wpProQuiz_clear" style={ { clear: 'both' } }></p>
			<ul className="wpProQuiz_questionList">
				<li className={ className }>
					<div>
						{ setUserAnswer ? (
							<input
								className="wpProQuiz_questionInput"
								type="text"
								onChange={ ( e ) => {
									setUserAnswer( `${ id }`, e.target.value );
								} }
							/>
						) : (
							<input
								className="wpProQuiz_questionInput"
								type="text"
								// result isn't null when setUserAnswer is null.
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								value={ result!.userChoice ?? '' }
								disabled={ true }
							/>
						) }
					</div>
				</li>
			</ul>
		</div>
	);
};
