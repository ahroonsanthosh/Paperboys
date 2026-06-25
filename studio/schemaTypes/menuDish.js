export const menuDish = {
  name: 'menuDish',
  title: 'Menu Dish',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Breakfast', value: 'breakfast'},
          {title: 'Sandwiches', value: 'sandwiches'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'name',
      title: 'Dish Name',
      type: 'string',
    },
    {
      name: 'allergens',
      title: 'Allergen Numbers',
      type: 'string',
      description: 'Comma-separated numbers, e.g. 1,3,7',
    },
    {
      name: 'price',
      title: 'Price (€)',
      type: 'number',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first within their category',
    },
  ],
  orderings: [
    {
      title: 'Category, then Sort Order',
      name: 'categorySort',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'sortOrder', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', price: 'price'},
    prepare({title, subtitle, price}) {
      return {
        title,
        subtitle: `${subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : ''} — €${price ?? ''}`,
      }
    },
  },
}
