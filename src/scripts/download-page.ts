import { RELEASES_API_URL, RELEASES_FALLBACK_URL } from '../utils/site';
import { buildReleaseDownloadLinks, formatReleaseVersion, type GitHubRelease } from '../utils/releases';

function setLink(id: string, url: string): void {
  const link = document.getElementById(id) as HTMLAnchorElement | null;
  if (link) link.href = url;
}

function setupDropdowns(): void {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const dropdownButton = target?.closest<HTMLElement>('[data-dropdown-btn]');
    const openMenu = document.querySelector<HTMLElement>('[data-dropdown-menu]:not(.hidden)');

    if (dropdownButton) {
      const type = dropdownButton.getAttribute('data-dropdown-btn');
      const menu = type ? document.querySelector<HTMLElement>(`[data-dropdown-menu="${type}"]`) : null;

      if (menu) {
        menu.classList.toggle('hidden');
        if (openMenu && openMenu !== menu) openMenu.classList.add('hidden');
      }

      return;
    }

    if (openMenu && !target?.closest('[data-dropdown-menu]')) {
      openMenu.classList.add('hidden');
    }
  });
}

function setupDownloadTracking(): void {
  document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement | null;
    const downloadButton = target?.closest<HTMLAnchorElement>('[data-download-platform]');
    if (!downloadButton) return;

    try {
      const { trackDownload } = await import('../utils/analytics');
      const platform = downloadButton.dataset.downloadPlatform ?? 'unknown';
      const version = downloadButton.dataset.downloadVersion;
      await trackDownload(platform, version);
    } catch {}
  });
}

async function hydrateReleaseLinks(): Promise<void> {
  const versionElement = document.getElementById('version-display');
  const fallbackVersionLabel = versionElement?.getAttribute('data-version-fallback-label') ?? 'Latest';

  try {
    const response = await fetch(RELEASES_API_URL);
    if (!response.ok) throw new Error('Failed to fetch latest release');

    const release = (await response.json()) as GitHubRelease;
    const version = formatReleaseVersion(release.tag_name);
    const links = buildReleaseDownloadLinks(release, RELEASES_FALLBACK_URL);

    if (versionElement) {
      versionElement.textContent = version ? `v${version}` : fallbackVersionLabel;
    }

    setLink('btn-win', links.windows);
    setLink('btn-mac', links.macAppleSilicon);
    setLink('btn-mac-intel', links.macIntel);
    setLink('btn-mac-tar', links.macArchive);
    setLink('btn-linux-appimage', links.linuxAppImage);
    setLink('btn-linux-deb', links.linuxDeb);
    setLink('btn-linux-rpm', links.linuxRpm);

    const downloadButtons = document.querySelectorAll<HTMLAnchorElement>('[data-download-platform]');
    for (const button of downloadButtons) {
      if (version) button.dataset.downloadVersion = version;
    }
  } catch {
    if (versionElement) versionElement.textContent = fallbackVersionLabel;
  }
}

export function initDownloadPage(): void {
  setupDropdowns();
  setupDownloadTracking();
  void hydrateReleaseLinks();
}
