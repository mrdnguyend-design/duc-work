// The only file you need to edit to rebrand the whole site.
export const SITE = {
  url: 'https://duc.work',
  /** Brand shown in the header, page titles and og:site_name. */
  name: 'Duc @ Work',
  /**
   * Real person name for the schema.org Person block. Search engines expect a
   * human name here, not a brand, so it is kept separate from `name`.
   */
  personName: 'Duc',
  email: 'contact@duc.work',
  /** Empty values are omitted from the footer — add a URL to show the link. */
  socials: {
    x: '',
    linkedin: '',
    github: '',
  },
  // Where "Book a call" points. Leave empty to render a mailto: link instead.
  bookingUrl: '',
};

export const LANGS = /** @type {const} */ (['en', 'vi']);
export const DEFAULT_LANG = 'en';
