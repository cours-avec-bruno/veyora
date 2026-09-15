/**
 * Contour de l'Italie et projection des destinations.
 *
 * Trois tracés — la péninsule, la Sicile, la Sardaigne — suivis d'une série
 * de points côtiers et frontaliers réels (longitude, latitude), projetés en
 * équirectangulaire avec correction du méridien à la latitude moyenne du
 * pays. Ce n'est pas une carte de navigation : c'est un relevé éditorial,
 * juste assez exact pour qu'on reconnaisse le pays et que chaque point
 * tombe où il doit.
 */

/** La péninsule, dans le sens horaire depuis Vintimille. [lon, lat] */
const MAINLAND = [
  [7.61, 43.79], [8.48, 44.31], [8.93, 44.40], [9.82, 44.10], [10.31, 43.55],
  [10.52, 42.93], [11.10, 42.42], [11.80, 42.09], [12.28, 41.73], [13.07, 41.25],
  [13.57, 41.21], [14.05, 40.80], [14.27, 40.85], [14.77, 40.68], [14.99, 40.35],
  [15.28, 40.02], [15.72, 39.99], [16.04, 39.36], [15.90, 38.68], [15.65, 38.11],
  [16.07, 37.93], [16.58, 38.51], [17.13, 39.08], [16.93, 39.60], [17.24, 40.47],
  [17.99, 40.06], [18.36, 39.79], [18.49, 40.15], [17.94, 40.64], [16.87, 41.12],
  [15.92, 41.63], [16.18, 41.90], [15.03, 41.93], [14.99, 42.00], [14.22, 42.46],
  [13.51, 43.62], [12.90, 43.92], [12.57, 44.06], [12.24, 44.72], [12.34, 45.44],
  [13.10, 45.63], [13.77, 45.65], [13.58, 46.51], [12.85, 46.65], [12.14, 46.54],
  [11.51, 47.00], [11.16, 46.67], [10.37, 46.47], [9.40, 46.32], [8.95, 46.17],
  [8.29, 46.12], [7.87, 45.93], [7.32, 45.74], [6.86, 45.83], [6.70, 45.08],
  [7.03, 44.70], [7.56, 44.15],
];

const SICILY = [
  [15.55, 38.19], [15.09, 37.50], [15.29, 37.07], [15.14, 36.69], [14.25, 37.07],
  [13.58, 37.31], [12.59, 37.65], [12.51, 38.02], [13.36, 38.12], [14.02, 38.04],
  [15.24, 38.22],
];

const SARDINIA = [
  [8.20, 40.96], [8.32, 40.56], [8.50, 39.90], [8.64, 38.87], [9.12, 39.22],
  [9.62, 39.10], [9.70, 39.94], [9.50, 40.92], [9.14, 41.24],
];

const LON_MIN = 6.5, LON_MAX = 18.7, LAT_MIN = 36.5, LAT_MAX = 47.2;
const K = Math.cos(((LAT_MIN + LAT_MAX) / 2) * Math.PI / 180);   // ≈ 0.744

const spanX = (LON_MAX - LON_MIN) * K;
const spanY = LAT_MAX - LAT_MIN;

/** Projette [lon, lat] dans une boîte de `w` × `h` unités SVG. */
export const project = ([lon, lat], w, h) => {
  const s = Math.min(w / spanX, h / spanY);
  const ox = (w - spanX * s) / 2;
  const oy = (h - spanY * s) / 2;
  return [ox + (lon - LON_MIN) * K * s, oy + (LAT_MAX - lat) * s];
};

const toPath = (pts, w, h) =>
  pts.map((p, i) => `${i ? "L" : "M"}${project(p, w, h).map((n) => n.toFixed(2)).join(" ")}`).join(" ") + " Z";

/** Les trois tracés fermés, dans l'ordre de dessin. */
export const outlinePaths = (w, h) => ({
  mainland: toPath(MAINLAND, w, h),
  sicily: toPath(SICILY, w, h),
  sardinia: toPath(SARDINIA, w, h),
});

/** Le contour principal seul — pour les repères de situation. */
export const outlinePath = (w, h) => toPath(MAINLAND, w, h);

/** "45.070 / 7.687" → [lon, lat] */
export const parseCoords = (s) => {
  const [lat, lon] = String(s).split("/").map((n) => parseFloat(n.trim()));
  return [lon, lat];
};
