export const menuSettings = {
  name: 'menuSettings',
  title: 'Menu Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'introText',
      title: 'Menu Intro Text',
      type: 'string',
      description: 'Line shown below the "The menu" heading',
    },
    {
      name: 'allergenKey',
      title: 'Allergen Key',
      type: 'text',
      rows: 3,
      description: 'Full allergen key shown at the bottom of the menu',
    },
    {
      name: 'sides',
      title: 'Sides & Add-ons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'price', title: 'Price (€)', type: 'number'},
          ],
          preview: {
            select: {title: 'name', subtitle: 'price'},
            prepare({title, subtitle}) {
              return {title, subtitle: subtitle != null ? `€${subtitle.toFixed(2)}` : ''}
            },
          },
        },
      ],
    },
    {
      name: 'drinks',
      title: 'Drinks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'price', title: 'Price (€)', type: 'number'},
          ],
          preview: {
            select: {title: 'name', subtitle: 'price'},
            prepare({title, subtitle}) {
              return {title, subtitle: subtitle != null ? `€${subtitle.toFixed(2)}` : ''}
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {title: 'Menu Settings'}
    },
  },
}
