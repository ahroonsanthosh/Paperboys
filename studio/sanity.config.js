import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes/index.js'

const SINGLETONS = new Set(['siteSettings', 'homepage', 'aboutSection', 'openingHours', 'storySection', 'menuSettings'])

const SINGLETON_TITLES = {
  siteSettings:  'Site Settings',
  homepage:      'Homepage',
  aboutSection:  'About Section',
  openingHours:  'Opening Hours',
  storySection:  'Story & Ticker',
  menuSettings:  'Menu Settings (sides, drinks, allergens)',
}

const singletonListItem = (S, type) =>
  S.listItem()
    .title(SINGLETON_TITLES[type] || type)
    .id(type)
    .child(S.document().schemaType(type).documentId(type))

export default defineConfig({
  name: 'paperboys',
  title: 'Paperboys Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'kbi1x7f8',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.divider(),
            ...[...SINGLETONS].map((t) => singletonListItem(S, t)),
            S.divider(),
            S.documentTypeListItem('menuCategory').title('Menu Categories'),
            S.documentTypeListItem('menuDish').title('Menu Dishes'),
            S.documentTypeListItem('galleryPhoto').title('Gallery Photos'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.documentTypeListItem('faqItem').title('FAQ'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  // Prevent editors from creating extra copies of singleton documents
  // or accidentally deleting them.
  document: {
    actions: (prev, {schemaType}) => {
      if (SINGLETONS.has(schemaType)) {
        return prev.filter(({action}) => action === 'publish' || action === 'discardChanges')
      }
      return prev
    },
  },
})
