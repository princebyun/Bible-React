import { apiClient } from './client'

export async function getTodayQt() {
  const { data } = await apiClient.get('/api/qt/today')
  return data
}
