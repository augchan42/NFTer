'use client';

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import HippoMint from '@/components/HippoMint'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <Image
            src="/offbrand.png"
            alt="Main Logo"
            width={200}
            height={50}
            className="mx-auto"
          />
          <p className="text-lg sm:text-xl text-bold">
            Create your unique hippo character using AI
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/walrus-mint">
              <Button variant="outline">
                Try Walrus Mint (SUI Blockchain)
              </Button>
            </Link>
          </div>
        </div>

        <HippoMint />

        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <h5 className="mb-2 sm:mb-3 text-lg">About this tool</h5>
          <p className="mb-3 sm:mb-4 text-muted-foreground">
            This tool uses advanced AI technology to generate unique hippo characters. Each character is created with random traits and can be customized through our generation process.
          </p>
          <p className="text-muted-foreground">
            The process may take some time depending on the current server load. You can also try our Walrus Mint feature which integrates with the SUI blockchain for NFT creation.
          </p>
        </div>
      </div>
    </div>
  )
}