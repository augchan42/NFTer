'use client';

import HippoMint from '@/components/HippoMint'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function HippoMintPage() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Main
            </Button>
          </Link>
        </div>
        <HippoMint />
      </div>
    </div>
  )
} 