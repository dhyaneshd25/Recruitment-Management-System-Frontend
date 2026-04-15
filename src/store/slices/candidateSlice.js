import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Seed data - these are Recuriter-managed entries (not user-applied)
let mockCandidates = [
  { id: '1', userName: 'Rahul Sharma', userId: 'u1', jobId: '1', jobTitle: 'Senior React Developer', resumeUrl: 'https://drive.google.com/file/sample1', status: 'SHORTLISTED', createdAt: '2024-01-15T10:30:00' },
  { id: '2', userName: 'Priya Patel',  userId: 'u2', jobId: '2', jobTitle: 'Backend Java Engineer',  resumeUrl: 'https://drive.google.com/file/sample2', status: 'INTERVIEW_SCHEDULED', createdAt: '2024-01-16T11:00:00' },
  { id: '3', userName: 'Amit Kumar',   userId: 'u3', jobId: '1', jobTitle: 'Senior React Developer', resumeUrl: 'https://drive.google.com/file/sample3', status: 'HIRED',       createdAt: '2024-01-17T09:15:00' },
  { id: '4', userName: 'Sneha Reddy',  userId: 'u4', jobId: '4', jobTitle: 'DevOps Engineer',        resumeUrl: 'https://drive.google.com/file/sample4', status: 'REJECTED',    createdAt: '2024-01-18T14:20:00' },
  { id: '5', userName: 'Vikram Singh', userId: 'u5', jobId: '2', jobTitle: 'Backend Java Engineer',  resumeUrl: 'https://drive.google.com/file/sample5', status: 'APPLIED',     createdAt: '2024-01-19T08:45:00' },
]


export const fetchCandidates = createAsyncThunk('candidates/fetchAll', async ({ page=1, size=5, search, jobCreatedBy}) => {
  await new Promise(r => setTimeout(r, 400))
  console.log("log")
  const res =  await api.get("/candidate/get",{params:{ page, size, search, jobCreatedBy}})
  return res.data;
})

// Called by Recuriter to manually add a candidate entry
export const createCandidate = createAsyncThunk('candidates/create', async (data) => {
  await new Promise(r => setTimeout(r, 400))
  const res = await api.post("/candidate/create",{...data, createdAt: new Date().toISOString() })

  return res.data
})

// Called by a logged-in candidate applying for a job
export const applyForJob = createAsyncThunk('candidates/applyForJob', async ({ job, user, resumeUrl, coverNote }) => {
  await new Promise(r => setTimeout(r, 600))
  const entry = {
    id: `app_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    jobId: job.id,
    jobTitle: job.jobTitle,
    jobLocation: job.location,
    jobSalary: job.salaryRange,
    jobCompany: job.createdBy || 'Company',
    resumeUrl,
    coverNote: coverNote || '',
    status: 'APPLIED',
    createdAt: new Date().toISOString(),
    selfApplied: true,
  }
 
})

export const updateCandidate = createAsyncThunk('candidates/update', async ({ id, data }) => {
  await new Promise(r => setTimeout(r, 400))
  const res = await api.put(`/candidate/update/${id}`,data)
  return res.data;
})

export const deleteCandidate = createAsyncThunk('candidates/delete', async (id) => {
  await new Promise(r => setTimeout(r, 300))
  const res = await api.delete(`/candidate/delete/${id}`)
  return res.data;
})

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: { items: [], totalElements: 0, totalPages: 0, loading: false, error: null, applyLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, s => { s.loading = true })
      .addCase(fetchCandidates.fulfilled, (s, a) => { 
        s.loading      = false
        s.items        = a.payload.data       
        s.totalElements = a.payload.totalElements
        s.totalPages   = a.payload.totalPages
      })
      .addCase(fetchCandidates.rejected, s => { s.loading = false })
      .addCase(createCandidate.fulfilled, (s, a) => { s.items.push(a.payload) })
      .addCase(applyForJob.pending, s => { s.applyLoading = true })
      .addCase(applyForJob.fulfilled, (s, a) => { s.applyLoading = false; s.items.push(a.payload) })
      .addCase(applyForJob.rejected, s => { s.applyLoading = false })
      .addCase(updateCandidate.fulfilled, (s, a) => {
        const idx = s.items.findIndex(c => c.id === a.payload.id)
        if (idx !== -1) s.items[idx] = { ...s.items[idx], ...a.payload }
      })
      .addCase(deleteCandidate.fulfilled, (s, a) => {
        s.items = s.items.filter(c => c.id !== a.payload)
      })
  },
})

export default candidateSlice.reducer
