# Obsidian to Anki Plugin

## Project Overview

This project is an Obsidian plugin that allows users to export their notes to Anki, a popular spaced repetition flashcard program. The plugin is written in TypeScript and can also be used as a standalone Python script. It supports custom syntax for flashcards, allowing users to define their own note formats using regular expressions.

The plugin works by scanning the user's Obsidian vault for notes that contain flashcard syntax. It then parses these notes and sends them to Anki using the AnkiConnect addon. The plugin also supports updating existing notes in Anki, as well as deleting notes that have been removed from Obsidian.

## Building and Running

The project is built using Rollup. The following commands are available in `package.json`:

*   `npm run dev`: Builds the plugin in development mode and watches for changes.
*   `npm run build`: Builds the plugin for production.
*   `npm test`: Runs the end-to-end tests using WebdriverIO and the Python tests using pytest.

To build the plugin, you will need to have Node.js and npm installed. You will also need to install the dependencies listed in `package.json` by running `npm install`.

## Development Conventions

The project uses TypeScript for all of its code. The code is organized into several modules, each of which is responsible for a specific part of the plugin's functionality.

The main entry point for the plugin is `main.ts`. This file is responsible for loading the plugin's settings, registering the plugin's UI elements, and coordinating the overall process of scanning the user's vault and sending notes to Anki.

The core logic for processing files is contained in `src/files-manager.ts`. This module is responsible for finding files that are not ignored, generating `AllFile` objects for each file, and then sending requests to Anki to add, update, and delete notes.

The plugin uses the `AnkiConnect` addon to communicate with Anki. The `src/anki.ts` module provides a wrapper around the AnkiConnect API, making it easy to send requests to Anki and parse the responses.
