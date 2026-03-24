import { RELEASES_FALLBACK_URL } from './site';

export interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface GitHubRelease {
  tag_name?: string;
  assets?: GitHubReleaseAsset[];
}

export interface ReleaseDownloadLinks {
  windows: string;
  macAppleSilicon: string;
  macIntel: string;
  macArchive: string;
  linuxAppImage: string;
  linuxDeb: string;
  linuxRpm: string;
}

export function formatReleaseVersion(tagName?: string): string {
  return (tagName ?? '').replace(/^v/i, '');
}

export function findReleaseAsset(assets: GitHubReleaseAsset[], pattern: RegExp): string | null {
  for (const asset of assets) {
    if (pattern.test(asset.name)) return asset.browser_download_url;
  }

  return null;
}

export function buildReleaseDownloadLinks(
  release: GitHubRelease,
  fallbackUrl = RELEASES_FALLBACK_URL,
): ReleaseDownloadLinks {
  const assets = release.assets ?? [];
  const universalMacUrl = findReleaseAsset(assets, /universal\.app\.tar\.gz$/i) ?? fallbackUrl;

  return {
    windows: findReleaseAsset(assets, /x64-setup\.exe$/i) ?? fallbackUrl,
    macAppleSilicon: universalMacUrl,
    macIntel: universalMacUrl,
    macArchive: universalMacUrl,
    linuxAppImage: findReleaseAsset(assets, /amd64\.AppImage$/i) ?? fallbackUrl,
    linuxDeb: findReleaseAsset(assets, /amd64\.deb$/i) ?? fallbackUrl,
    linuxRpm: findReleaseAsset(assets, /x86_64\.rpm$/i) ?? fallbackUrl,
  };
}
