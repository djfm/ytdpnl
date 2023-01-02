/* eslint-disable @typescript-eslint/no-inferrable-types */

import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {Min, Max, IsNumber, IsInt, IsString} from 'class-validator';

import Model from '../lib/model';

import Admin from './admin';

@Entity()
export class ExperimentConfig extends Model {
	@Column({type: 'double precision'})
	@IsNumber()
	@Min(0)
	@Max(1)
		nonPersonalizedProbability: number = 0.5;

	@Column()
	@IsString()
		comment: string = '';

	@Column()
		isCurrent: boolean = true;

	@Column()
	@IsInt()
		adminId: number = 0;

	@ManyToOne(() => Admin, admin => admin.experimentConfigs)
	@JoinColumn({name: 'admin_id'})
		admin?: Admin;
}

export default ExperimentConfig;
