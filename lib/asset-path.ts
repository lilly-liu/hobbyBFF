export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
export function assetPath(path: string) {
  return path.startsWith('/') && !path.startsWith('//') ? `${basePath}${path}` : path
}
