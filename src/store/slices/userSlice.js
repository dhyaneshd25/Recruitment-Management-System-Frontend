import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'


let mockUsers = [
  { id: '1', name: 'Alex Admin', email: 'admin@recruitEdge.com', role: 'ADMIN' },
  { id: '2', name: 'Recuriter Manager', email: 'hr@recruitEdge.com', role: 'Recuriter' },
  { id: '3', name: 'John Candidate', email: 'candidate@recruitEdge.com', role: 'CANDIDATE' },
  { id: '4', name: 'Sarah Recuriter', email: 'sarah@recruitEdge.com', role: 'Recuriter' },
  { id: '5', name: 'Mike Dev', email: 'mike@example.com', role: 'CANDIDATE' },
]

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  await new Promise(r => setTimeout(r, 400))
  return [...mockUsers]
})

export const fetchUsersByRole = createAsyncThunk('user/byRole',async({role})=>{
  await new Promise(r => setTimeout(r, 400))
  const res = await api.get('/user/byRole', { params : {role } })
  return res.data
})

export const createUser = createAsyncThunk('users/create', async (data) => {
  await new Promise(r => setTimeout(r, 400))
  const newUser = { ...data, id: String(Date.now()) }
  mockUsers.push(newUser)
  return newUser
})

export const updateUser = createAsyncThunk('users/update', async ({ id, data }) => {
  await new Promise(r => setTimeout(r, 400))
  mockUsers = mockUsers.map(u => u.id === id ? { ...u, ...data } : u)
  return { id, ...data }
})

export const deleteUser = createAsyncThunk('users/delete', async (id) => {
  await new Promise(r => setTimeout(r, 300))
  mockUsers = mockUsers.filter(u => u.id !== id)
  return id
})

const userSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null, usersByRole:[] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, s => { s.loading = true })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
      .addCase(fetchUsers.rejected, s => { s.loading = false })
      .addCase(createUser.fulfilled, (s, a) => { s.items.push(a.payload) })
      .addCase(updateUser.fulfilled, (s, a) => {
        const idx = s.items.findIndex(u => u.id === a.payload.id)
        if (idx !== -1) s.items[idx] = { ...s.items[idx], ...a.payload }
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.items = s.items.filter(u => u.id !== a.payload)
      })
      .addCase(fetchUsersByRole.fulfilled, (s, a) => { s.usersByRole = a.payload })
  },
})

export default userSlice.reducer
