/* eslint-disable @typescript-eslint/no-inferrable-types */

import {Entity, Column} from 'typeorm';
import {IsNotEmpty, IsString} from 'class-validator';

import Model from '../lib/model';

export enum ExperimentArm {
	TREATMENT = 'treatment',
	CONTROL = 'control',
}

@Entity()
export class Participant extends Model {
	@IsNotEmpty()
	@Column()
	@IsString()
		email: string = '';

	@IsNotEmpty()
	@Column()
	@IsString()
		code: string = '';

	@Column()
		arm: ExperimentArm = ExperimentArm.TREATMENT;
}

export default Participant;
