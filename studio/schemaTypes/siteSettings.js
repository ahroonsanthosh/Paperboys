export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
    },
    {
      name: 'streetAddress',
      title: 'Street Address',
      type: 'string',
    },
    {
      name: 'locality',
      title: 'City / Locality',
      type: 'string',
    },
    {
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'e.g. @paperboys_cork',
    },
    {
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    },
    {
      name: 'googleMapsUrl',
      title: 'Google Maps Embed URL',
      type: 'url',
      description: 'The iframe src URL for the embedded map',
    },
    {
      name: 'directionsUrl',
      title: 'Directions URL',
      type: 'url',
      description: 'The "Get directions" link (google.com/maps/search URL)',
    },
    {
      name: 'heroEyebrow',
      title: 'Hero Eyebrow Text',
      type: 'string',
      description: 'Small line above the main heading, e.g. "Tobin Street · Cork City · Open daily 10–4"',
    },
  ],
  preview: {
    select: { title: 'businessName' },
  },
}
