import Event, {EventType} from './event';
import type Recommendation from '../../extension/models/Recommendation';

export class RecommendationsEvent extends Event {
	constructor(
		public readonly nonPersonalized: Recommendation[],
		public readonly personalized: Recommendation[],
		public readonly shown: Recommendation[],
	) {
		super();
		this.type = EventType.RECOMMENDATIONS_SHOWN;
	}
}

export default RecommendationsEvent;
