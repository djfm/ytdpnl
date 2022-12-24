/* eslint-disable @typescript-eslint/no-inferrable-types */

import {Entity, Column} from 'typeorm';
import {IsNotEmpty, MinLength, IsString} from 'class-validator';

import Model from '../lib/model';

@Entity()
export class Admin extends Model {
	@IsNotEmpty()
	@Column()
	@IsString()
		name: string = '';

	@IsNotEmpty()
	@Column()
	@IsString()
		email: string = '';

	@IsNotEmpty()
	@MinLength(8)
	@Column()
	@IsString()
		password: string = '';
}

export default Admin;
