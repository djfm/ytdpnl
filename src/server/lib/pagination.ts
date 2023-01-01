export type Page<T> = {
	results: T[];
	page: number;
	pageSize: number;
	pageCount: number;
};

export default Page;
