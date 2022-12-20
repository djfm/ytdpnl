import {removeDuplicates} from './util';

describe('removeDuplicates', () => {
	it('should remove duplicates in a basic array', () => {
		const input = [1, 2, 2, 3];
		const expected = [1, 2, 3];
		const actual = removeDuplicates(x => x)(input);
		expect(actual).toEqual(expected);
	});

	it('should remove duplicates in an array of objects', () => {
		type Item = {id: number};

		const input: Item[] = [{id: 1}, {id: 2}, {id: 2}, {id: 3}];
		const expected: Item[] = [{id: 1}, {id: 2}, {id: 3}];
		const actual = removeDuplicates((x: Item) => x.id)(input);
		expect(actual).toEqual(expected);
	});
});
