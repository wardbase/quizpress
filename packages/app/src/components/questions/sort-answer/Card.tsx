import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { AnswerChoice } from '../common-types';

export const ItemTypes = {
	CARD: 'card',
};

export interface CardProps {
	id: any;
	text: AnswerChoice;
	index: number;
	moveCard: ( dragIndex: number, hoverIndex: number ) => void;
	result: null | boolean;
}

interface DragItem {
	index: number;
	id: string;
	type: string;
}
export const Card: React.FC< CardProps > = ( {
	id,
	text,
	index,
	moveCard,
	result,
} ) => {
	const ref = useRef< HTMLLIElement >( null );
	const [ , drop ] = useDrop( {
		accept: ItemTypes.CARD,
		hover( item: DragItem, monitor: DropTargetMonitor ) {
			if ( ! ref.current ) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;

			// Don't replace items with themselves
			if ( dragIndex === hoverIndex ) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY =
				( hoverBoundingRect.bottom - hoverBoundingRect.top ) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY =
				( clientOffset as XYCoord ).y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if ( dragIndex < hoverIndex && hoverClientY < hoverMiddleY ) {
				return;
			}

			// Dragging upwards
			if ( dragIndex > hoverIndex && hoverClientY > hoverMiddleY ) {
				return;
			}

			// Time to actually perform the action
			moveCard( dragIndex, hoverIndex );

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		},
	} );

	const [ { isDragging }, drag ] = useDrag( {
		item: { type: ItemTypes.CARD, id, index },
		collect: ( monitor: any ) => ( {
			isDragging: monitor.isDragging(),
		} ),
	} );

	const opacity = isDragging ? 0 : 1;
	let className = 'wpProQuiz_questionListItem';

	if ( result === null ) {
		drag( drop( ref ) );

		className += ' ui-sortable-handle';
	} else if ( result ) {
		className += ' wpProQuiz_answerCorrect';
	} else {
		className += ' wpProQuiz_answerIncorrect';
	}

	return (
		<li className={ className } ref={ ref } style={ { opacity } }>
			<div className="wpProQuiz_sortable">{ text }</div>
		</li>
	);
};
