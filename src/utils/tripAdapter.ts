import type { ApiTrip } from '../services/api';
import type { Trip } from '../data/trips';

/**
 * Converts an API trip (from MongoDB) into the Trip shape expected
 * by existing components (TripCard, NavDots, Carousel, etc.)
 */
export function apiTripToTrip(
  apiTrip: ApiTrip,
  index = 0
): Trip {
  return {
    id:       apiTrip.id,
    index:    String(index + 1).padStart(2, '0'),
    place:    apiTrip.place,
    region:   apiTrip.region,
    dates:    apiTrip.dates,
    summary:  apiTrip.summary,
    cover:    apiTrip.cover,
    photos:   apiTrip.photos,
    accent: apiTrip.accent,
  };
}
