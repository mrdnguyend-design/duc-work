import rss from '@astrojs/rss';
import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '../site.config.mjs';
import { LANGS, parseEntryId, withBase, type Lang } from '../i18n/ui';
import { getPosts } from '../lib/content';

export const getStaticPaths: GetStaticPaths = () => LANGS.map((lang) => ({ params: { lang } }));

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as Lang;
  const posts = await getPosts(lang);

  return rss({
    title: `${SITE.name} — ${lang === 'vi' ? 'Bài viết' : 'Writing'}`,
    description:
      lang === 'vi'
        ? 'Retention marketing, vận hành ecommerce, và dữ liệu đằng sau.'
        : 'Retention marketing, ecommerce operations, and the data underneath.',
    site: site ?? SITE.url,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: withBase(`/${lang}/writing/${parseEntryId(entry.id).slug}/`),
    })),
    customData: `<language>${lang === 'vi' ? 'vi-vn' : 'en-us'}</language>`,
  });
};
