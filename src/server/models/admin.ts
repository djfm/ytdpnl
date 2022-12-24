/* eslint-disable @typescript-eslint/no-inferrable-types */

import {Entity, Column} from 'typeorm';
import {IsNotEmpty, MinLength} from 'class-validator';

import Model from '../lib/model';

@Entity()
export class Admin extends Model {
	@IsNotEmpty()
	@Column()
		name: string = '';

	@IsNotEmpty()
	@Column()
		email: string = '';

	@IsNotEmpty()
	@MinLength(8)
	@Column()
		password: string = '';
}

export default Admin;
