import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Mock fallback data (used only if the real API call fails)
let mockUsers = [
  { id: '1', name: 'Alex Admin', email: 'admin@recruitEdge.com', role: 'ADMIN' },
  { id: '2', name: 'Recuriter Manager', email: 'hr@recruitEdge.com', role: 'Recuriter' },
  { id: '3', name: 'John Candidate', email: 'candidate@recruitEdge.com', role: 'CANDIDATE' },
  { id: '4', name: 'Sarah Recuriter', email: 'sarah@recruitEdge.com', role: 'Recuriter' },
  { id: '5', name: 'Mike Dev', email: 'mike@example.com', role: 'CANDIDATE' },
]

export const fetchUsers = createAsyncThunk('users/fetchAll', async ({ page = 1, size = 5, search = '' } = {}, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    const res = await api.get('/user/get', { params: { page, size, search } })
    // Expect: { data: [], totalElements: N, totalPages: N }
    return res.data
  } catch (err) {
    // Mock fallback — simulate pagination locally
    const start = (page - 1) * size
    const filtered = mockUsers.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    )
    const data = filtered.slice(start, start + size)
    return { data, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / size) }
  }
})

export const fetchUsersByRole = createAsyncThunk('user/byRole', async ({ role }, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    const res = await api.get('/user/byRole', { params: { role } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users by role')
  }
})

export const createUser = createAsyncThunk('users/create', async (data, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    const res = await api.post('/user/create', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create user')
  }
})

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    const res = await api.put(`/user/update/${id}`, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update user')
  }
})

export const roleUserCount = createAsyncThunk('users/roleUserCount', async (_,{ rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    const res = await api.get('/user/roleUserCount')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update user')
  }
})

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 300))
    await api.delete(`/user/delete/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete user')
  }
})

const userSlice = createSlice({
  name: 'users',
  initialState: { items: [], totalElements: 0, totalPages: 0, loading: false, error: null, usersByRole: [], countArray: [0,0,0,0] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   s => { s.loading = true; s.error = null })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false
        s.items = a.payload.data
        s.totalElements = a.payload.totalElements
        s.totalPages = a.payload.totalPages
      })
      .addCase(fetchUsers.rejected,  (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(createUser.fulfilled, (s, a) => { s.items.push(a.payload); s.totalElements++ })
      .addCase(createUser.rejected,  (s, a) => { s.error = a.payload })

      .addCase(updateUser.fulfilled, (s, a) => {
        const idx = s.items.findIndex(u => u.id === a.payload.id)
        if (idx !== -1) s.items[idx] = { ...s.items[idx], ...a.payload }
      })
      .addCase(updateUser.rejected, (s, a) => { s.error = a.payload })

      .addCase(deleteUser.fulfilled, (s, a) => { s.items = s.items.filter(u => u.id !== a.payload); s.totalElements-- })
      .addCase(deleteUser.rejected,  (s, a) => { s.error = a.payload })

      .addCase(fetchUsersByRole.fulfilled, (s, a) => { s.usersByRole = a.payload })
      .addCase(fetchUsersByRole.rejected,  (s, a) => { s.error = a.payload })

      .addCase(roleUserCount.fulfilled, (s, a) => { s.countArray = a.payload})
      .addCase(roleUserCount.rejected,  (s, a) => { s.error = a.payload })

  },
})

export default userSlice.reducer