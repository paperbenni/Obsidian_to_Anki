/*Class for formatting notes, from markdown to anki-connect readable HTML*/
import * as showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import * as c from "./constants";
import { CachedMetadata, parseLinktext } from "obsidian";

export class FormatConverter {
  converter: showdown.Converter;
  file_cache: CachedMetadata;
  vault_name: string;
  detectedMedia: Set<string>;

  constructor(file_cache: CachedMetadata, vault_name: string) {
    this.converter = new showdown.Converter({
      tables: true,
      strikethrough: true,
      tasklists: true,
      simpleLineBreaks: true,
      ghMentions: false,
      openLinksInNewWindow: true,
      underline: true,
      metadata: false,
      extensions: [
        showdownHighlight({
          pre: true,
          auto_detection: true,
        }),
      ],
    });
    this.file_cache = file_cache;
    this.vault_name = vault_name;
    this.detectedMedia = new Set<string>();
  }

  /*A lot of these regexes are based on the anki-importer plugin's regexes!*/
  format(str: string): string {
    str = this.formatBase(str);
    str = this.formatCloze(str);
    str = this.formatMath(str);
    str = this.formatCode(str);
    return str;
  }

  formatBase(str: string): string {
    return this.converter.makeHtml(str);
  }

  formatCloze(str: string): string {
    return str
      .replace(c.OBS_CLOZE_REGEXP, (match, pre, cloze_content, post) => {
        return (
          (pre || "") +
          (cloze_content || "").replace(/<br>/g, " ") +
          (post || "")
        );
      })
      .replace(
        c.OBS_CLOZE_HIGHLIGHT_REGEXP,
        (match, pre, cloze_content, post) => {
          return (
            (pre || "") + "{{c1::" + (cloze_content || "") + "}}" + (post || "")
          );
        }
      );
  }

  formatHighlights(str: string): string {
    return str.replace(c.OBS_HIGHLIGHT_REGEXP, (match, pre, content, post) => {
      return (
        (pre || "") + "<mark>" + (content || "") + "</mark>" + (post || "")
      );
    });
  }

  formatLinks(str: string): string {
    return str.replace(c.OBS_WIKILINK_REGEXP, (match, text, post) => {
      const parsed = parseLinktext(text);
      const link =
        "obsidian://open?vault=" + this.vault_name + "&file=" + parsed.path;
      return '<a href="' + link + '">' + text + "</a>" + (post || "");
    });
  }

  formatMedia(str: string): string {
    /*Formats all media links in a string*/
    return str.replace(c.OBS_EMBED_REGEXP, (match, pre, alt, link, post) => {
      const media_name = parseLinktext(link).path;
      this.detectedMedia.add(media_name);
      return (
        (pre || "") +
        '<img alt="' +
        alt +
        '" src="' +
        media_name +
        '" />' +
        (post || "")
      );
    });
  }

  formatTags(str: string): string {
    return str.replace(c.OBS_TAG_REGEXP, (match, pre, tag, post) => {
      return (pre || "") + "" + (post || "");
    });
  }

  formatMath(str: string): string {
    /*Formats all math expressions in a string*/
    str = str.replace(
      c.OBS_INLINE_MATH_REGEXP,
      (match, pre, expression, post) => {
        return (pre || "") + "\\(" + (expression || "") + "\\)" + (post || "");
      }
    );
    str = str.replace(
      c.OBS_DISPLAY_MATH_REGEXP,
      (match, pre, expression, post) => {
        return (pre || "") + "\\[" + (expression || "") + "\\]" + (post || "");
      }
    );
    return str;
  }

  formatCode(str: string): string {
    /*Formats all code expressions in a string*/
    str = str.replace(c.OBS_CODE_REGEXP, (match, pre, expression, post) => {
      return (
        (pre || "") +
        "<code>" +
        (expression || "").replace(/<br>/g, "\n") +
        "</code>" +
        (post || "")
      );
    });
    str = str.replace(
      c.OBS_DISPLAY_CODE_REGEXP,
      (match, pre, lang, expression, post) => {
        const highlight_class = lang ? `class="language-${lang}"` : "";
        return (
          (pre || "") +
          "<pre><code " +
          highlight_class +
          ">" +
          (expression || "").replace(/<br>/g, "\n") +
          "</code></pre>" +
          (post || "")
        );
      }
    );
    return str;
  }
}
