import { App, PluginSettingTab, Setting, Notice } from 'obsidian'
import MyPlugin from '../main'
import { PluginSettings } from './interfaces/settings-interface'
import * as AnkiConnect from './anki'

export const DEFAULT_IGNORED_FILE_GLOBS: string[] = [
	"**/templates/**"
]

const DEFAULT_SETTINGS: Record<keyof PluginSettings["Defaults"], string> = {
	"Scan Directory": "The directory to scan. Leave empty to scan the entire vault",
	"Tag": "The tag that the plugin automatically adds to any generated cards.",
	"Deck": "The deck the plugin adds cards to if TARGET DECK is not specified in the file.",
	"Scheduling Interval": "The time, in minutes, between automatic scans of the vault. Set this to 0 to disable automatic scanning.",
	"Add File Link": "Append a link to the file that generated the flashcard on the field specified in the table.",
	"Add Context": "Append 'context' for the card, in the form of path > heading > heading etc, to the field specified in the table.",
	"CurlyCloze": "Convert {cloze deletions} -> {{c1::cloze deletions}} on note types that have a 'Cloze' in their name.",
	"CurlyCloze - Highlights to Clozes": "Convert ==highlights== -> {highlights} to be processed by CurlyCloze.",
	"ID Comments": "Wrap note IDs in a HTML comment.",
	"Add Obsidian Tags": "Interpret #tags in the fields of a note as Anki tags, removing them from the note text in Anki."
}

export class SettingsTab extends PluginSettingTab {
	plugin: MyPlugin;
	note_types: string[]
	fields_dict: Record<string, string[]>

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	sanitise_input(key: keyof PluginSettings["Defaults"], input: string): [boolean, string | number] {
		let value: number | string = input
		if (key === "Scheduling Interval") {
			value = Number(input)
			if (isNaN(value)) {
				new Notice("Scheduling interval must be a number!")
				return [false, 0]
			}
		}
		return [true, value]
	}

	async display(): Promise<void> {
		let { containerEl } = this;
		this.note_types = await AnkiConnect.invoke('modelNames') as string[]
		this.fields_dict = await this.plugin.generateFieldsDict()

		containerEl.empty();
		containerEl.createEl('h2', { text: 'Obsidian_to_Anki' });

		// Default settings
		containerEl.createEl('h3', { text: "Defaults" })
		for (let key in this.plugin.settings.Defaults) {
			new Setting(containerEl)
				.setName(key)
				.setDesc(DEFAULT_SETTINGS[key as keyof PluginSettings["Defaults"]])
				.addText(text => text
					.setPlaceholder(String(this.plugin.settings.Defaults[key as keyof PluginSettings["Defaults"]]))
					.setValue(String(this.plugin.settings.Defaults[key as keyof PluginSettings["Defaults"]]))
					.onChange(async (value) => {
						const [valid, sanitised] = this.sanitise_input(key as keyof PluginSettings["Defaults"], value)
						if (valid) {
							(this.plugin.settings.Defaults as any)[key] = sanitised;
							await this.plugin.saveAllData()
						}
					})
				);
		}

		// Custom regexps
		containerEl.createEl('h3', { text: 'Custom Regexp' });
		if (this.plugin.settings.CUSTOM_REGEXPS) {
			for (let note_type of this.note_types) {
				new Setting(containerEl)
					.setName(note_type)
					.setDesc("Custom regexp for note type " + note_type)
					.addText(text => text
						.setPlaceholder(this.plugin.settings.CUSTOM_REGEXPS[note_type])
						.setValue(this.plugin.settings.CUSTOM_REGEXPS[note_type])
						.onChange(async (value) => {
							if (this.plugin.settings.CUSTOM_REGEXPS) {
								this.plugin.settings.CUSTOM_REGEXPS[note_type] = value
								await this.plugin.saveAllData()
							}
						})
					)
			}
		}

		// File link settings
		containerEl.createEl('h3', { text: 'File Link Settings' });
		if (this.plugin.settings.FILE_LINK_FIELDS) {
			for (let note_type of this.note_types) {
				new Setting(containerEl)
					.setName(note_type)
					.setDesc("Field to add file link to")
					.addDropdown(dropdown => {
						if (this.fields_dict[note_type]) {
							for (let field of this.fields_dict[note_type]) {
								dropdown.addOption(field, field)
							}
						}
						if (this.plugin.settings.FILE_LINK_FIELDS) {
							dropdown.setValue(this.plugin.settings.FILE_LINK_FIELDS[note_type])
						}
						dropdown.onChange(async (value) => {
							if (this.plugin.settings.FILE_LINK_FIELDS) {
								this.plugin.settings.FILE_LINK_FIELDS[note_type] = value
								await this.plugin.saveAllData()
							}
						})
					})
			}
		}

		// Context settings
		containerEl.createEl('h3', { text: 'Context Settings' });
		if (this.plugin.settings.CONTEXT_FIELDS) {
			for (let note_type of this.note_types) {
				new Setting(containerEl)
					.setName(note_type)
					.setDesc("Field to add context to")
					.addDropdown(dropdown => {
						if (this.fields_dict[note_type]) {
							for (let field of this.fields_dict[note_type]) {
								dropdown.addOption(field, field)
							}
						}
						if (this.plugin.settings.CONTEXT_FIELDS) {
							dropdown.setValue(this.plugin.settings.CONTEXT_FIELDS[note_type])
						}
						dropdown.onChange(async (value) => {
							if (this.plugin.settings.CONTEXT_FIELDS) {
								this.plugin.settings.CONTEXT_FIELDS[note_type] = value
								await this.plugin.saveAllData()
							}
						})
					})
			}
		}

		// Folder settings
		containerEl.createEl('h3', { text: 'Folder Settings' });
		new Setting(containerEl)
			.setName("Folder Deck")
			.setDesc("Deck to add notes from a folder to")
			.addButton(button => button
				.setButtonText("Add")
				.onClick(async () => {
					this.plugin.settings.FOLDER_DECKS[""] = ""
					this.display()
				})
			)
		if (this.plugin.settings.FOLDER_DECKS) {
			for (let key in this.plugin.settings.FOLDER_DECKS) {
				new Setting(containerEl)
					.setName("Folder path")
					.addText(text => text
						.setPlaceholder("folder/path")
						.setValue(key)
						.onChange(async (value) => {
							if (key in this.plugin.settings.FOLDER_DECKS) {
								const temp = this.plugin.settings.FOLDER_DECKS[key]
								delete this.plugin.settings.FOLDER_DECKS[key]
								this.plugin.settings.FOLDER_DECKS[value] = temp
							} else {
								this.plugin.settings.FOLDER_DECKS[value] = ""
							}
							await this.plugin.saveAllData()
						})
					)
					.addText(text => text
						.setPlaceholder("Deck")
						.setValue(this.plugin.settings.FOLDER_DECKS[key])
						.onChange(async (value) => {
							this.plugin.settings.FOLDER_DECKS[key] = value
							await this.plugin.saveAllData()
						})
					)
					.addButton(button => button
						.setButtonText("Remove")
						.onClick(async () => {
							delete this.plugin.settings.FOLDER_DECKS[key]
							this.display()
						})
					)
			}
		}
		new Setting(containerEl)
			.setName("Folder Tags")
			.setDesc("Tags to add to notes from a folder")
			.addButton(button => button
				.setButtonText("Add")
				.onClick(async () => {
					this.plugin.settings.FOLDER_TAGS[""] = ""
					this.display()
				})
			)
		if (this.plugin.settings.FOLDER_TAGS) {
			for (let key in this.plugin.settings.FOLDER_TAGS) {
				new Setting(containerEl)
					.setName("Folder path")
					.addText(text => text
						.setPlaceholder("folder/path")
						.setValue(key)
						.onChange(async (value) => {
							if (key in this.plugin.settings.FOLDER_TAGS) {
								const temp = this.plugin.settings.FOLDER_TAGS[key]
								delete this.plugin.settings.FOLDER_TAGS[key]
								this.plugin.settings.FOLDER_TAGS[value] = temp
							} else {
								this.plugin.settings.FOLDER_TAGS[value] = ""
							}
							await this.plugin.saveAllData()
						})
					)
					.addText(text => text
						.setPlaceholder("Tags")
						.setValue(this.plugin.settings.FOLDER_TAGS[key])
						.onChange(async (value) => {
							this.plugin.settings.FOLDER_TAGS[key] = value
							await this.plugin.saveAllData()
						})
					)
					.addButton(button => button
						.setButtonText("Remove")
						.onClick(async () => {
							delete this.plugin.settings.FOLDER_TAGS[key]
							this.display()
						})
					)
			}
		}


		// Ignored files
		containerEl.createEl('h3', { text: 'Ignored Files' });
		new Setting(containerEl)
			.setName("Ignored Files")
			.setDesc("A list of file paths to ignore, supports glob.")
			.addButton(button => button
				.setButtonText("Add")
				.onClick(async () => {
					this.plugin.settings.IGNORED_FILE_GLOBS.push("")
					this.display()
				})
			);

		this.plugin.settings.IGNORED_FILE_GLOBS.forEach((glob, index) => {
			const setting = new Setting(containerEl)
				.addText(text => text
					.setPlaceholder("**/templates/*")
					.setValue(glob)
					.onChange(async (value) => {
						this.plugin.settings.IGNORED_FILE_GLOBS[index] = value
						await this.plugin.saveAllData()
					})
				)
				.addButton(button => button
					.setButtonText("Remove")
					.onClick(async () => {
						this.plugin.settings.IGNORED_FILE_GLOBS.splice(index, 1)
						this.display()
					})
				);
		});

		new Setting(containerEl)
			.setName("Reset all settings")
			.setDesc("This will reset all settings to their default values.")
			.addButton(button => button
				.setButtonText("Reset")
				.onClick(async () => {
					await this.plugin.saveDefault()
					this.display()
				})
			);
	}
}
