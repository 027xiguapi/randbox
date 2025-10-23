import Image from 'next/image'
import Link from 'next/link'

import MarkdownRender from '@/components/markdown/mark-down-render'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TextImageSection {
  title: string
  content: string[]
  image: {
    src: string
    alt: string
  }
  href?: string
  ctaText?: string
}

interface TextImageSectionsProps {
  className?: string
  sections?: TextImageSection[]
}

export default function TextImageSections({ className, sections = [] }: TextImageSectionsProps) {
  return (
    <div className={cn('space-y-16', className)}>
      {sections.map((section, index) => {
        const currentImagePosition = index % 2 === 0 ? 'right' : 'left'

        return (
          <Card
            key={index}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-sky-50/30"
          >
            <CardContent className="p-8 lg:p-12">
              <section
                className={cn(
                  'grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12',
                  currentImagePosition === 'left' && 'lg:grid-flow-col-dense',
                )}
              >
                <div className={cn('space-y-6', currentImagePosition === 'left' && 'lg:col-start-2')}>
                  <h2 className="text-primary mb-4 text-3xl font-bold leading-tight">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <div key={pIndex} className="text-muted-foreground text-lg leading-relaxed">
                        <MarkdownRender content={paragraph} />
                      </div>
                    ))}
                  </div>
                  {section.href && (
                    <div className="pt-4">
                      <Link href={section.href} prefetch>
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                        >
                          {section.ctaText ?? 'View Page'}
                          {' '}
                          →
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    'flex justify-center',
                    currentImagePosition === 'left' ? 'lg:col-start-1 lg:justify-start' : 'lg:justify-end',
                  )}
                >
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-sky-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      width={500}
                      height={350}
                      className="relative w-full max-w-lg rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 border border-sky-100"
                    />
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
