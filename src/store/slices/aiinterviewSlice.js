import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchAiQuestions = createAsyncThunk(
  'aiinterview/fetchQuestions',
  async ({ role, experience }, { rejectWithValue }) => {
    try {
      const res = await api.post('/aiinterview/questions', { role, experience })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not load questions. Please try again.')
    }
  }
)

export const submitAiAnswers = createAsyncThunk(
  'aiinterview/submitAnswers',
  async ({ role, experience, answers }, { rejectWithValue }) => {
    try {
      const res = await api.post('/aiinterview/submit', { role, experience, answers })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not score your interview. Please try again.')
    }
  }
)

const initialState = {
  questions: [],
  result: null,
  loadingQuestions: false,
  submittingAnswers: false,
  loadError: null,
  submitError: null,
}

const aiinterviewSlice = createSlice({
  name: 'aiinterview',
  initialState,
  reducers: {
    resetAiInterview: (state) => {
      state.questions = []
      state.result = null
      state.loadingQuestions = false
      state.submittingAnswers = false
      state.loadError = null
      state.submitError = null
    },
    clearAiErrors: (state) => {
      state.loadError = null
      state.submitError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchAiQuestions.pending, (state) => {
        state.loadingQuestions = true
        state.loadError = null
        state.questions = []
        state.result = null
      })
      .addCase(fetchAiQuestions.fulfilled, (state, action) => {
        state.loadingQuestions = false
        state.questions = action.payload || []
      })
      .addCase(fetchAiQuestions.rejected, (state, action) => {
        state.loadingQuestions = false
        state.loadError = action.payload || 'Could not load questions. Please try again.'
      })
      // Submit Answers
      .addCase(submitAiAnswers.pending, (state) => {
        state.submittingAnswers = true
        state.submitError = null
      })
      .addCase(submitAiAnswers.fulfilled, (state, action) => {
        state.submittingAnswers = false
        state.result = action.payload
      })
      .addCase(submitAiAnswers.rejected, (state, action) => {
        state.submittingAnswers = false
        state.submitError = action.payload || 'Could not score your interview. Please try again.'
      })
  },
})

export const { resetAiInterview, clearAiErrors } = aiinterviewSlice.actions
export default aiinterviewSlice.reducer
