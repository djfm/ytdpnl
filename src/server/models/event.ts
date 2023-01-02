/* eslint-disable @typescript-eslint/no-inferrable-types */

import {Entity, Column} from 'typeorm';
import {IsNotEmpty, IsString} from 'class-validator';

import Model from '../lib/model';

export enum EventType {
	PAGE_VIEW = 'PAGE_VIEW',
	RECOMMENDATIONS_SHOWN = 'RECOMMENDATIONS_SHOWN',
}

@Entity()
export class Event extends Model {
	@Column()
	@IsNotEmpty()
	@IsString()
		sessionUuid: string = '';

	@Column()
		type: EventType = EventType.PAGE_VIEW;

	@Column()
	@IsNotEmpty()
	@IsString()
		url: string = '';
}

export default Event;
