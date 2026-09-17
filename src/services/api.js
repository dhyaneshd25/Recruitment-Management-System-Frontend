
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const PERSIST_KEY = 'persist:recruitEdge-root'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 100000,
})

// ---------------------------------------------------------------
// Read/write directly against the redux-persist localStorage blob.
// Shape: localStorage['persist:recruitEdge-root'] = JSON string of
// { auth: "<json-string-of-auth-slice>", theme: "...", ... }
// Every value is itself a JSON *string* (redux-persist stores each
// whitelisted slice pre-serialized), so it's parsed twice.
// ---------------------------------------------------------------
function getAuthState() {
  try {
    const root = JSON.parse(localStorage.getItem(PERSIST_KEY) || '{}')
    return JSON.parse(root.auth || '{}')
  } catch {
    return {}
  }
}

function setAuthTokens({ token, refreshToken, user }) {
  try {
    const root = JSON.parse(localStorage.getItem(PERSIST_KEY) || '{}')
    const auth = JSON.parse(root.auth || '{}')

    auth.token = token
    auth.refreshToken = refreshToken
    if (user) auth.user = user
    auth.isAuthenticated = true

    root.auth = JSON.stringify(auth)
    localStorage.setItem(PERSIST_KEY, JSON.stringify(root))
  } catch (e) {
    console.error('Failed to persist refreshed tokens', e)
  }
}

function clearAuthState() {
  try {
    const root = JSON.parse(localStorage.getItem(PERSIST_KEY) || '{}')
    const auth = JSON.parse(root.auth || '{}')

    auth.token = null
    auth.refreshToken = null
    auth.user = null
    auth.isAuthenticated = false

    root.auth = JSON.stringify(auth)
    localStorage.setItem(PERSIST_KEY, JSON.stringify(root))
  } catch {
    localStorage.removeItem(PERSIST_KEY)
  }
}

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const { token } = getAuthState()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ---- Refresh coordination (prevents parallel refresh calls) ----
let isRefreshing = false
let pendingRequests = []

function queueRequest(callback) {
  pendingRequests.push(callback)
}

function resolveQueue(newToken) {
  pendingRequests.forEach((cb) => cb(newToken))
  pendingRequests = []
}

// Response interceptor - handle auth errors + silent refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const errorCode = error.response?.data?.error

    const isExpired = error.response?.status === 401 && errorCode === 'TOKEN_EXPIRED'

    if (isExpired && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queueRequest((newToken) => {
            if (!newToken) return reject(error)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { refreshToken } = getAuthState()
        if (!refreshToken) throw new Error('No refresh token available')

        // Plain axios, not `api` - avoids re-triggering this same interceptor
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, refreshToken)
        // const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        //   refreshToken,
        // })

        setAuthTokens({
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.userD,
        })

        resolveQueue(data.token)
        isRefreshing = false

        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        resolveQueue(null)
        clearAuthState()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Any other 401 (bad token, no token, or refresh itself failed)
    if (error.response?.status === 401) {
      clearAuthState()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api



// import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 10000,
// })

// // ---------------------------------------------------------------
// // Store injection - call injectStore(store) once from main.jsx,
// // right after `store` is created.
// //
// // IMPORTANT: this file does NOT import authSlice.js. Your
// // authSlice.js imports `api` from this file (for the thunks), so
// // importing authSlice's action creators back here would create a
// // circular import - one of the two imports ends up `undefined` at
// // runtime. Instead we dispatch plain action objects using Redux
// // Toolkit's auto-generated type strings ('auth/setCredentials',
// // 'auth/logout') - these hit the exact same reducer cases in
// // authSlice.js without ever importing that file.
// // ---------------------------------------------------------------
// let store

// export const injectStore = (_store) => {
//   store = _store
// }

// // Request interceptor - attach JWT token from live Redux state
// api.interceptors.request.use(
//   (config) => {
//     // const token = store?.getState()?.auth?.token
  
//     const persistedState = JSON.parse(localStorage.getItem('persist:recruitEdge-root') || '{}')
//     const authState = JSON.parse(persistedState.auth || '{}')
//     const token = authState.token

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// // ---- Refresh coordination (prevents parallel refresh calls) ----
// let isRefreshing = false
// let pendingRequests = []

// function queueRequest(callback) {
//   pendingRequests.push(callback)
// }

// function resolveQueue(newToken) {
//   pendingRequests.forEach((cb) => cb(newToken))
//   pendingRequests = []
// }

// // Response interceptor - handle auth errors + silent refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config
//     const errorCode = error.response?.data?.error

//     const isExpired = error.response?.status === 401 && errorCode === 'TOKEN_EXPIRED'

//     if (isExpired && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           queueRequest((newToken) => {
//             if (!newToken) return reject(error)
//             originalRequest.headers.Authorization = `Bearer ${newToken}`
//             resolve(api(originalRequest))
//           })
//         })
//       }

//       originalRequest._retry = true
//       isRefreshing = true

//       try {
//         const persistedState = JSON.parse(localStorage.getItem('persist:recruitEdge-root') || '{}')
//         const authState = JSON.parse(persistedState.auth || '{}')
//         const refreshToken = authState.refreshToken
//         // const refreshToken = store?.getState()?.auth?.refreshToken
//         if (!refreshToken) throw new Error('No refresh token available')

//         // Plain axios, not `api` - avoids re-triggering this same interceptor
//         const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//           refreshToken,
//         })

//         store.dispatch({
//           type: 'auth/setCredentials',
//           payload: {
//             token: data.token,
//             refreshToken: data.refreshToken,
//             user: data.userD,
//           },
//         })

//         resolveQueue(data.token)
//         isRefreshing = false

//         originalRequest.headers.Authorization = `Bearer ${data.token}`
//         return api(originalRequest)
//       } catch (refreshError) {
//         isRefreshing = false
//         resolveQueue(null)
//         store?.dispatch({ type: 'auth/logout' })
//         window.location.href = '/login'
//         return Promise.reject(refreshError)
//       }
//     }

//     // Any other 401 (bad token, no token, or refresh itself failed)
//     if (error.response?.status === 401) {
//       store?.dispatch({ type: 'auth/logout' })
//       window.location.href = '/login'
//     }

//     return Promise.reject(error)
//   }
// )

// export default api





// import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 10000,
// })

// // Request interceptor - attach JWT token
// api.interceptors.request.use(
//   (config) => {
//     const persistedState = JSON.parse(localStorage.getItem('persist:recruitEdge-root') || '{}')
//     const authState = JSON.parse(persistedState.auth || '{}')
//     const token = authState.token
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// // Response interceptor - handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('persist:recruitEdge-root')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )

// export default api
