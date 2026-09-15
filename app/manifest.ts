import type { MetadataRoute } from 'next'
import { assetPath } from '@/lib/asset-path'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'hobbyBFF',
    short_name: 'hobbyBFF',
    description: 'Find a friend to try something new with in Boston.',
    start_url: assetPath('/'),
    scope: assetPath('/'),
    display: 'standalone',
    background_color: '#faf9ff',
    theme_color: '#faf9ff',
    icons: [
      { src: assetPath('/pwa-192.png'), sizes: '192x192', type: 'image/png' },
      { src: assetPath('/pwa-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
