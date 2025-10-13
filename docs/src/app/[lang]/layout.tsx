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

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  metadataBase: new URL('https://randbox.top'),
  icons: { icon: '/favicon.svg' },
} satisfies Metadata

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

// interface Props {
//   children: ReactNode
//   params: Promise<{ lang: I18nLangKeys }>
// }

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const getterParams = await params

  const { lang } = getterParams as { lang: I18nLangKeys }

  const dictionary = await getDictionary(lang)
  const pageMap = await getPageMap(lang)

  const title = 'RandBox - JavaScript Random Data Generation Library'
  const description = 'RandBox is a powerful JavaScript random data generation library that provides rich APIs for generating various types of random data. It supports basic data types, personal information, financial data, geographic locations, time/dates, network data, and more.'

  const { t } = await useServerLocale(lang)

  return (
    <html
      lang={lang}
      dir={getDirection(lang)}
      suppressHydrationWarning
    >
      <Head>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://randbox.top" />
        <meta property="og:site_name" content="RandBox" />
        <meta name="keywords" content="javascript, random data, data generation, testing, faker, mock data, random numbers, random strings, random names, random addresses" />
        <meta name="author" content="RandBox Team" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
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
            editLink={null}
            docsRepositoryBase="https://github.com/027xiguapi/randbox"
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
            feedback={{ content: '' }}
          >
            {children}
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
