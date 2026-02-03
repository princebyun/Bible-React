import { apiClient, getApiBaseUrl } from './client'

export async function uploadImage(base64DataUrl) {
  const { data } = await apiClient.post('/api/uploadImage', base64DataUrl, {
    headers: { 'Content-Type': 'text/plain' },
  })
  return data
}

export function getShareImageUrl(filename) {
  const base = getApiBaseUrl()
  return `${base}/api/share/${filename}`
}
