export interface AnkiConnectNote {
  deckName: string;
  modelName: string;
  fields: Record<string, string>;
  options: {
    allowDuplicate: boolean;
    duplicateScope: string;
    /** Additional duplicate scope options returned/accepted by newer AnkiConnect versions */
    duplicateScopeOptions?: Record<string, unknown>;
  };
  tags: Array<string>;
}

export interface AnkiConnectNoteAndID {
  note: AnkiConnectNote;
  identifier: number | null;
}
