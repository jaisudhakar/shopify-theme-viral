/* ============================================================
   BRAND CONFIG — change this file (and the colours/fonts at the top of base.css)
   to re-skin the whole site for another client.
   ============================================================ */
window.BRAND = {
  name: 'NIKE',
  logo: 'assets/img/logo.svg',            // set to '' to show `name` as a text wordmark
  storeUrl: 'https://nike-makknzjs.myshopify.com',
  currency: 'USD',

  // top utility bar (right side)
  utility: [
    { label: 'Find a Store', href: 'contact.html#visit' },
    { label: 'Help', href: 'contact.html#faq' },
    { label: 'Join Us', href: 'index.html#join' },
    { label: 'Sign In', href: 'https://nike-makknzjs.myshopify.com/account/login' }
  ],

  // main navigation
  nav: [
    { label: 'Home', href: 'index.html' },
    { label: 'Shop', href: 'shop.html' },
    { label: 'Nike Orbit', href: 'index.html#nike-orbit' },
    { label: 'Hand Rail Pro', href: 'index.html#hang-rail-pro' },
    { label: 'About', href: 'about.html' },
    { label: 'Contact', href: 'contact.html' }
  ],

  // words in the scrolling strips
  marquee: ['New collection', 'Premium streetwear', 'Nike Orbit', 'Hang Rail Pro', 'Made to last'],

  // contact details (placeholders — replace per client)
  contact: {
    email: 'hello@yourbrand.com',
    phone: '+1 (000) 000-0000',
    address: '123 Your Street, Your City',
    hours: 'Mon–Sat, 10:00–19:00'
  },

  social: [
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'TikTok', href: '#', icon: 'tiktok' },
    { label: 'YouTube', href: '#', icon: 'youtube' }
  ],

  footer: [
    { title: 'Shop', links: [
      { label: 'All products', href: 'shop.html' },
      { label: 'Hoodies', href: 'shop.html?c=hoodies' },
      { label: 'Outerwear', href: 'shop.html?c=outerwear' },
      { label: 'Sneakers', href: 'shop.html?c=sneakers' }
    ] },
    { title: 'Explore', links: [
      { label: 'Nike Orbit', href: 'index.html#nike-orbit' },
      { label: 'Hang Rail Pro', href: 'index.html#hang-rail-pro' },
      { label: 'About us', href: 'about.html' }
    ] },
    { title: 'Help', links: [
      { label: 'Contact', href: 'contact.html' },
      { label: 'FAQ', href: 'contact.html#faq' },
      { label: 'Find a store', href: 'contact.html#visit' }
    ] }
  ],

  newsletter: {
    title: 'Join the club',
    text: 'Be first to know about new drops, restocks and members-only releases.'
  }
};
