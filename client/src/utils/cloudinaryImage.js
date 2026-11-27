const DEFAULT_WIDTH = 1200;
const IMAGE_UPLOAD_PATH = /^(\/[\w-]+\/image\/upload\/)(v\d+\/)?([^/]+(?:\/[^/]+)*)$/;
const VERSION = /^v\d+$/;
const TRANSFORMATION_OR_SIGNATURE = /^(?:\w{1,3}_|\$|s--)/;

export function optimizeCloudinaryImage(src, width = DEFAULT_WIDTH) {
  if (typeof src !== "string" || !src.startsWith("https://res.cloudinary.com/")) {
    return src;
  }

  const url = new URL(src);
  const match = IMAGE_UPLOAD_PATH.exec(url.pathname);
  if (!match || url.href !== src || url.searchParams.has("__cld_token__")) {
    return src;
  }

  const [, uploadPath, version = "", assetPath] = match;
  let segments;
  try {
    segments = assetPath.split("/").map(decodeURIComponent);
  } catch {
    return src;
  }

  // A transformation-like prefix can be part of a public ID after a version.
  if (
    (!version && TRANSFORMATION_OR_SIGNATURE.test(segments[0])) ||
    segments.some((segment) => VERSION.test(segment) || /[/?&#\\%<>+]/.test(segment))
  ) {
    return src;
  }

  const maxWidth = Number.isSafeInteger(width) && width > 0 ? width : DEFAULT_WIDTH;
  url.pathname = `${uploadPath}c_limit,w_${maxWidth}/f_auto/q_auto/${version}${assetPath}`;
  return url.href;
}
