import { apiClient } from './client'

export async function getBibleView(params = {}) {
  const { data } = await apiClient.get('/api/bible/view', { params })
  return data
}

export async function getChapters(book) {
  const { data } = await apiClient.get('/api/bible/chapters', { params: { book } })
  return data
}
