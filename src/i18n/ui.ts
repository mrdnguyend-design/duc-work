export const LANGS = ['en', 'vi'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const langNames: Record<Lang, string> = { en: 'English', vi: 'Tiếng Việt' };

export const ui = {
  en: {
    'nav.writing': 'Writing',
    'nav.cases': 'Case studies',
    'nav.work': 'Work with me',
    'nav.about': 'About',
    'home.readMore': 'Read the writing',
    'home.latest': 'Latest writing',
    'home.selectedWork': 'Selected work',
    'home.viewAll': 'View all',
    'writing.title': 'Writing',
    'writing.empty': 'No posts published yet.',
    'cases.title': 'Case studies',
    'cases.empty': 'No case studies published yet.',
    'cases.outcome': 'Outcome',
    'cases.role': 'Role',
    'cases.period': 'Period',
    'cases.stack': 'Stack',
    'work.title': 'Work with me',
    'about.title': 'About',
    'post.published': 'Published',
    'post.updated': 'Updated',
    'post.backToWriting': 'All writing',
    'lang.switch': 'Tiếng Việt',
    'lang.notAvailable': 'This page is only available in English.',
    'footer.rights': 'All rights reserved.',
    'cta.book': 'Book a call',
    'cta.email': 'Email me',
    '404.title': 'Page not found',
    '404.body': 'That page does not exist. Try the writing index.',
  },
  vi: {
    'nav.writing': 'Bài viết',
    'nav.cases': 'Case study',
    'nav.work': 'Hợp tác',
    'nav.about': 'Giới thiệu',
    'home.readMore': 'Đọc bài viết',
    'home.latest': 'Bài mới nhất',
    'home.selectedWork': 'Việc đã làm',
    'home.viewAll': 'Xem tất cả',
    'writing.title': 'Bài viết',
    'writing.empty': 'Chưa có bài nào.',
    'cases.title': 'Case study',
    'cases.empty': 'Chưa có case study nào.',
    'cases.outcome': 'Kết quả',
    'cases.role': 'Vai trò',
    'cases.period': 'Thời gian',
    'cases.stack': 'Công cụ',
    'work.title': 'Hợp tác',
    'about.title': 'Giới thiệu',
    'post.published': 'Đăng ngày',
    'post.updated': 'Cập nhật',
    'post.backToWriting': 'Tất cả bài viết',
    'lang.switch': 'English',
    'lang.notAvailable': 'Trang này chỉ có bản tiếng Anh.',
    'footer.rights': 'Bảo lưu mọi quyền.',
    'cta.book': 'Đặt lịch trao đổi',
    'cta.email': 'Gửi email',
    '404.title': 'Không tìm thấy trang',
    '404.body': 'Trang này không tồn tại. Thử xem mục bài viết.',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

export function useT(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui[DEFAULT_LANG][key];
}

/** Site base path, normalized without a trailing slash ('' when deployed at root). */
export const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** Prefix an absolute in-site path with the deploy base. */
export function withBase(path: string): string {
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Suffix appended to page links ('.html' for flat-file preview builds, '' normally).
 * Assets (sitemap, RSS) never take it — use withBase() directly for those.
 */
export const LINK_SUFFIX = import.meta.env.PUBLIC_LINK_SUFFIX ?? '';

/**
 * Build a localized page link. Directory builds keep the trailing slash so links
 * match the canonical URL exactly; flat-file preview builds take '.html' instead.
 */
export function localePath(lang: Lang, path = '/'): string {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  return withBase(`/${lang}${clean}${LINK_SUFFIX || '/'}`);
}

/** Build a non-localized page link with the same suffix rules. */
export function pagePath(path: string): string {
  return withBase(`${path.replace(/\/+$/, '')}${LINK_SUFFIX || '/'}`);
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'vi' : 'en';
}

/** Content entry ids look like "en/my-post" — split into lang + slug. */
export function parseEntryId(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
