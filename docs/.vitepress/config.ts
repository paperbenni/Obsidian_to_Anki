import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Obsidian to Anki",
  description: "a plugin to sync obsidian notes to an anki deck",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Setup', link: '/Setup.md' },
          { text: 'Usage', link: '/Usage.md' },
          { text: 'Steps for new users', link: '/Steps-for-new-users.md' }
        ]
      },
      {
        text: 'Note Formatting',
        items: [
          { text: 'Note formatting', link: '/Note formatting.md' },
          { text: 'Cloze formatting', link: '/Cloze-formatting.md' },
          { text: 'Audio formatting', link: '/Audio-formatting.md' },
          { text: 'Deck formatting', link: '/Deck-formatting.md' },
          { text: 'Field formatting', link: '/Field-formatting.md' },
          { text: 'Frozen Fields', link: '/Frozen-Fields.md' },
          { text: 'Image formatting', link: '/Image-formatting.md' },
          { text: 'Inline notes', link: '/Inline-notes.md' },
          { text: 'Markdown formatting', link: '/Markdown formatting.md' },
          { text: 'Math formatting', link: '/Math formatting.md' },
          { text: 'Tag formatting', link: '/Tag-formatting.md' }
        ]
      },
      {
        text: 'Note Styles',
        items: [
          { text: 'Cloze Paragraph style', link: '/Cloze-Paragraph-style.md' },
          { text: 'Header paragraph style', link: '/Header-paragraph-style.md' },
          { text: 'Markdown table style', link: '/Markdown table style.md' },
          { text: 'Neuracache flashcard style', link: '/Neuracache-flashcard-style.md' },
          { text: 'Question answer style', link: '/Question-answer-style.md' },
          { text: 'RemNote single-line style', link: '/RemNote single-line style.md' },
          { text: 'Ruled style', link: '/Ruled-style.md' }
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Config', link: '/Config.md' },
          { text: 'Data file', link: '/Data-file.md' },
          { text: 'Deleting notes', link: '/Deleting-notes.md' },
          { text: 'Folder settings', link: '/Folder-settings.md' },
          { text: 'Obsidian Integration', link: '/Obsidian-Integration.md' },
          { text: 'Permissions', link: '/Permissions.md' },
          { text: 'Regex', link: '/Regex.md' },
          { text: 'Technical', link: '/Technical.md' },
          { text: 'Troubleshooting', link: '/Troubleshooting.md' },
          { text: 'Updating existing notes', link: '/Updating existing notes.md' }
        ]
      }
    ]
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})
