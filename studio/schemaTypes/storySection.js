export const storySection = {
  name: 'storySection',
  title: 'Story & Ticker',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'heading',
      title: 'Story Heading',
      type: 'string',
    },
    {
      name: 'paragraph1',
      title: 'Paragraph 1',
      type: 'text',
      rows: 4,
    },
    {
      name: 'paragraph2',
      title: 'Paragraph 2',
      type: 'text',
      rows: 4,
    },
    {
      name: 'storefrontImage',
      title: 'Storefront Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'storefrontQuote',
      title: 'Storefront Quote',
      type: 'string',
      description: 'Caption below the storefront image',
    },
    {
      name: 'tickerWords',
      title: 'Ticker Words',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Words that scroll across the ticker strip',
    },
  ],
  preview: {
    prepare() {
      return {title: 'Story & Ticker'}
    },
  },
}
