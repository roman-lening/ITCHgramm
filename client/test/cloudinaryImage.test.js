import assert from "node:assert/strict";
import test from "node:test";
import { optimizeCloudinaryImage } from "../src/utils/cloudinaryImage.js";

const uploadUrl = "https://res.cloudinary.com/demo/image/upload/";

test("adds delivery transformations while preserving the asset path and URL suffix", () => {
  const paths = [
    "sample.jpg",
    "itchgramm/posts/photo",
    "v1234567890/itchgramm/posts/photo.webp",
    "v1234567890/my_folder/photo%20name.png?_a=abc%2Bdef#preview",
  ];

  for (const path of paths) {
    const src = uploadUrl + path;
    assert.equal(
      optimizeCloudinaryImage(src, 640),
      uploadUrl + "c_limit,w_640/f_auto/q_auto/" + path,
    );
  }
});

test("uses the default width when no positive integer width is provided", () => {
  const src = uploadUrl + "sample.jpg";
  const expected = uploadUrl + "c_limit,w_1200/f_auto/q_auto/sample.jpg";

  for (const width of [undefined, null, 0, -1, 96.5, NaN, Infinity, "96", Number.MAX_VALUE]) {
    assert.equal(optimizeCloudinaryImage(src, width), expected);
  }
});

test("preserves existing transformations and signed URLs", () => {
  const paths = [
    "c_fill,w_300/v1234567890/sample.jpg",
    "t_preview/sample.jpg",
    "f_auto/q_auto/sample.jpg",
    "s--signature--/v1234567890/sample.jpg",
    "sample.jpg?__cld_token__=signed",
  ];

  for (const path of paths) {
    const src = uploadUrl + path;
    assert.equal(optimizeCloudinaryImage(src, 96), src);
  }

  const optimized = optimizeCloudinaryImage(uploadUrl + "sample.jpg", 96);
  assert.equal(optimizeCloudinaryImage(optimized, 96), optimized);
  assert.equal(optimizeCloudinaryImage(optimized, 640), optimized);
});

test("preserves non-image URLs, local sources and unexpected input", () => {
  const sources = [
    "",
    null,
    undefined,
    42,
    "not a URL",
    "/assets/itchgram.png",
    "blob:https://example.com/preview",
    "data:image/png;base64,AA==",
    "https://example.com/demo/image/upload/sample.jpg",
    "https://res.cloudinary.com.example.com/demo/image/upload/sample.jpg",
    "http://res.cloudinary.com/demo/image/upload/sample.jpg",
    "https://res.cloudinary.com/demo/video/upload/sample.mp4",
    "https://res.cloudinary.com/demo/image/fetch/https://example.com/sample.jpg",
    uploadUrl,
    uploadUrl + "v1234567890",
    uploadUrl + "v%31/my_folder/sample.jpg",
    uploadUrl + "path//sample.jpg",
    uploadUrl + "path/../sample.jpg",
    uploadUrl + "bad%2Fpath/sample.jpg",
    uploadUrl + "bad%ZZ.jpg",
    uploadUrl + "my_folder/sample.jpg",
  ];

  for (const src of sources) {
    assert.equal(optimizeCloudinaryImage(src), src);
  }
});
