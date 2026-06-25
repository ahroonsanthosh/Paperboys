export const testimonial = {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
      rows: 4,
      validation: (R) => R.required(),
    },
    {
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      options: {list: [1, 2, 3, 4, 5]},
      validation: (R) => R.required().min(1).max(5),
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
  ],
  orderings: [
    {title: 'Sort Order', name: 'sortOrderAsc', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'reviewText'},
  },
}
