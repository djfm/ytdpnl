/* eslint-disable @typescript-eslint/no-inferrable-types */

import {Entity, Column} from 'typeorm';
import {Min, Max, IsNumber, IsString} from 'class-validator';

import Model from '../lib/model';

@Entity()
export class ExperimentConfig extends Model {
	@Column()
	@IsNumber()
	@Min(0)
	@Max(1)
		nonPersonalizedProbability: number = 0.5;

	@IsString()
		comment: string = '';

	@Column()
		isCurrent: boolean = true;
}

export default ExperimentConfig;
