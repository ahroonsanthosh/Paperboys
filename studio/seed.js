/**
 * Seed script — populates the Sanity dataset with the current Paperboys content.
 *
 * Run AFTER `sanity login` and project creation:
 *   node seed.js
 *
 * The script is idempotent: it uses createOrReplace so re-running it is safe.
 */

import {createClient} from '@sanity/client'
import {readFileSync} from 'fs'
import {homedir} from 'os'
import {join} from 'path'

const PROJECT_ID = 'kbi1x7f8'

function readProjectId() {
  try {
    const env = readFileSync('.env', 'utf8')
    const match = env.match(/SANITY_STUDIO_PROJECT_ID\s*=\s*(\S+)/)
    if (match) return match[1]
  } catch {}
  return PROJECT_ID
}

function readSanityToken() {
  if (process.env.SANITY_TOKEN) return process.env.SANITY_TOKEN
  // Try locations where `sanity login` stores credentials
  const candidates = [
    join(homedir(), '.config', 'sanity', 'auth.json'),
    join(homedir(), '.sanity', 'auth.json'),
    join(homedir(), 'AppData', 'Roaming', 'sanity', 'auth.json'),
  ]
  for (const p of candidates) {
    try {
      const data = JSON.parse(readFileSync(p, 'utf8'))
      if (data.token) return data.token
    } catch {}
  }
  return null
}

const projectId = readProjectId()
const token = readSanityToken()

if (!token) {
  console.error('No Sanity auth token found. Run `npx sanity login` first, then re-run this script.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// ---------------------------------------------------------------------------
// Seed data — mirrors every hardcoded value from index.html
// ---------------------------------------------------------------------------

const SITE_SETTINGS = {
  _id:              'siteSettings',
  _type:            'siteSettings',
  businessName:     'Paperboys',
  streetAddress:    'Tobin Street, City Centre',
  locality:         'Cork, Ireland',
  instagramHandle:  '@paperboys_cork',
  instagramUrl:     'https://www.instagram.com/paperboys_cork',
  googleMapsUrl:    'https://www.google.com/maps?q=Tobin%20Street%2C%20Cork%2C%20Ireland&output=embed',
  directionsUrl:    'https://www.google.com/maps/search/?api=1&query=Paperboys+Tobin+Street+Cork',
  heroEyebrow:      'Tobin Street · Cork City · Open daily 10–4',
}

const OPENING_HOURS = {
  _id:   'openingHours',
  _type: 'openingHours',
  days: [
    {_key: 'mon', dayName: 'Monday',    opens: '10:00', closes: '16:00', closed: false},
    {_key: 'tue', dayName: 'Tuesday',   opens: '10:00', closes: '16:00', closed: false},
    {_key: 'wed', dayName: 'Wednesday', opens: '10:00', closes: '16:00', closed: false},
    {_key: 'thu', dayName: 'Thursday',  opens: '10:00', closes: '16:00', closed: false},
    {_key: 'fri', dayName: 'Friday',    opens: '10:00', closes: '16:00', closed: false},
    {_key: 'sat', dayName: 'Saturday',  opens: '10:00', closes: '16:00', closed: false},
    {_key: 'sun', dayName: 'Sunday',    opens: '10:00', closes: '16:00', closed: false},
  ],
}

const STORY_SECTION = {
  _id:   'storySection',
  _type: 'storySection',
  heading:    'A neighbourhood brunch room with a bit of mischief.',
  paragraph1: 'Tucked onto Tobin Street, Paperboys is small, warm and unmistakably Cork. We keep the menu tight and the coffee serious — the kind of room you slip into on a slow morning and lose an hour in.',
  paragraph2: 'No fuss, no pretence. Just good plates, good people, and our two paperboys keeping an eye on the place.',
  storefrontQuote: '"Two faces over the door, and the best reason to leave the house before noon."',
  tickerWords: ['Sourdough', 'Flat Whites', 'Brunch Daily', 'Cork City'],
}

const MENU_SETTINGS = {
  _id:   'menuSettings',
  _type: 'menuSettings',
  introText:   'Served all day. Allergen numbers in brackets — full key at the foot of the list.',
  allergenKey: 'Allergens — 1 Gluten · 2 Crustaceans · 3 Eggs · 4 Fish · 5 Peanuts · 6 Soy · 7 Milk · 8 Nuts · 9 Celery · 10 Mustard · 11 Sesame · 12 Sulphites · 13 Lupin · 14 Molluscs.',
  sides: [
    {_key: 's1', name: 'Avo',                price: 4.50},
    {_key: 's2', name: 'Bacon',              price: 4.50},
    {_key: 's3', name: 'Black Pudding',      price: 4.50},
    {_key: 's4', name: 'Halloumi',           price: 4.50},
    {_key: 's5', name: 'Fries',              price: 4.50},
    {_key: 's6', name: 'Sourdough or Brioche', price: 2.50},
  ],
  drinks: [
    {_key: 'd1',  name: 'Espresso / Doppio',  price: 3},
    {_key: 'd2',  name: 'Americano',           price: 3.30},
    {_key: 'd3',  name: 'Flat White',          price: 3.50},
    {_key: 'd4',  name: 'Cappuccino',          price: 3.50},
    {_key: 'd5',  name: 'Latte',               price: 3.50},
    {_key: 'd6',  name: 'Dirty Chai',          price: 4},
    {_key: 'd7',  name: 'Mocha',               price: 3.60},
    {_key: 'd8',  name: 'Masala Chai',         price: 3.70},
    {_key: 'd9',  name: 'Hot Choc',            price: 3.50},
    {_key: 'd10', name: 'Tea',                 price: 2},
    {_key: 'd11', name: 'OJ',                  price: 2.50},
    {_key: 'd12', name: 'Rose Lemonade',       price: 4.50},
    {_key: 'd13', name: 'Mimosa',              price: 9},
    {_key: 'd14', name: 'Hugo Spritz',         price: 11},
    {_key: 'd15', name: 'Aperol Spritz',       price: 11},
    {_key: 'd16', name: 'Beamish',             price: 5.20},
    {_key: 'd17', name: 'Heineken',            price: 6.20},
    {_key: 'd18', name: 'Orchard Thieves',     price: 6.20},
    {_key: 'd19', name: 'Cab Sav (G)',         price: 8},
    {_key: 'd20', name: 'Sav Blanc (G)',       price: 8},
  ],
}

const MENU_DISHES = [
  {
    _id: 'dish-halloumi-florentine', _type: 'menuDish',
    category: 'breakfast', sortOrder: 1,
    name: 'Halloumi Florentine', allergens: '1,3,7', price: 14.50,
    description: 'Brioche, halloumi, sautéed spinach, balsamic tomato compot, poached eggs. Add avo / crispy bacon.',
  },
  {
    _id: 'dish-revised-morning-issue', _type: 'menuDish',
    category: 'breakfast', sortOrder: 2,
    name: 'The Revised Morning Issue', allergens: '1,3,7', price: 14.50,
    description: 'Signature hash browns, black pudding hash, hollandaise, poached eggs. Add crispy bacon / avo.',
  },
  {
    _id: 'dish-benny-boru', _type: 'menuDish',
    category: 'breakfast', sortOrder: 3,
    name: 'Benny Boru', allergens: '1,3,7,10', price: 15,
    description: 'Brioche, honey-glazed ham, hollandaise, poached eggs. Add crispy bacon / black pudding.',
  },
  {
    _id: 'dish-avo-smash', _type: 'menuDish',
    category: 'breakfast', sortOrder: 4,
    name: 'Avo… Smash!', allergens: '1,3,7,8', price: 14.50,
    description: 'Sourdough or brioche, smashed avo, crispy chilli & peanut ryu, poached eggs. Add halloumi / crispy bacon.',
  },
  {
    _id: 'dish-ham-2-cheeses', _type: 'menuDish',
    category: 'sandwiches', sortOrder: 1,
    name: "The Ham 'n 2 Cheeses", allergens: '1,7,10', price: 12,
    description: 'Honey-mustard glazed ham, 2-cheese sauce, smoked cheddar & emmentaler. Add fries.',
  },
  {
    _id: 'dish-muthah-cluckah', _type: 'menuDish',
    category: 'sandwiches', sortOrder: 2,
    name: 'The Muthah Cluckah', allergens: '1,3,6,7,10', price: 13.50,
    description: 'Crispy battered buttermilk & hot-sauce marinated chicken, pickles, lettuce, hot ranch sauce. Add fries / crispy bacon.',
  },
  {
    _id: 'dish-banh-mi', _type: 'menuDish',
    category: 'sandwiches', sortOrder: 3,
    name: 'The Banh Mi', allergens: '1,3,4,10', price: 12.50,
    description: 'Vietnamese pork belly, pickled daikon & carrot, chilli, coriander, vietnamayo, baguette. Veg sub: crispy garlic chilli tofu.',
  },
  {
    _id: 'dish-melt', _type: 'menuDish',
    category: 'sandwiches', sortOrder: 4,
    name: 'The Melt', allergens: '1,7,10', price: 12,
    description: 'Roast peppers, mushroom, caramelised onion, 2-cheese sauce, smoked cheddar, emmentaler. Add fries.',
  },
]

// Gallery photos: images must be uploaded manually via Studio
// (the local .webp files can't be uploaded by this script without binary upload support)
// Placeholders are created so the documents exist and captions/alt text are pre-filled.
// Open each gallery photo in Studio and upload the matching image from assets/.
const GALLERY_PHOTOS = [
  {_id: 'gallery-counter',    _type: 'galleryPhoto', sortOrder: 1, caption: 'The counter',      alt: 'Inside Paperboys — the counter, hanging glassware and coffee board under slatted timber'},
  {_id: 'gallery-on-plate',   _type: 'galleryPhoto', sortOrder: 2, caption: 'On the plate',     alt: 'Two brunch plates — buttermilk fried chicken with French toast, and grilled halloumi with flatbread'},
  {_id: 'gallery-coffee',     _type: 'galleryPhoto', sortOrder: 3, caption: 'Coffee, all day',  alt: 'A flat white with latte art'},
  {_id: 'gallery-tostadas',   _type: 'galleryPhoto', sortOrder: 4, caption: 'Egg tostadas',     alt: 'Egg tostadas topped with micro-herbs and salsa'},
  {_id: 'gallery-prawn',      _type: 'galleryPhoto', sortOrder: 5, caption: 'Prawn baguette',   alt: 'Prawn baguette with seasoned fries'},
]

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function seed() {
  const docs = [
    SITE_SETTINGS,
    OPENING_HOURS,
    STORY_SECTION,
    MENU_SETTINGS,
    ...MENU_DISHES,
    ...GALLERY_PHOTOS,
  ]

  console.log(`Seeding ${docs.length} documents into project "${projectId}" / dataset "production"…\n`)

  for (const doc of docs) {
    try {
      await client.createOrReplace(doc)
      console.log(`  ✓  ${doc._type}  ${doc._id}`)
    } catch (err) {
      console.error(`  ✗  ${doc._type}  ${doc._id}  —  ${err.message}`)
    }
  }

  console.log('\nDone. Open Studio and upload images for the 5 gallery photo documents.')
  console.log('Also upload the storefront image in Story & Ticker → Storefront Image.')
}

seed()
