import api from './api'

export async function listCompaneys() {
  try {
    const res = await api.get('/companey')
    return res.data
  } catch (err) {
    console.log(err);
    if (err.status === 401) {
      return { success: false, message: "Unauthorized" }
    }
    return { success: false, message: "Companey listing failed" }
  }
}

export async function createCompaney(payload) {
  try {
    const res = await api.post('/companey', payload)
    return res
  } catch (err) {
    alert(err?.response?.message || 'Companey creation failed')
  }
}

export async function updateCompaney(id, payload) {
  try {
    const res = await api.put(`/companey/${id}`, payload)
    return res.data
  } catch (err) {
    alert(err?.response?.message || 'Companey update failed')
  }
}

export async function deleteCompaney(id) {
  try {
    await api.delete(`/companey/${id}`)
    return { success: true }
  } catch (err) {
    alert(err?.response?.message || 'Companey deletion failed')
  }
}

export async function getCompaney(id) {
  try {
    const res = await api.get(`/companey/${id}`)
    return res.data
  } catch (err) {
    alert(err?.response?.message || 'Companey retrieval failed')
  }
}

export async function uploadFile(id, file) {
  try {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post(`/companey/${id}/upload-file`, form)
    return res.data
  } catch (err) {
    alert(err?.response?.message || 'File upload failed')
  }
}

export async function uploadImages(id, file) {
  try {
    const form = new FormData()
    // backend expects field name 'images' for multiImageUpload
    form.append('images', file)
    const res = await api.post(`/companey/${id}/upload-images`, form)
    return res.data
  } catch (err) {
    alert(err?.response?.message || 'Image upload failed')
  }
}
