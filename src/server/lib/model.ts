import {Column, PrimaryGeneratedColumn} from 'typeorm';

export class Model {
	@PrimaryGeneratedColumn()
	id = 0;

	@Column()
	createdAt: Date = new Date();

	@Column()
	updatedAt: Date = new Date();
}

export default Model;
