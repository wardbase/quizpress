<?php
/**
 * API for random quizzes
 *
 * @package ld-quiz-power-pack
 */

/**
 * Register random quiz rest apis.
 */
function wpqp_random_quiz_rest_api() {
	register_rest_route(
		'ld-quiz-power-pack/v1',
		'/random-quiz',
		array(
			'methods'             => 'GET',
			'callback'            => 'wpqp_get_random_quiz',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'ld-quiz-power-pack/v1',
		'/random-quiz/answers',
		array(
			'methods'             => 'POST',
			'callback'            => 'wpqp_check_answers',
			'permission_callback' => '__return_true',
		)
	);
}

add_action( 'rest_api_init', 'wpqp_random_quiz_rest_api' );

/**
 * Get random questions.
 */
function wpqp_get_random_quiz() {
	global $wpdb;

	$table_question = LDLMS_DB::get_table_name( 'quiz_question' );
	$ids            = $wpdb->get_results(
		// Extract published questions.
		$wpdb->prepare(
			"SELECT m.meta_value FROM $wpdb->postmeta AS m
			INNER JOIN
				(SELECT ID FROM $wpdb->posts as posts WHERE posts.post_status='publish' and posts.post_type='sfwd-question' ORDER BY rand()) AS p
				ON p.ID = m.post_id
			INNER JOIN
			(SELECT id FROM %s AS question WHERE question.answer_type IN ('single', 'multiple', 'free_answer', 'sort_answer', 'matrix_sort_answer')) AS q
				ON q.id = m.meta_value
			WHERE m.meta_key='question_pro_id'
			LIMIT 20",
			array(
				$table_question,
			) // Appended to avoid undefined offset notice.
		)
	);
	$ids = array_map(
		function( $id ) {
			return $id->meta_value;
		},
		$ids
	);

	if ( count( $ids ) > 0 ) {
		$questions = wpqp_get_questions( $ids );

		// Manipulate results for rendering in React app.
		for ( $i = 0; $i < count( $questions ); $i++ ) {
			// autop question.
			$questions[ $i ]->question = wpautop( $questions[ $i ]->question );

			// Decode answer_data.
			$answer_data       = maybe_unserialize( $questions[ $i ]->answer_data );
			$answer_data_array = array();
			$sort_string_array = array();

			foreach ( $answer_data as $answer_choice ) {
				if ( $answer_choice->isHtml() ) {
					$answer_data_array[] = array(
						'html' => $answer_choice->getAnswer(),
					);
				} else {
					$answer_data_array[] = $answer_choice->getAnswer();
				}

				if ( 'matrix_sort_answer' === $questions[ $i ]->answer_type ) {
					if ( $answer_choice->isSortStringHtml() ) {
						$sort_string_array[] = array(
							'html' => $answer_choice->getSortString(),
						);
					} else {
						$sort_string_array[] = $answer_choice->getSortString();
					}
				}
			}

			$questions[ $i ]->answer_data = $answer_data_array;

			if ( 'matrix_sort_answer' === $questions[ $i ]->answer_type ) {
				$questions[ $i ]->sort_string = $sort_string_array;
			}
		}

		return $questions;
	}

	// Send empty array when there is no published questions.
	return array();
}

/**
 * Check answers sent from user.
 *
 * @param WP_REST_Request $request user request.
 */
function wpqp_check_answers( WP_REST_Request $request ) {
	$answers = json_decode( $request->get_body(), true );
	$ids     = array_keys( $answers );

	$questions = wpqp_get_questions( $ids );

	$correct_number = 0;
	$total_point    = 0;
	$user_point     = 0;
	$result         = array();

	// Manipulate results for rendering in React app.
	foreach ( $questions as $q ) {
		// Decode answer_data.
		$answer_data  = maybe_unserialize( $q->answer_data );
		$total_point += $q->points;

		// Send answers when the question is not answered.
		if ( null === $answers[ $q->id ] ) {
			if ( 'single' === $q->answer_type ) {
				foreach ( $answer_data as $i => $a ) {
					if ( $a->isCorrect() ) {
						$result[ $q->id ] = '' . $i;
					}
				}
			} elseif ( 'multiple' === $q->answer_type ) {
				$correct_answers = array();

				foreach ( $answer_data as $i => $a ) {
					if ( $a->isCorrect() ) {
						$correct_answers[] = '' . $i;
					}
				}

				$result[ $q->id ] = $correct_answers;
			} elseif ( 'free_answer' === $q->answer_type ) {
				$result[ $q->id ] = false;
			}

			continue;
		}

		if ( 'single' === $q->answer_type ) {
			if ( $answer_data[ $answers[ $q->id ] ]->isCorrect() ) {
				$user_point += $q->points;
				$correct_number++;
				$result[ $q->id ] = $answers[ $q->id ];
			} else {
				foreach ( $answer_data as $i => $a ) {
					if ( $a->isCorrect() ) {
						$result[ $q->id ] = '' . $i;
					}
				}
			}
		} elseif ( 'multiple' === $q->answer_type ) {
			$correct_answers = array();
			$is_correct      = true;

			foreach ( $answer_data as $i => $a ) {
				if ( $a->isCorrect() ) {
					$correct_answers[] = '' . $i;

					if ( in_array( $i, $answers[ $q->id ], true ) ) {
						if ( $q->answer_points_activated ) {
							$user_point += $a->getPoints();
						}
					}
				} else {
					if ( in_array( $i, $answers[ $q->id ], true ) ) {
						$is_correct  = false;
						$user_point -= $a->getPoints();
					}
				}
			}

			$result[ $q->id ] = $correct_answers;

			if ( $is_correct ) {
				$correct_number++;
				if ( ! $q->answer_points_activated ) {
					$user_point += $q->points;
				}
			}
		} elseif ( 'free_answer' === $q->answer_type ) {
			$correct_answers = explode( "\n", strtolower( $answer_data[0]->getAnswer() ) );

			if ( in_array( strtolower( $answers[ $q->id ] ), $correct_answers, true ) ) {
				$user_point += $q->points;
				$correct_number++;
				$result[ $q->id ] = true;
			} else {
				$result[ $q->id ] = false;
			}
		} elseif ( 'sort_answer' === $q->answer_type || 'matrix_sort_answer' === $q->answer_type ) {
			$correct = true;

			// Check the length of the user answer and the indices are increasing.
			if ( count( $answers[ $q->id ] ) === count( $answer_data ) ) {
				for ( $i = 0; $i < count( $answer_data ); $i++ ) {
					if ( '' . $i !== $answers[ $q->id ][ $i ] ) {
						$correct = false;
						break;
					}
				}
			} else {
				$correct = false;
			}

			if ( $correct ) {
				$user_point += $q->points;
				$correct_number++;
			}
		}
	}

	return array(
		'correctNumber' => $correct_number,
		'totalPoint'    => $total_point,
		'userPoint'     => $user_point,
		'result'        => $result,
	);
}

/**
 * Get questions from given ids.
 *
 * @param number[] $ids array of ids.
 */
function wpqp_get_questions( array $ids ) {
	global $wpdb;

	$ids_str = '';

	// Generate array string like ('3', '4') for where ... in syntax.
	for ( $i = 0; $i < count( $ids ); $i++ ) {
		$ids_str .= "'" . $ids[ $i ] . "'";

		if ( count( $ids ) - 1 !== $i ) {
			$ids_str .= ',';
		}
	}

	// Query data.
	$table_question = LDLMS_DB::get_table_name( 'quiz_question' );
	$questions      = $wpdb->get_results(
		$wpdb->prepare(
			'SELECT * FROM %s WHERE id IN (%s) ORDER BY FIELD(id, %s)',
			array(
				$table_question,
				$ids_str,
				$ids_str,
			)
		);
	);
	$questions = maybe_unserialize( $questions );

	return $questions;
}
