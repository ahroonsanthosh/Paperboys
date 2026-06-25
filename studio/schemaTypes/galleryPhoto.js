export const galleryPhoto = {
  name: 'galleryPhoto',
  title: 'Gallery Photo',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for screen readers and SEO',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first in the gallery grid',
    },
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'caption', media: 'image'},
  },
}
