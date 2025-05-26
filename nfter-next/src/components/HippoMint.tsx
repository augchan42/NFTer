'use client';

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Download, ExternalLink } from 'lucide-react'
import { generateCharacter } from '@/lib/generator/generator'
import type { CharacterMetadata } from '@/lib/generator/generator'
import baseHippo from '@/assets/hippo/base.png'

export default function HippoMint() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [characterMetadata, setCharacterMetadata] = useState<CharacterMetadata | null>(null)
  const [status, setStatus] = useState<string>('')

  const handleMint = async () => {
    setIsLoading(true)
    setStatus('Generating your unique hippo character...')
    try {
      // Generate character metadata
      const metadata = generateCharacter(Date.now())
      setCharacterMetadata(metadata)

      const formData = new FormData()
      formData.append("prompt", metadata.prompt)

      // Start prediction
      const response = await fetch('/api/generate-bagel', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to start generation')
      }

      const data = await response.json()
      const predictionId = data.prediction_id
      setStatus('Starting image generation...')

      // In development, use polling; in production, use SSE
      if (process.env.NODE_ENV === 'development') {
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/check-prediction?id=${predictionId}`)
            const prediction = await statusResponse.json()
            
            if (prediction.status === 'succeeded') {
              clearInterval(pollInterval)
              const imageUrl = prediction.output?.image || prediction.output?.[0] || prediction.output
              setGeneratedImage(imageUrl)
              setStatus('Generation complete!')
              toast.success('Your hippo has been generated!')
              setIsLoading(false)
            } else if (prediction.status === 'failed') {
              clearInterval(pollInterval)
              setStatus('Generation failed')
              toast.error(prediction.error || 'Generation failed')
              setIsLoading(false)
            } else if (prediction.status === 'processing') {
              setStatus('Processing your hippo...')
            } else if (prediction.status === 'starting') {
              setStatus('Starting the generation process...')
            }
          } catch (error) {
            console.error('Polling error:', error)
            clearInterval(pollInterval)
            setStatus('Failed to check generation status')
            toast.error('Failed to check generation status')
            setIsLoading(false)
          }
        }, 1000) // Poll every second

        // Cleanup on unmount
        return () => {
          clearInterval(pollInterval)
        }
      } else {
        // Set up SSE connection to receive webhook updates
        const eventSource = new EventSource(`/api/webhooks/replicate?id=${predictionId}`)

        eventSource.onmessage = (event) => {
          const prediction = JSON.parse(event.data)
          
          if (prediction.status === 'succeeded') {
            eventSource.close()
            const imageUrl = prediction.output?.image || prediction.output?.[0] || prediction.output
            setGeneratedImage(imageUrl)
            setStatus('Generation complete!')
            toast.success('Your hippo has been generated!')
            setIsLoading(false)
          } else if (prediction.status === 'failed') {
            eventSource.close()
            setStatus('Generation failed')
            toast.error(prediction.error || 'Generation failed')
            setIsLoading(false)
          } else if (prediction.status === 'processing') {
            setStatus('Processing your hippo...')
          } else if (prediction.status === 'starting') {
            setStatus('Starting the generation process...')
          }
        }

        eventSource.onerror = () => {
          eventSource.close()
          setStatus('Connection lost')
          toast.error('Connection lost. Please try again.')
          setIsLoading(false)
        }

        // Cleanup on unmount
        return () => {
          eventSource.close()
        }
      }

    } catch (error) {
      console.error('Error:', error)
      setStatus('Generation failed')
      toast.error(error instanceof Error ? error.message : 'Failed to generate hippo')
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-600">Hippo Forge</h1>
          <p className="text-lg sm:text-xl text-bold">
            Mint your unique hippo character
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-lg border">
            <Image
              src={baseHippo}
              alt="Base hippo template"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 300px, 300px"
              priority
            />
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={handleMint} 
              disabled={isLoading} 
              className="w-full max-w-[300px]"
            >
              {isLoading ? "Generating..." : "Mint New Hippo"}
            </Button>
          </div>
        </div>

        {characterMetadata && (
          <div className="mt-4 p-4 bg-muted rounded-lg space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Character Traits</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {Object.entries(characterMetadata.traits).map(([category, value]) => (
                  <li key={category} className="mb-1">
                    <span className="font-medium text-foreground">{category}:</span> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Generation Details</h3>
              <p className="mb-2 text-muted-foreground">Rarity Score: {characterMetadata.rarityScore}</p>
              <p className="mb-2 text-muted-foreground">Special Set: {characterMetadata.specialSet || 'None'}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-foreground">Full Prompt</h3>
              <p className="text-sm bg-background p-3 rounded border text-muted-foreground">{characterMetadata.prompt}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-muted-foreground">{status}</p>
          </div>
        )}

        {generatedImage && (
          <div className="space-y-4">
            <div className="relative">
              <div className="space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                  <Image
                    src={generatedImage}
                    alt="Generated hippo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-2 flex flex-col sm:flex-row justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => window.open(generatedImage, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Full Size
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = generatedImage
                      link.download = 'hippo-character.png'
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}