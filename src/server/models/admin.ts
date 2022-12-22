import {Entity, Column} from 'typeorm';

import Model from '../lib/model';

@Entity()
export class Admin extends Model {
	@Column()
	name: string = '';

	@Column()
	email: string = '';

	@Column()
	password: string = '';
}

export default Admin;
