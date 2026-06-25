export const aboutSection = {
  name: 'aboutSection',
  title: 'About Section',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'bodyText',
      title: 'Body Text',
      type: 'text',
      rows: 6,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    },
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
  },
}
