import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes/index.js'

const SINGLETONS = ['siteSettings', 'openingHours', 'storySection', 'menuSettings']

const singletonListItem = (S, type) =>
  S.listItem()
    .title(type === 'siteSettings' ? 'Site Settings'
      : type === 'openingHours' ? 'Opening Hours'
      : type === 'storySection' ? 'Story & Ticker'
      : 'Menu Settings (sides, drinks, allergens)')
    .id(type)
    .child(S.document().schemaType(type).documentId(type))

export default defineConfig({
  name: 'paperboys',
  title: 'Paperboys Studio',

  projectId: 'REPLACE_WITH_PROJECT_ID',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.divider(),
            ...SINGLETONS.map((t) => singletonListItem(S, t)),
            S.divider(),
            S.documentTypeListItem('menuDish').title('Menu Dishes'),
            S.documentTypeListItem('galleryPhoto').title('Gallery Photos'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
