import type { MetadataRoute } from 'next'
import { getPageMap } from 'nextra/page-map'

const baseUrl = 'https://randbox.top'

interface FileType {
  name: string
  route: string
  children?: FileType[]
}

function extractRoutes(items: FileType[]): string[] {
  const routes: string[] = []

  for (const item of items) {
    if (item.route) {
      routes.push(item.route)
    }

    if (item.children && item.children.length > 0) {
      routes.push(...extractRoutes(item.children))
    }
  }

  return routes
}

async function getPagePaths(locale: string): Promise<string[]> {
  try {
    const pageMap = await getPageMap(`/${locale}`)
    return extractRoutes(pageMap as FileType[])
  }
  catch (error) {
    console.warn(`Could not get page map for locale: ${locale}`, error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'zh']
  const currentDate = new Date().toISOString()
  const documentationPages: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    try {
      const paths = await getPagePaths(locale)

      for (const path of paths) {
        let priority = 12

        priority = (priority - path.split('/').length) / 10
        documentationPages.push({
          url: `${baseUrl}${path}`,
          lastModified: currentDate,
          changeFrequency: 'weekly',
          priority,
        })
      }
    }
    catch (error) {
      console.warn(`Could not process locale: ${locale}`)
    }
  }

  return [...documentationPages]
}
