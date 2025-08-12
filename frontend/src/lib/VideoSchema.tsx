import * as yup from "yup";

const YOUTUBE_EMBED_REGEX = /^https:\/\/www\.youtube\.com\/embed\/[\w-]{11}(\?.*)?$/;

export const VideoSchema = yup.object({
  title: yup
    .string()
    .optional()
    .test(
      "is-youtube-iframe",
      "Input must be a YouTube embed iframe (with a valid src)",
      (value) => {
        if (!value) return true; // allow empty (undefined/null/"")
        // Extract src from iframe string
        const match = value.match(/src="([^"]+)"/);
        if (!match) return false;
        const src = match[1];
        return YOUTUBE_EMBED_REGEX.test(src);
      }
    ),
});
