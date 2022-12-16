import type Recommendation from './models/Recommendation';

import {has} from './util';

const fetchNonPersonalizedRecommendations = async (videoUrl: string): Promise<Recommendation[]> => {
	const html = await (await fetch(videoUrl, {
		credentials: 'omit',
	})).text();

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const scripts = Array.from(doc.querySelectorAll('script'));

	const initialDataScript = scripts.find(script => {
		const {textContent} = script;

		if (textContent) {
			return textContent.trimStart().startsWith('var ytInitialData = ');
		}

		return false;
	});

	if (!initialDataScript) {
		throw new Error('Could not find initial data script');
	}

	const jsonText = initialDataScript.textContent?.replace('var ytInitialData = ', '').replace(/;$/, '').trim();

	if (!jsonText) {
		throw new Error('Could not parse initial data');
	}

	const initialData = JSON.parse(jsonText) as Record<string, unknown>;

	const {contents} = initialData;

	if (typeof contents !== 'object' || !contents) {
		throw new Error('Could not find contents in initial data');
	}

	if (!has('twoColumnWatchNextResults')(contents)) {
		throw new Error('Could not find twoColumnWatchNextResults in contents');
	}

	const {twoColumnWatchNextResults} = contents;

	if (typeof twoColumnWatchNextResults !== 'object' || !twoColumnWatchNextResults) {
		throw new Error('Could not find twoColumnWatchNextResults in contents');
	}

	if (!has('secondaryResults')(twoColumnWatchNextResults)) {
		throw new Error('Could not find secondaryResults in twoColumnWatchNextResults');
	}

	const {secondaryResults} = twoColumnWatchNextResults;

	if (typeof secondaryResults !== 'object' || !secondaryResults) {
		throw new Error('Could not find secondaryResults in twoColumnWatchNextResults');
	}

	if (!has('secondaryResults')(secondaryResults)) {
		throw new Error('Could not find secondaryResults in secondaryResults');
	}

	const {secondaryResults: secondaryResults2} = secondaryResults;

	if (typeof secondaryResults2 !== 'object' || !secondaryResults2) {
		throw new Error('Could not find secondaryResults in secondaryResults');
	}

	if (!has('results')(secondaryResults2)) {
		throw new Error('Could not find results in secondaryResults');
	}

	const {results} = secondaryResults2;

	if (!Array.isArray(results)) {
		throw new Error('Could not find results in secondaryResults');
	}

	// eslint-disable-next-line complexity
	const recommendations: Array<Recommendation | undefined> = results.map(result => {
		if (!has('compactVideoRenderer')(result)) {
			return undefined;
		}

		const {compactVideoRenderer: r} = result;

		if (typeof r !== 'object' || !r) {
			return undefined;
		}

		if (!has('title')(r) || typeof r.title !== 'object' || !r.title) {
			return undefined;
		}

		const {title} = r;

		if (!has('simpleText')(title) || typeof title.simpleText !== 'string') {
			return undefined;
		}

		if (!has('videoId')(r) || typeof r.videoId !== 'string') {
			return undefined;
		}

		if (!has('longBylineText')(r) || typeof r.longBylineText !== 'object' || !r.longBylineText) {
			return undefined;
		}

		const {longBylineText} = r;

		if (!has('runs')(longBylineText) || !Array.isArray(longBylineText.runs)) {
			return undefined;
		}

		const {runs} = longBylineText;

		if (runs.length === 0) {
			return undefined;
		}

		if (!has('text')(runs[0]) || typeof runs[0].text !== 'string') {
			return undefined;
		}

		if (!has('shortViewCountText')(r) || typeof r.shortViewCountText !== 'object' || !r.shortViewCountText) {
			return undefined;
		}

		const {shortViewCountText} = r;

		if (!has('simpleText')(shortViewCountText) || typeof shortViewCountText.simpleText !== 'string') {
			return undefined;
		}

		if (!has('publishedTimeText')(r) || typeof r.publishedTimeText !== 'object' || !r.publishedTimeText) {
			return undefined;
		}

		const {publishedTimeText} = r;

		if (typeof publishedTimeText !== 'object' || !publishedTimeText) {
			return undefined;
		}

		if (!has('simpleText')(publishedTimeText) || typeof publishedTimeText.simpleText !== 'string') {
			return undefined;
		}

		const rec: Recommendation = {
			title: title.simpleText,
			videoId: r.videoId,
			url: `{url.origin}/watch?v=${r.videoId}`,
			channelName: runs[0].text,
			miniatureUrl: `https://i.ytimg.com/vi/${r.videoId}/hqdefault.jpg`,
			views: shortViewCountText.simpleText,
			publishedSince: publishedTimeText.simpleText,
			isPersonalized: false,
		};

		return rec;
	});

	return recommendations.filter((r): r is Recommendation => Boolean(r));
};

export default fetchNonPersonalizedRecommendations;
