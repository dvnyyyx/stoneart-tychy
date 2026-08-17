// Komponenty JSON-LD żyją w schema-components.tsx — re-eksport, by mieć jedną ścieżkę importu.
// UWAGA: nie twórz pliku lib/schema.tsx. Webpack rozwiązuje .tsx PRZED .ts (odwrotnie niż tsc),
// więc duplikat po cichu przesłania ten plik i psuje build na Vercelu, mimo że `tsc --noEmit` przechodzi.
export {
  LocalBusinessSchema,
  ServiceSchema,
  BreadcrumbSchema,
  WebSiteSchema,
} from './schema-components'
