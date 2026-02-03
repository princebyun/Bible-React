import { apiClient } from './client'

export async function checkText(text) {
  const { data } = await apiClient.post('/api/cleanbot/check', { text })
  return data
}

export async function checkImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post('/api/cleanbot/check-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
