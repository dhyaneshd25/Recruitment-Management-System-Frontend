import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

let mockInterviews = [
  { id: '1', candidateId: '3', candidateName: 'Amit Kumar', interviewerId: '2', interviewerName: 'Recuriter Manager', interviewDate: '2024-02-01', interviewTime: '10:00', duration: 60, mode: 'VIDEO', meetingLink: 'https://meet.google.com/abc-defg-hij', feedback: 'Strong React fundamentals, good problem-solving skills.', status: 'COMPLETED' },
  { id: '2', candidateId: '2', candidateName: 'Priya Patel', interviewerId: '1', interviewerName: 'Alex Admin', interviewDate: '2024-02-05', interviewTime: '14:00', duration: 45, mode: 'IN_PERSON', meetingLink: '', feedback: '', status: 'SCHEDULED' },
  { id: '3', candidateId: '6', candidateName: 'Anjali Mehta', interviewerId: '2', interviewerName: 'Recuriter Manager', interviewDate: '2024-02-08', interviewTime: '11:00', duration: 30, mode: 'PHONE', meetingLink: '', feedback: '', status: 'SCHEDULED' },
  { id: '4', candidateId: '1', candidateName: 'Rahul Sharma', interviewerId: '1', interviewerName: 'Alex Admin', interviewDate: '2024-01-28', interviewTime: '15:00', duration: 60, mode: 'VIDEO', meetingLink: 'https://meet.google.com/xyz-abcd-efg', feedback: 'Average performance. Needs improvement in system design.', status: 'CANCELLED' },
]

export const fetchInterviews = createAsyncThunk('interviews/fetchAll', async ({ page=1, size=5, search="",candidateCreatedBy }) => {
  await new Promise(r => setTimeout(r, 400))
  const res = await api.get("/interview/get",{ params : { page, size, search, candidateCreatedBy}})
  return res.data;
})

export const createInterview = createAsyncThunk('interviews/create', async (data) => {
  await new Promise(r => setTimeout(r, 400))
  const res = await api.post("/interview/create",data)
  return res.data
})

export const updateInterview = createAsyncThunk('interviews/update', async ({ id, data }) => {
  await new Promise(r => setTimeout(r, 400))
  const res = await api.put(`/interview/update/${id}`,data)
  return res.data;
})

export const deleteInterview = createAsyncThunk('interviews/delete', async (id) => {
  await new Promise(r => setTimeout(r, 300))
  const res = await api.delete(`/interview/delete/${id}`)
  return res.data;
})

const interviewSlice = createSlice({
  name: 'interviews',
  initialState: { items: [], totalElements:0, totalPages:0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, s => { s.loading = true })
      .addCase(fetchInterviews.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.data; s.totalElements = a.payload.totalElements; s.totalPages   = a.payload.totalPages })
      .addCase(fetchInterviews.rejected, s => { s.loading = false })
      .addCase(createInterview.fulfilled, (s, a) => { s.items.push(a.payload) })
      .addCase(updateInterview.fulfilled, (s, a) => {
        const idx = s.items.findIndex(i => i.id === a.payload.id)
        if (idx !== -1) s.items[idx] = { ...s.items[idx], ...a.payload }
      })
      .addCase(deleteInterview.fulfilled, (s, a) => {
        s.items = s.items.filter(i => i.id !== a.payload)
      })
  },
})

export default interviewSlice.reducer
