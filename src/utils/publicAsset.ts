/**
 * Returns the URL for an asset inside public/, respecting Vite's configured
 * base path. Local previews use /media/...; GitHub Pages uses /Vale/media/....
 * Do not hardcode the GitHub account or repository into component URLs.
 */
export function publicAsset(path: string): string {
  if (!path || /^(?:https?:|data:|blob:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  const relativePath = path.replace(/^\/+/, "");
  // Cambiar esta versión obliga a Safari a descargar de nuevo fotografías
  // que antes estaban en formato JPEG aunque se llamaran .webp.
  const isImage = /\.(?:webp|jpe?g|png)$/i.test(relativePath);
  return `${prefix}${relativePath}${isImage ? "?v=vale-imagenes-reparadas-1" : ""}`;
}
