import React from 'react';

import type Recommendation from '../models/Recommendation';

export const RecommendationC: React.FC<Recommendation> = rec => (
	<div>
		<a href={rec.url}>
			{rec.title}
		</a>
	</div>
);

export default RecommendationC;
