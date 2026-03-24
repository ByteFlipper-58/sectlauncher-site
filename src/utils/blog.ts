import type { CollectionEntry } from 'astro:content';
import type { SupportedLocale } from './site';

export type BlogPost = CollectionEntry<'blog'>;

export interface BlogQueryOptions {
  isProduction: boolean;
  now?: number;
}

function getPublishTimestamp(post: BlogPost): number | undefined {
  return post.data.publishAt ? new Date(post.data.publishAt).getTime() : undefined;
}

export function getPostLocale(post: BlogPost): SupportedLocale {
  return post.data.lang ?? 'ru';
}

export function getPostSlugBase(post: BlogPost): string {
  return post.slug.split('/').pop() ?? post.slug;
}

export function isPremiereLocked(post: BlogPost, now = Date.now()): boolean {
  const publishTimestamp = getPublishTimestamp(post);
  return !!post.data.premiere && publishTimestamp !== undefined && publishTimestamp > now;
}

export function isVisibleBlogPost(post: BlogPost, locale: SupportedLocale, options: BlogQueryOptions): boolean {
  if (getPostLocale(post) !== locale) return false;
  if (post.data.draft) return false;
  if (!options.isProduction) return true;
  if (post.data.private) return false;

  const publishTimestamp = getPublishTimestamp(post);
  if (publishTimestamp && publishTimestamp > (options.now ?? Date.now())) {
    return !!post.data.premiere;
  }

  return true;
}

export function sortBlogPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

export function getVisibleBlogPosts(
  posts: BlogPost[],
  locale: SupportedLocale,
  options: BlogQueryOptions,
): BlogPost[] {
  return sortBlogPosts(posts.filter((post) => isVisibleBlogPost(post, locale, options)));
}

export function getAlternateBlogPost(
  posts: BlogPost[],
  post: BlogPost,
  targetLocale: SupportedLocale,
  options: BlogQueryOptions,
): BlogPost | undefined {
  if (!post.data.tKey) return undefined;

  return posts.find(
    (candidate) =>
      candidate.id !== post.id &&
      candidate.data.tKey === post.data.tKey &&
      isVisibleBlogPost(candidate, targetLocale, options),
  );
}

export function getAdjacentBlogPosts(
  posts: BlogPost[],
  post: BlogPost,
  locale: SupportedLocale,
  options: BlogQueryOptions,
): { prev?: BlogPost; next?: BlogPost } {
  const visiblePosts = getVisibleBlogPosts(posts, locale, options);
  const currentSlug = getPostSlugBase(post);
  const index = visiblePosts.findIndex((candidate) => getPostSlugBase(candidate) === currentSlug);

  return {
    prev: index > 0 ? visiblePosts[index - 1] : undefined,
    next: index >= 0 && index < visiblePosts.length - 1 ? visiblePosts[index + 1] : undefined,
  };
}

export function getBlogPostPath(locale: SupportedLocale, postOrSlug: BlogPost | string): string {
  const slug = typeof postOrSlug === 'string' ? postOrSlug : getPostSlugBase(postOrSlug);
  return `/${locale}/blog/${slug}`;
}
