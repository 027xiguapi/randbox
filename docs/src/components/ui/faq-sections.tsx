'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionsProps {
  className?: string
  faqs?: FAQItem[]
  randomize?: boolean
  maxItems?: number
}

// Fisher-Yates shuffle algorithm for randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function FAQSections({
  className,
  faqs = [],
  randomize = false,
  maxItems
}: FAQSectionsProps) {
  const [displayedFaqs, setDisplayedFaqs] = useState<FAQItem[]>(faqs)

  useEffect(() => {
    let processed = faqs

    if (randomize) {
      processed = shuffleArray(faqs)
    }

    if (maxItems && processed.length > maxItems) {
      processed = processed.slice(0, maxItems)
    }

    setDisplayedFaqs(processed)
  }, [faqs, randomize, maxItems])

  const handleRandomize = () => {
    let processed = shuffleArray(faqs)

    if (maxItems && processed.length > maxItems) {
      processed = processed.slice(0, maxItems)
    }

    setDisplayedFaqs(processed)
  }

  return (
    <div className={cn('space-y-8', className)}>
      {randomize && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleRandomize}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
          >
            🎲 随机化问题
          </button>
        </div>
      )}

      {displayedFaqs.map((faq, index) => (
        <div key={`${faq.question}-${index}`} className="bg-card rounded-lg border p-8 shadow">
          <h3 className="text-primary mb-4 text-xl font-bold">{faq.question}</h3>
          <p className="text-muted-foreground">{faq.answer}</p>
        </div>
      ))}
    </div>
  )
}
