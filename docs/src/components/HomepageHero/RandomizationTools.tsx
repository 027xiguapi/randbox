'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/hooks'

export default function RandomizationTools() {
  const { t, currentLocale } = useLocale()

  const tools = [
    {
      id: 'simple',
      title: t('randomizationTools.tools.simple.title'),
      description: t('randomizationTools.tools.simple.description'),
      href: `/${currentLocale}/simple`,
      img: '/img/projects/simple.png',
    },
    {
      id: 'block',
      title: t('randomizationTools.tools.block.title'),
      description: t('randomizationTools.tools.block.description'),
      href: `/${currentLocale}/block`,
      img: '/img/projects/block.png',
    },
    {
      id: 'stratified',
      title: t('randomizationTools.tools.stratified.title'),
      description: t('randomizationTools.tools.stratified.description'),
      href: `/${currentLocale}/stratified`,
      img: '/img/projects/stratified.png',
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">{t('randomizationTools.title')}</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('randomizationTools.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tools.map((tool) => (
          <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="text-center">
              <Image
                src={tool.img}
                alt={tool.title}
                width={500}
                height={350}
                className="relative w-full max-w-lg rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 border border-sky-100"
              />
              <CardTitle className="text-xl">{tool.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full" size="lg">
                <Link href={tool.href}>
                  {t('randomizationTools.getStarted')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <div className="bg-muted/50 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-3">{t('randomizationTools.features.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{t('randomizationTools.features.reproducible')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t('randomizationTools.features.history')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>{t('randomizationTools.features.export')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
