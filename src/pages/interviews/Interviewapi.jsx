import api from '../../services/api' // adjust path to match where you save this file

export async function fetchQuestions(role, experience) {
  const { data } = await api.post('/aiinterview/questions', { role, experience })
  return data // array of { id, text }
}

export async function submitAnswers(role, experience, answers) {
  // answers: [{ questionId, question, answer }]
  const { data } = await api.post('/aiinterview/submit', { role, experience, answers })
  return data // { overallScore, overallFeedback, perQuestion: [...] }
}