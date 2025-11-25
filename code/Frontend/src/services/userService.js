import api from './api'

export async function updateProfile(payload) {
  try {
    const res = await api.put('/auth/profile', payload)
    return res.data
  } catch (err) {
    console.error(err)
    return { success: false, message: err?.response?.data?.message || 'Profile update failed' }
  }
}
