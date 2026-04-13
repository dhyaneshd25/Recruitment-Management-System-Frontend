import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Mock data (fallback)
let mockJobs = [
  { id: '1', jobTitle: 'Senior React Developer', description: 'We are looking for an experienced React developer to join our team and work on cutting-edge web applications.', location: 'Bangalore, India', experience: 3, salaryRange: '15-25 LPA', status: 'OPEN', createdBy: 'Recuriter Manager' },
  { id: '2', jobTitle: 'Backend Java Engineer', description: 'Strong Java Spring Boot experience required. Microservices architecture knowledge preferred.', location: 'Mumbai, India', experience: 5, salaryRange: '20-35 LPA', status: 'OPEN', createdBy: 'Recuriter Manager' },
  { id: '3', jobTitle: 'UI/UX Designer', description: 'Creative designer with Figma proficiency needed for our product design team.', location: 'Remote', experience: 2, salaryRange: '8-15 LPA', status: 'CLOSED', createdBy: 'Alex Admin' },
  { id: '4', jobTitle: 'DevOps Engineer', description: 'AWS, Docker, Kubernetes expertise required. CI/CD pipeline management experience.', location: 'Hyderabad, India', experience: 4, salaryRange: '18-28 LPA', status: 'OPEN', createdBy: 'Alex Admin' },
  { id: '5', jobTitle: 'Data Scientist', description: 'ML/AI background with Python expertise. Experience with TensorFlow or PyTorch preferred.', location: 'Pune, India', experience: 2, salaryRange: '12-20 LPA', status: 'DRAFT', createdBy: 'Recuriter Manager' },
]

// ── Thunks ────────────────────────────────────────────────────────

export const fetchJobs = createAsyncThunk('job/get', async ({ page = 1, size = 5, search="" } = {}, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    const res = await api.get('/job/get', { params: { page, size, search } })
    // Expect: { content: [], totalElements: N, totalPages: N }
    return res.data
  } catch {
    // Mock fallback — simulate pagination locally
    const start = page * size
    const content = mockJobs.slice(start, start + size)
    return { content, totalElements: mockJobs.length, totalPages: Math.ceil(mockJobs.length / size) }
  }
})

export const createJob = createAsyncThunk('job/create', async (jobData, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 500))
    const res = await api.post("/job/create",jobData)
    return res.data;
  } catch (err) { return rejectWithValue(err.message) }
})

export const updateJob = createAsyncThunk('job/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    const res = await api.put(`/job/update/${id}`,data)
    return res.data
  } catch (err) { return rejectWithValue(err.message) }
})

export const deleteJob = createAsyncThunk('job/delete', async (id, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 300))
    // mockJobs = mockJobs.filter(j => j.id !== id)
    const res = await api.delete(`/job/delete/${id}`)
    return res.data
  } catch (err) { return rejectWithValue(err.message) }
})

export const fetchJobType = createAsyncThunk('job/jobTypes',async(__reactRouterVersion,{ rejectWithValue }) => {
  try{
    await new Promise(r => setTimeout(r,300))

    const res = await api.get("/job/jobTypes")

    return res.data
  }catch(err){ return rejectWithValue(err.message)}
  
})

// ── Slice ─────────────────────────────────────────────────────────

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    totalElements: 0,
    totalPages: 0,
    loading: false,
    error: null,
    jobTypeData:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending,    s => { s.loading = true; s.error = null })
      .addCase(fetchJobs.fulfilled,  (s, a) => {
        s.loading      = false
        s.items        = a.payload.data        // current page rows
        s.totalElements = a.payload.totalElements
        s.totalPages   = a.payload.totalPages
      })
      .addCase(fetchJobs.rejected,   (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(createJob.fulfilled,  (s, a) => { s.items.push(a.payload); s.totalElements++ })
      .addCase(updateJob.fulfilled,  (s, a) => {
        const idx = s.items.findIndex(j => j.id === a.payload.id)
        if (idx !== -1) s.items[idx] = { ...s.items[idx], ...a.payload }
      })
      .addCase(deleteJob.fulfilled,  (s, a) => {
        s.items = s.items.filter(j => j.id !== a.payload)
        s.totalElements--
      })
      .addCase(fetchJobType.fulfilled, (s,a) => {
        s.jobTypeData = a.payload
      })
  },
})

export default jobSlice.reducer







// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import api from '../../services/api'

// // Mock data
// let mockJobs = [
//   { id: '1', jobTitle: 'Senior React Developer', description: 'We are looking for an experienced React developer to join our team and work on cutting-edge web applications.', location: 'Bangalore, India', experience: 3, salaryRange: '15-25 LPA', status: 'OPEN', createdBy: 'Recuriter Manager' },
//   { id: '2', jobTitle: 'Backend Java Engineer', description: 'Strong Java Spring Boot experience required. Microservices architecture knowledge preferred.', location: 'Mumbai, India', experience: 5, salaryRange: '20-35 LPA', status: 'OPEN', createdBy: 'Recuriter Manager' },
//   { id: '3', jobTitle: 'UI/UX Designer', description: 'Creative designer with Figma proficiency needed for our product design team.', location: 'Remote', experience: 2, salaryRange: '8-15 LPA', status: 'CLOSED', createdBy: 'Alex Admin' },
//   { id: '4', jobTitle: 'DevOps Engineer', description: 'AWS, Docker, Kubernetes expertise required. CI/CD pipeline management experience.', location: 'Hyderabad, India', experience: 4, salaryRange: '18-28 LPA', status: 'OPEN', createdBy: 'Alex Admin' },
//   { id: '5', jobTitle: 'Data Scientist', description: 'ML/AI background with Python expertise. Experience with TensorFlow or PyTorch preferred.', location: 'Pune, India', experience: 2, salaryRange: '12-20 LPA', status: 'DRAFT', createdBy: 'Recuriter Manager' },
// ]

// const tryApi = async (apiCall, fallback) => {
//   try {
//     const res = await apiCall()
//     return res.data
//   } catch {
//     return fallback()
//   }
// }

// export const fetchJobs = createAsyncThunk('job/get', async (_, { rejectWithValue }) => {
//   try {
//     await new Promise(r => setTimeout(r, 400))
//     return tryApi(() => api.get('/job/get'), () => [...mockJobs])
//   } catch (err) { return rejectWithValue(err.message) }
// })

// export const createJob = createAsyncThunk('job/create', async (jobData, { rejectWithValue }) => {
//   try {
//     await new Promise(r => setTimeout(r, 500))
//     const newJob = { ...jobData, id: String(Date.now()), createdBy: 'Current User' }
//     mockJobs.push(newJob)
//     return newJob
//   } catch (err) { return rejectWithValue(err.message) }
// })

// export const updateJob = createAsyncThunk('job/update', async ({ id, data }, { rejectWithValue }) => {
//   try {
//     await new Promise(r => setTimeout(r, 400))
//     mockJobs = mockJobs.map(j => j.id === id ? { ...j, ...data } : j)
//     return { id, ...data }
//   } catch (err) { return rejectWithValue(err.message) }
// })

// export const deleteJob = createAsyncThunk('job/delete', async (id, { rejectWithValue }) => {
//   try {
//     await new Promise(r => setTimeout(r, 300))
//     mockJobs = mockJobs.filter(j => j.id !== id)
//     return id
//   } catch (err) { return rejectWithValue(err.message) }
// })

// const jobSlice = createSlice({
//   name: 'jobs',
//   initialState: { items: [], loading: false, error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchJobs.pending, s => { s.loading = true; s.error = null })
//       .addCase(fetchJobs.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.data })
//       .addCase(fetchJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload.message })
//       .addCase(createJob.fulfilled, (s, a) => { s.items.push(a.payload) })
//       .addCase(updateJob.fulfilled, (s, a) => {
//         const idx = s.items.findIndex(j => j.id === a.payload.id)
//         if (idx !== -1) s.items[idx] = { ...s.items[idx], ...a.payload }
//       })
//       .addCase(deleteJob.fulfilled, (s, a) => {
//         s.items = s.items.filter(j => j.id !== a.payload)
//       })
//   },
// })

// export default jobSlice.reducer
