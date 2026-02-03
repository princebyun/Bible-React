import { apiClient } from './client'

export async function getSermons() {
  const { data } = await apiClient.get('/api/sermons')
  return data
}
