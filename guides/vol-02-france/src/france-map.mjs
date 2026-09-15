/**
 * Contour de la France métropolitaine et projection des destinations.
 *
 * Le tracé suit une série de points côtiers et frontaliers réels
 * (longitude, latitude), projetés en équirectangulaire avec correction du
 * méridien à la latitude moyenne du pays. Ce n'est pas une carte de
 * navigation : c'est un relevé éditorial, juste assez exact pour qu'on
 * reconnaisse le pays et que chaque point tombe où il doit.
 */

/** Points du contour, dans le sens horaire depuis Dunkerque. [lon, lat] */
const OUTLINE = [
  [2.38, 51.03], [1.85, 50.95], [1.60, 50.72], [1.37, 50.06], [0.68, 49.86],
  [0.11, 49.49], [-0.24, 49.29], [-1.16, 49.35], [-1.62, 49.68], [-1.57, 49.20],
  [-1.60, 48.84], [-1.85, 48.63], [-2.03, 48.65], [-2.55, 48.62], [-3.10, 48.79],
  [-3.98, 48.73], [-4.49, 48.39], [-4.74, 48.04], [-4.32, 47.80], [-3.37, 47.75],
  [-2.76, 47.52], [-2.20, 47.28], [-1.95, 46.95], [-1.78, 46.50], [-1.15, 46.16],
  [-1.03, 45.62], [-0.72, 45.10], [-1.17, 44.66], [-1.33, 44.20], [-1.42, 43.68],
  [-1.77, 43.37], [-1.15, 43.05], [-0.37, 42.80], [0.59, 42.70], [1.52, 42.50],
  [2.10, 42.35], [3.17, 42.43], [3.05, 42.80], [3.00, 43.18], [3.70, 43.40],
  [4.15, 43.45], [4.85, 43.35], [5.37, 43.30], [5.93, 43.12], [6.63, 43.16],
  [7.27, 43.70], [7.50, 43.78], [7.00, 44.24], [6.87, 44.36], [6.64, 44.90],
  [7.00, 45.25], [6.86, 45.83], [6.80, 46.05], [6.14, 46.20], [6.06, 46.42],
  [6.44, 46.77], [7.00, 47.35], [7.59, 47.56], [7.58, 48.12], [8.23, 48.97],
  [7.07, 49.11], [6.36, 49.47], [5.77, 49.52], [4.83, 50.13], [4.23, 49.95],
  [3.97, 50.28], [3.66, 50.35], [3.06, 50.63], [2.55, 50.81],
];

const LON_MIN = -4.9, LON_MAX = 8.4, LAT_MIN = 42.2, LAT_MAX = 51.2;
const K = Math.cos(((LAT_MIN + LAT_MAX) / 2) * Math.PI / 180); // ≈ 0.66

const spanX = (LON_MAX - LON_MIN) * K;
const spanY = LAT_MAX - LAT_MIN;

/** Projette [lon, lat] dans une boîte de `w` × `h` unités SVG. */
export const project = ([lon, lat], w, h) => {
  const s = Math.min(w / spanX, h / spanY);
  const ox = (w - spanX * s) / 2;
  const oy = (h - spanY * s) / 2;
  return [
    ox + (lon - LON_MIN) * K * s,
    oy + (LAT_MAX - lat) * s,
  ];
};

/** Chemin SVG fermé du contour. */
export const outlinePath = (w, h) =>
  OUTLINE.map((p, i) => `${i ? "L" : "M"}${project(p, w, h).map((n) => n.toFixed(2)).join(" ")}`).join(" ") + " Z";

/** "45.899 / 6.129" → [lon, lat] */
export const parseCoords = (s) => {
  const [lat, lon] = String(s).split("/").map((n) => parseFloat(n.trim()));
  return [lon, lat];
};
