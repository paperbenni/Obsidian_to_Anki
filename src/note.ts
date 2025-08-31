import {
  AnkiConnectNote,
  AnkiConnectNoteAndID,
} from "./interfaces/note-interface";
import { FileData, ParsedSettings } from "./interfaces/settings-interface";
import { FROZEN_FIELDS_DICT } from "./interfaces/field-interface";
import { FormatConverter } from "./format";

export const NOTE_TYPE_ERROR: number = -1;
export const CLOZE_ERROR: number = -2;

export const TAG_SEP: string = " ";

export const ID_REGEXP_STR: string = String.raw`(?:\s*<!--ID: (\d+)-->\s*$)`;
export const ID_REGEXP: RegExp = new RegExp(ID_REGEXP_STR, "m");

const TAG_REGEXP_STR: string = String.raw`\s*TAGS: ([^\n]+)\s*`;
export const TAG_REGEXP: RegExp = new RegExp(TAG_REGEXP_STR, "m");

function get_field(note: string, field_name: string): string {
  const regexp: RegExp = new RegExp(
    String.raw`(^|\n)\s*${field_name}:((?:\n.+)*)`
  );
  const result = note.match(regexp);
  return result ? result[2].trim() : "";
}

export class Note {
  note: string;
  fields_dict: Record<string, string[]>;
  note_type: string;
  fields: Record<string, string>;
  tags: string[];
  identifier: number | null;
  formatter: FormatConverter;
  curly_cloze: boolean;
  highlights_to_cloze: boolean;

  constructor(
    note: string,
    fields_dict: Record<string, string[]>,
    curly_cloze: boolean,
    highlights_to_cloze: boolean,
    formatter: FormatConverter
  ) {
    this.note = note;
    this.fields_dict = fields_dict;
    this.formatter = formatter;
    this.curly_cloze = curly_cloze;
    this.highlights_to_cloze = highlights_to_cloze;
  }

  getFields(): Record<string, string> {
    let fields: Record<string, string> = {};
    if (this.fields_dict[this.note_type]) {
      for (let field_name of this.fields_dict[this.note_type]) {
        fields[field_name] = this.formatter.format(
          get_field(this.note, field_name)
        );
      }
    }
    return fields;
  }

  getTags(): string[] {
    const result = this.note.match(TAG_REGEXP);
    return result ? result[1].split(TAG_SEP) : [];
  }

  getIdentifier(): number | null {
    const result = this.note.match(ID_REGEXP);
    return result && result[1] ? parseInt(result[1]) : null;
  }

  getNoteType(): string {
    const first_line: string = this.note.split("\n")[0];
    if (first_line) {
      for (let note_type in this.fields_dict) {
        if (first_line.startsWith(note_type)) {
          this.note = this.note.slice(first_line.length);
          return note_type;
        }
      }
    }
    return "";
  }

  parse(
    target_deck: string,
    file_link: string,
    frozen_fields: FROZEN_FIELDS_DICT,
    settings: ParsedSettings,
    context: string
  ): AnkiConnectNoteAndID {
    this.note_type = this.getNoteType();
    this.tags = this.getTags();
    if (settings.add_obs_tags) {
      this.tags.push(...settings.template.tags);
    }
    this.identifier = this.getIdentifier();
    if (this.note_type) {
      this.fields = this.getFields();

      if (settings.add_file_link) {
        // this.formatter.format_note_with_url(
        //     { fields: this.fields } as AnkiConnectNote, file_link, settings.file_link_field
        // )
      }
      if (settings.add_context) {
        // this.formatter.format_note_with_frozen_fields(
        //     { fields: this.fields } as AnkiConnectNote,
        //     { [this.note_type]: { [settings.context_field]: context } }
        // )
      }
      return {
        note: {
          deckName: target_deck,
          modelName: this.note_type,
          fields: this.fields,
          tags: this.tags,
          options: {
            allowDuplicate: false,
            duplicateScope: "deck",
            duplicateScopeOptions: {
              deckName: "Default",
              checkChildren: false,
              checkAllModels: false,
            },
          },
        },
        identifier: this.identifier,
      };
    } else {
      return {
        note: {
          deckName: "",
          modelName: "",
          fields: {},
          tags: [],
          options: {
            allowDuplicate: false,
            duplicateScope: "deck",
            duplicateScopeOptions: {
              deckName: "Default",
              checkChildren: false,
              checkAllModels: false,
            },
          },
        },
        identifier: NOTE_TYPE_ERROR,
      };
    }
  }
}

export class InlineNote extends Note {
  getNoteType(): string {
    const result = this.note.match(/NOTE TYPE: ([^\n]+)/);
    if (result && result[1]) {
      this.note = this.note.replace(/NOTE TYPE: [^\n]+/, "");
      return result[1];
    }
    return "";
  }

  getFields(): Record<string, string> {
    let fields: Record<string, string> = {};
    const lines: string[] = this.note.split("\n");
    if (
      this.fields_dict[this.note_type] &&
      lines.length != this.fields_dict[this.note_type].length
    ) {
      this.note_type = "";
      return {};
    }
    if (this.fields_dict[this.note_type]) {
      for (let i in lines) {
        fields[this.fields_dict[this.note_type][i]] = this.formatter.format(
          lines[i]
        );
      }
    }
    return fields;
  }
}

export class RegexNote extends Note {
  match: RegExpMatchArray;
  search_tags: boolean;
  search_id: boolean;

  constructor(
    match: RegExpMatchArray,
    note_type: string,
    fields_dict: Record<string, string[]>,
    search_tags: boolean,
    search_id: boolean,
    curly_cloze: boolean,
    highlights_to_cloze: boolean,
    formatter: FormatConverter
  ) {
    super(match[0], fields_dict, curly_cloze, highlights_to_cloze, formatter);
    this.note_type = note_type;
    this.match = match;
    this.search_tags = search_tags;
    this.search_id = search_id;
  }

  getFields(): Record<string, string> {
    let fields: Record<string, string> = {};
    const field_names = this.fields_dict[this.note_type];
    if (field_names) {
      for (let i in field_names) {
        const index: number = parseInt(i);
        fields[field_names[index]] = this.formatter.format(
          this.match[index + 1]
        );
      }
    }
    return fields;
  }

  getTags(): string[] {
    if (this.search_tags) {
      const result = this.note.match(TAG_REGEXP);
      if (result) {
        this.note = this.note.replace(TAG_REGEXP, "");
        return result[1] ? result[1].split(TAG_SEP) : [];
      }
    }
    return [];
  }

  getIdentifier(): number | null {
    if (this.search_id) {
      const result = this.note.match(ID_REGEXP);
      if (result) {
        this.note = this.note.replace(ID_REGEXP, "");
        return result[1] ? parseInt(result[1]) : null;
      }
    }
    return null;
  }
}
