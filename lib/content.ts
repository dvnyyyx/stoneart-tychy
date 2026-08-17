import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'
import { createContentApi, type ContentApi, type ContentReader } from './content-api'

// Reader plikowy — czyta content/ z dysku podczas builda (Server Components).
// To jest domyślne API treści: publiczne strony są dzięki niemu w 100% statyczne.
const fileReader = createReader(process.cwd(), keystaticConfig) as unknown as ContentReader

export const contentApi: ContentApi = createContentApi(fileReader, 'dysk')

export const reader = fileReader

// Nazwane eksporty dla wygody — publiczne strony nie muszą znać obiektu API.
// Trasy /podglad przekazują własne API (czytnik GitHuba) jawnie w propsie.
export const {
  getSiteSettings,
  getNavigation,
  getFooterContent,
  getHeroContent,
  getHomepageContent,
  getONasContent,
  getUslugiPageContent,
  getRealizacjePageContent,
  getOpiniePageContent,
  getKontaktPageContent,
  getWycenaPageContent,
  getPrivacyPageContent,
  getQuoteFormContent,
  getServices,
  getService,
  getTestimonials,
  getFeaturedTestimonials,
  getCategories,
  getGallery,
  getFeaturedGallery,
} = contentApi

export { resolveImage, createContentApi } from './content-api'
export type {
  ContentApi,
  ContentReader,
  ServiceEntry,
  TestimonialEntry,
  CategoryEntry,
  GalleryPhoto,
} from './content-api'
