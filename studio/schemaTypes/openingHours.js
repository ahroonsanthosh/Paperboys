export const openingHours = {
  name: 'openingHours',
  title: 'Opening Hours',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'days',
      title: 'Days',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'dayName', title: 'Day', type: 'string'},
            {name: 'opens', title: 'Opens', type: 'string', description: 'e.g. 10:00'},
            {name: 'closes', title: 'Closes', type: 'string', description: 'e.g. 16:00'},
            {name: 'closed', title: 'Closed today', type: 'boolean', initialValue: false},
          ],
          preview: {
            select: {title: 'dayName', subtitle: 'opens'},
            prepare({title, subtitle}) {
              return {title, subtitle: subtitle ? `Opens ${subtitle}` : 'Closed'}
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {title: 'Opening Hours'}
    },
  },
}
