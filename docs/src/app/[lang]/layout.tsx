import type { Metadata } from 'next'

import type { I18nLangAsyncProps, I18nLangKeys } from '@/i18n'
import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { CustomFooter } from '@/components/CustomFooter'
import { useServerLocale } from '@/hooks'
import LocaleToggle from '@/widgets/locale-toggle'
import ThemeToggle from '@/widgets/theme-toggle'

import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import { ThemeProvider } from './_components/ThemeProvider'
import './styles/index.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: I18nLangKeys }>
}): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const { metadata } = dictionary

  const keywordsArray = metadata.keywords.split(', ')

  return {
    icons: { icon: '/favicon.ico' },
    description: metadata.description,
    metadataBase: new URL('https://randbox.top'),
    keywords: keywordsArray,
    generator: metadata.generator,
    applicationName: 'RandBox',
    appleWebApp: {
      title: metadata.appTitle,
    },
    title: {
      default: metadata.title,
      template: metadata.titleTemplate,
    },
    openGraph: {
      url: './',
      siteName: metadata.siteName,
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: metadata.ogImageAlt,
        },
      ],
    },
    other: {
      'msapplication-TileColor': '#fff',
    },
    twitter: {
      site: '@randbox_dev',
      card: 'summary_large_image',
      title: metadata.twitterTitle,
      description: metadata.twitterDescription,
      images: ['/twitter-card.png'],
    },
    alternates: {
      canonical: './',
      languages: {
        en: '/en',
        zh: '/zh',
        'x-default': '/en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

const repo = 'https://github.com/027xiguapi/randbox'

const CustomBanner = async ({ lang }: I18nLangAsyncProps) => {
  const { t } = await useServerLocale(lang)
  return (
    <Banner storageKey="starter-banner">
      <div className="flex justify-center items-center gap-1">
        {t('banner.title')}
        {' '}
        <a
          className="max-sm:hidden text-warning hover:underline"
          target="_blank"
          href={repo}
        >
          {t('banner.more')}
        </a>
      </div>
    </Banner>
  )
}

const CustomNavbar = async ({ lang }: I18nLangAsyncProps) => {
  const { t } = await useServerLocale(lang)
  return (
    <Navbar
      logo={<span>{t('systemTitle')}</span>}
      logoLink={`/${lang}`}
      projectLink={repo}
    >
      <>
        <LocaleToggle className="max-md:hidden" />
        <ThemeToggle className="max-md:hidden" />
      </>
    </Navbar>
  )
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const getterParams = await params

  const { lang } = getterParams as { lang: I18nLangKeys }

  const dictionary = await getDictionary(lang)
  const pageMap = await getPageMap(lang)

  // 使用国际化的 metadata
  const { metadata } = dictionary
  const title = metadata.title
  const description = metadata.description

  const { t } = await useServerLocale(lang)

  return (
    <html
      lang={lang}
      dir={getDirection(lang)}
      suppressHydrationWarning
    >
      <Head>
        <meta property="og:title" content={metadata.ogTitle} />
        <meta name="description" content={metadata.description} />
        <meta property="og:description" content={metadata.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://randbox.top" />
        <meta property="og:site_name" content={metadata.siteName} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.twitterTitle} />
        <meta name="twitter:description" content={metadata.twitterDescription} />
        <link rel="canonical" href="https://randbox.top" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5878114055897626"
          crossOrigin="anonymous"
        >
        </script>
      </Head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="starter-theme-provider"
          disableTransitionOnChange
        >
          <Layout
            copyPageButton={false}
            banner={<CustomBanner lang={lang} />}
            navbar={<CustomNavbar lang={lang} />}
            lastUpdated={<LastUpdated>{t('lastUpdated')}</LastUpdated>}
            editLink="Edit this page on GitHub"
            docsRepositoryBase="https://github.com/027xiguapi/randbox/tree/master/docs"
            footer={(
              <Footer className="bg-background py-5!">
                <CustomFooter />
              </Footer>
            )}
            search={(
              <Search
                placeholder={t('search.placeholder')}
                emptyResult={t('search.noResults')}
                errorText={t('search.errorText')}
                loading={t('search.loading')}
              />
            )}
            i18n={[
              { locale: 'en', name: 'English' },
              { locale: 'zh', name: '简体中文' },
            ]}
            toc={{
              backToTop: t('backToTop'),
              title: t('pageTitle'),
            }}
            pageMap={pageMap}
            feedback={{ content: 'Question? Give us feedback' }}
          >
            {children}
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
