import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

let mockInterviews = [
  { id: '1', candidateId: '3', candidateName: 'Amit Kumar', interviewerId: '2', interviewerName: 'HR Manager', interviewDate: '2024-02-01', interviewTime: '10:00', duration: 60, mode: 'VIDEO', meetingLink: 'https://meet.google.com/abc-defg-hij', feedback: 'Strong React fundamentals, good problem-solving skills.', status: 'COMPLETED' },
  { id: '2', candidateId: '2', candidateName: 'Priya Patel', interviewerId: '1', interviewerName: 'Alex Admin', interviewDate: '2024-02-05', interviewTime: '14:00', duration: 45, mode: 'IN_PERSON', meetingLink: '', feedback: '', status: 'SCHEDULED' },
  { id: '3', candidateId: '6', candidateName: 'Anjali Mehta', interviewerId: '2', interviewerName: 'HR Manager', interviewDate: '2024-02-08', interviewTime: '11:00', duration: 30, mode: 'PHONE', meetingLink: '', feedback: '', status: 'SCHEDULED' },
  { id: '4', candidateId: '1', candidateName: 'Rahul Sharma', interviewerId: '1', interviewerName: 'Alex Admin', interviewDate: '2024-01-28', interviewTime: '15:00', duration: 60, mode: 'VIDEO', meetingLink: 'https://meet.google.com/xyz-abcd-efg', feedback: 'Average performance. Needs improvement in system design.', status: 'CANCELLED' },
]

export const fetchInterviews = createAsyncThunk('interviews/fetchAll', async () => {
  await new Promise(r => setTimeout(r, 400))
  return [...mockInterviews]
})

export const createInterview = createAsyncThunk('interviews/create', async (data) => {
  await new Promise(r => setTimeout(r, 400))
  const newInterview = { ...data, id: String(Date.now()) }
  mockInterviews.push(newInterview)
  return newInterview
})

export const updateInterview = createAsyncThunk('interviews/update', async ({ id, data }) => {
  await new Promise(r => setTimeout(r, 400))
  mockInterviews = mockInterviews.map(i => i.id === id ? { ...i, ...data } : i)
  return { id, ...data }
})

export const deleteInterview = createAsyncThunk('interviews/delete', async (id) => {
  await new Promise(r => setTimeout(r, 300))
  mockInterviews = mockInterviews.filter(i => i.id !== id)
  return id
})

const interviewSlice = createSlice({
  name: 'interviews',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, s => { s.loading = true })
      .addCase(fetchInterviews.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
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
