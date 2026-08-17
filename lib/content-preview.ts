import { createGitHubReader } from '@keystatic/core/reader/github'
import keystaticConfig from '../keystatic.config'
import { createContentApi, type ContentApi, type ContentReader } from './content-api'

// API treści dla trybu podglądu: czyta prosto z gałęzi na GitHubie, czyli ze
// stanu, który Keystatic zapisał sekundy wcześniej — bez czekania na przebudowę
// Vercela. Używane WYŁĄCZNIE przez trasy /podglad (dynamiczne). Publiczne strony
// dalej korzystają z readera plikowego i pozostają statyczne.
//
// Repo jest publiczne, więc token nie jest wymagany. GITHUB_TOKEN (jeśli
// ustawiony) tylko podnosi limit zapytań do API GitHuba: 60/h → 5000/h.
const githubReader = createGitHubReader(keystaticConfig, {
  repo: 'dvnyyyx/stoneart-tychy',
  ref: process.env.PREVIEW_BRANCH || 'main',
  token: process.env.GITHUB_TOKEN,
}) as unknown as ContentReader

const BRANCH = process.env.PREVIEW_BRANCH || 'main'

// Zdjęcia serwujemy z surowych plików GitHuba, żeby świeży upload z CMS był
// widoczny natychmiast — katalog public/ tego wdrożenia zna tylko stan z builda.
const RAW_BASE = `https://raw.githubusercontent.com/dvnyyyx/stoneart-tychy/${BRANCH}/public`

export const previewContentApi: ContentApi = createContentApi(githubReader, 'github', RAW_BASE)
