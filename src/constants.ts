/*Useful constants for the plugin*/

export const ANKI_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;

export const OBS_TAG_REGEXP_STR: string = String.raw`(^|\s)#([^\s#]*)`;
export const OBS_TAG_REGEXP: RegExp = new RegExp(OBS_TAG_REGEXP_STR, "g");

export const OBS_WIKILINK_REGEXP_STR: string = String.raw`\[\[([^\[\]|]*)?\|?([^\[\]]*)?\]\]`;
export const OBS_WIKILINK_REGEXP: RegExp = new RegExp(
  OBS_WIKILINK_REGEXP_STR,
  "g"
);

export const OBS_EMBED_REGEXP_STR: string = String.raw`!\[\[([^\[\]|]*)?\|?([^\[\]]*)?\]\]`;
export const OBS_EMBED_REGEXP: RegExp = new RegExp(OBS_EMBED_REGEXP_STR, "g");

export const OBS_INLINE_MATH_REGEXP_STR: string = String.raw`(?<pre>[^$]|^)\$([^$\n]+?)\$(?<post>[^$]|$)`;
export const OBS_INLINE_MATH_REGEXP: RegExp = new RegExp(
  OBS_INLINE_MATH_REGEXP_STR,
  "g"
);

export const OBS_DISPLAY_MATH_REGEXP_STR: string = String.raw`(?<pre>[^$]|^)\$\$([^$\n]+?)\$\$(?<post>[^$]|$)`;
export const OBS_DISPLAY_MATH_REGEXP: RegExp = new RegExp(
  OBS_DISPLAY_MATH_REGEXP_STR,
  "g"
);

export const OBS_CODE_REGEXP_STR: string = String.raw`(?<pre>[^\`]|^)\`([^\`\n]+?)\`(?<post>[^\`]|$)`;
export const OBS_CODE_REGEXP: RegExp = new RegExp(OBS_CODE_REGEXP_STR, "g");

export const OBS_DISPLAY_CODE_REGEXP_STR: string = String.raw`(?<pre>[^\`]|^)\`\`\`(.*?)\n([\s\S]+?)\n\`\`\`(?<post>[^\`]|$)`;
export const OBS_DISPLAY_CODE_REGEXP: RegExp = new RegExp(
  OBS_DISPLAY_CODE_REGEXP_STR,
  "g"
);

export const CODE_CSS_URL: string =
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css";

export const OBS_CLOZE_REGEXP: RegExp =
  /(?:(?<!{){(?:c?(\d+)[:|])?(?!{))((?:[^\n][\n]?)+?)(?:(?<!})}(?!}))/g;
export const OBS_CLOZE_HIGHLIGHT_REGEXP: RegExp = /==(.*?)==/g;
export const OBS_HIGHLIGHT_REGEXP: RegExp = /==(.*?)==/g;

export const escapeRegex = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
