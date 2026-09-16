import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { parseEntryId, withBase, LINK_SUFFIX, type Lang } from '../i18n/ui';

const isPublished = (entry: { data: { draft?: boolean } }) =>
  import.meta.env.DEV || !entry.data.draft;

export async function getPosts(lang: Lang): Promise<CollectionEntry<'posts'>[]> {
  const all = await getCollection('posts', isPublished);
  return all
    .filter((entry) => parseEntryId(entry.id).lang === lang)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getCases(lang: Lang): Promise<CollectionEntry<'cases'>[]> {
  const all = await getCollection('cases', isPublished);
  return all
    .filter((entry) => parseEntryId(entry.id).lang === lang)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getPage(lang: Lang, slug: string) {
  return getEntry('pages', `${lang}/${slug}`);
}

/**
 * Resolve the path of the sibling translation for a content entry.
 * Falls back to the other language's section index when no translation exists.
 */
export function translationPath(
  entry: { id: string; data: { translationOf?: string } },
  section: string,
): string {
  const { lang, slug } = parseEntryId(entry.id);
  const other: Lang = lang === 'en' ? 'vi' : 'en';
  const target = entry.data.translationOf ?? slug;
  return withBase(`/${other}${section}/${target}${LINK_SUFFIX || '/'}`);
}
