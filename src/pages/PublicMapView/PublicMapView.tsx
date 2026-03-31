import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import L from "leaflet";
import { usePub } from "../../context/PublicProfileContext";
import type { ApiTrip } from "../../services/api";
import "leaflet/dist/leaflet.css";
import "../MapView/MapView.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const COORDS: Record<string, [number, number]> = {
  santorini: [36.39, 25.46],
  greece: [37.97, 23.73],
  athens: [37.97, 23.73],
  paris: [48.85, 2.35],
  france: [46.23, 2.21],
  tokyo: [35.68, 139.69],
  japan: [36.2, 138.25],
  bali: [-8.34, 115.09],
  indonesia: [-0.79, 113.92],
  rome: [41.89, 12.49],
  italy: [41.87, 12.57],
  barcelona: [41.38, 2.17],
  spain: [40.46, -3.75],
  london: [51.5, -0.12],
  "united kingdom": [55.37, -3.43],
  nyc: [40.71, -74.0],
  "new york": [40.71, -74.0],
  usa: [37.09, -95.71],
  dubai: [25.2, 55.27],
  uae: [23.42, 53.84],
  singapore: [1.35, 103.82],
  sydney: [-33.86, 151.2],
  australia: [-25.27, 133.77],
  toronto: [43.65, -79.38],
  canada: [56.13, -106.34],
  amsterdam: [52.37, 4.89],
  netherlands: [52.13, 5.29],
  berlin: [52.52, 13.4],
  germany: [51.16, 10.45],
  prague: [50.07, 14.43],
  "czech republic": [49.81, 15.47],
  budapest: [47.49, 19.04],
  hungary: [47.16, 19.5],
  vienna: [48.2, 16.37],
  austria: [47.51, 14.55],
  lisbon: [38.71, -9.14],
  portugal: [39.39, -8.22],
  istanbul: [41.01, 28.97],
  turkey: [38.96, 35.24],
  cairo: [30.04, 31.23],
  egypt: [26.82, 30.8],
  marrakech: [31.63, -7.99],
  morocco: [31.79, -7.09],
  cape: [-33.92, 18.42],
  "south africa": [-30.55, 22.93],
  nairobi: [-1.28, 36.81],
  kenya: [-0.02, 37.9],
  mexico: [23.63, -102.55],
  "mexico city": [19.43, -99.13],
  rio: [-22.9, -43.17],
  brazil: [-14.23, -51.92],
  buenos: [-34.6, -58.38],
  argentina: [-38.41, -63.61],
  lima: [-12.04, -77.02],
  peru: [-9.18, -75.01],
  bangkok: [13.75, 100.52],
  thailand: [15.87, 100.99],
  "ho chi minh": [10.82, 106.62],
  vietnam: [14.05, 108.27],
  hanoi: [21.02, 105.83],
  beijing: [39.9, 116.4],
  china: [35.86, 104.19],
  mumbai: [19.07, 72.87],
  india: [20.59, 78.96],
  maldives: [3.2, 73.22],
  iceland: [64.96, -19.02],
  reykjavik: [64.13, -21.89],
  oslo: [59.91, 10.75],
  norway: [60.47, 8.46],
  stockholm: [59.33, 18.06],
  sweden: [60.12, 18.64],
  copenhagen: [55.67, 12.56],
  denmark: [56.26, 9.5],
  helsinki: [60.17, 24.93],
  finland: [61.92, 25.74],
  seoul: [37.56, 126.97],
  "south korea": [35.9, 127.76],
  taipei: [25.03, 121.56],
  taiwan: [23.69, 120.96],
  "new zealand": [-40.9, 174.88],
  auckland: [-36.86, 174.76],
  venice: [45.44, 12.33],
  florence: [43.76, 11.25],
  milan: [45.46, 9.19],
  monaco: [43.73, 7.42],
  switzerland: [46.81, 8.22],
  zurich: [47.37, 8.54],
  brussels: [50.85, 4.35],
  belgium: [50.5, 4.46],
  "sri lanka": [7.87, 80.77],
  colombo: [6.92, 79.86],
  nepal: [28.39, 84.12],
  kathmandu: [27.7, 85.31],
};

function getCoords(trip: ApiTrip): [number, number] | null {
  const search = (trip.place + " " + trip.region).toLowerCase();
  for (const [key, coords] of Object.entries(COORDS)) {
    if (search.includes(key)) return coords;
  }
  return null;
}

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function PublicMapView() {
  const { trips, username } = usePub();

  const mapped = trips
    .map((t) => ({ trip: t, coords: getCoords(t) }))
    .filter(
      (x): x is { trip: ApiTrip; coords: [number, number] } =>
        x.coords !== null,
    );

  const unmapped = trips.filter((t) => !getCoords(t));

  return (
    <main className="map-page">
      <div className="map-page_header">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="map-page_eyebrow">World map</p>
          <h1 className="map-page_heading">Footprint</h1>
        </motion.div>
        <motion.span
          className="map-page_count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          {`${mapped.length} pinned`}
        </motion.span>
      </div>

      <motion.div
        className="map-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
      >
        <MapContainer
          center={[20, 10]}
          zoom={2}
          className="map-container"
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {mapped.map(({ trip, coords }) => (
            <Marker key={trip.id} position={coords}>
              <Popup className="map-popup">
                <Link
                  to={`/u/${username}/trip/${trip.id}`}
                  className="map-popup_inner"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    gap: "0.75rem",
                  }}
                >
                  <img
                    src={trip.cover}
                    alt={trip.place}
                    className="map-popup_img"
                  />
                  <div className="map-popup_body">
                    <p className="map-popup_region">{trip.region}</p>
                    <strong className="map-popup_place">{trip.place}</strong>
                    <p className="map-popup_dates">{trip.dates}</p>
                  </div>
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>

      {unmapped.length > 0 && (
        <motion.div
          className="map-unmapped"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        >
          <p className="map-unmapped_label">
            Not yet mapped ({unmapped.length})
          </p>
          <div className="map-unmapped_list">
            {unmapped.map((t) => (
              <span key={t.id} className="map-unmapped_item">
                {t.place}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}
