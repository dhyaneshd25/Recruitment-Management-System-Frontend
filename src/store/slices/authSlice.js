import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Mock users for demo (replace with real API calls)
const MOCK_USERS = [
  { id: '1', name: 'Alex Admin', email: 'admin@recruitEdge.com', password: 'admin123', role: 'ADMIN' },
  { id: '2', name: 'HR Manager', email: 'hr@recruitEdge.com', password: 'hr123', role: 'HR' },
  { id: '3', name: 'John Candidate', email: 'candidate@recruitEdge.com', password: 'cand123', role: 'CANDIDATE' },
]

const generateMockToken = (user) => {
  // Mock JWT-like token (base64 encoded payload)
  const payload = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Date.now() + 86400000 }))
  return `mock.${payload}.signature`
}

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    // Try real API first, fall back to mock
    try {
      const res = await api.post('/auth/login', { email, password })
      return res.data
    } catch {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password)
      if (!user) throw new Error('Invalid credentials')
      const token = generateMockToken(user)
      const { password: _, ...safeUser } = user
      return { token, user: safeUser }
    }
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    try {
      const res = await api.post('/auth/register', userData)
      return res.data
    } catch {
      const newUser = {
        id: String(Date.now()),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'CANDIDATE',
      }
      const token = generateMockToken(newUser)
      return { token, user: newUser }
    }
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed')
  }
})

export const googleLogin = createAsyncThunk('auth/googleLogin', async (_, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    const googleUser = {
      id: 'g_' + Date.now(),
      name: 'Google User',
      email: 'google.user@gmail.com',
      role: 'CANDIDATE',
    }
    const token = generateMockToken(googleUser)
    return { token, user: googleUser }
  } catch (err) {
    return rejectWithValue('Google login failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null }
    const handleFulfilled = (state, action) => {
      state.loading = false
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
    }
    const handleRejected = (state, action) => {
      state.loading = false
      state.error = action.payload
    }
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(googleLogin.pending, handlePending)
      .addCase(googleLogin.fulfilled, handleFulfilled)
      .addCase(googleLogin.rejected, handleRejected)
  },
})

export const { logout, clearError, setCredentials } = authSlice.actions
export default authSlice.reducer
