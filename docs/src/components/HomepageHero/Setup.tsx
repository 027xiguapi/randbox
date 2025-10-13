'use client'

import clsx from 'clsx'
import Link from 'next/link'
import styles from '@/components/HomepageHero/SetupHero.module.css'
import { MotionWrapperFlash } from '@/components/MotionWrapper/Flash'
import { Button } from '@/components/ui/button'
import { FlipWords } from '@/components/ui/flip-words'
import { LinkPreview } from '@/components/ui/link-preview'
import { useLocale } from '@/hooks'

interface Props {
}
export function SetupHero(props: Props) {
  const { t, currentLocale } = useLocale()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.badgeContainer}>
          <a
            className={styles.badge}
            href="https://github.com/027xiguapi/randbox"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('badgeTitle')}
          </a>
        </div>
        <h1 className={styles.headline}>
          <MotionWrapperFlash
            disabledAnimation={false}
            className="flex items-center"
          >
            <span className="icon-[game-icons--dice-twenty-faces-twenty]"></span>
          </MotionWrapperFlash>
          {' '}
          RandBox
          <br className="sm:hidden"></br>
          {' '}
          Random Data
          <br className="sm:hidden"></br>
          {' '}
          Generator
        </h1>

        <Link
          href={`/${currentLocale}/docs`}
          className={clsx([
            'bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg',
            'dark:bg-linear-to-r dark:from-green-400 dark:via-teal-500 dark:to-cyan-500 dark:text-white',
            'text-sm mt-2 inline-block px-3 py-1 rounded-lg',
            '[&>span]:font-bold',
            'animate-pulse',
            '[animation-duration:2s]',
          ])}
          dangerouslySetInnerHTML={{
            __html: t('featureSupport', {
              feature: `<span>10+ Data Categories, 100+ Functions</span>`,
            }),
          }}
        />


        <div className={clsx([
          styles.subtitle,
          'text-neutral-500 dark:text-neutral-300',
        ])}
        >
          Random data made
          {' '}
          <FlipWords
            words={[
              'Simple',
              'Fast',
              'Reliable',
              'Flexible',
              'Powerful',
              'Comprehensive',
              'Efficient',
              'Reproducible',
              'Versatile',
            ]}
          />
          <br />
          Generate
          {' '}
          <LinkPreview
            url="https://randbox.top/docs/basics"
          >
            Basic Data
          </LinkPreview>
          ,
          {' '}
          <LinkPreview
            url="https://randbox.top/docs/person"
          >
            Personal Info
          </LinkPreview>
          ,
          {' '}
          <LinkPreview
            url="https://randbox.top/docs/location"
          >
            Geographic Data
          </LinkPreview>
          {', '}
          <LinkPreview
            url="https://randbox.top/docs/finance"
          >
            Financial Data
          </LinkPreview>
        </div>
        <div className="flex justify-center pt-10">
          <div className="max-w-[500px] flex flex-wrap gap-[20px] max-sm:justify-center">
            <Button
              asChild
              size="lg"
              className="font-bold group max-sm:w-[100%]"
            >
              <Link
                href={`/${currentLocale}/docs`}
              >
                {t('getStarted')}
                <span className="w-[20px] translate-x-[6px] transition-all group-hover:translate-x-[10px] icon-[mingcute--arrow-right-fill]"></span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="font-bold group max-sm:w-[100%]"
            >
              <Link
                href="https://github.com/027xiguapi/randbox"
                target="_blank"
              >
                Github
                <span className="ml-[6px] icon-[mingcute--github-line]"></span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
