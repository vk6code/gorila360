import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

// Estado global de autenticación
const token = ref(localStorage.getItem('auth_token') || null)
const user = ref(null)

// Inicializar usuario desde token
if (token.value) {
  try {
    user.value = jwtDecode(token.value)
  } catch (error) {
    console.error('Token inválido:', error)
    localStorage.removeItem('auth_token')
    token.value = null
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
      try {
        user.value = jwtDecode(newToken)
      } catch (error) {
        console.error('Error decodificando token:', error)
      }
    } else {
      localStorage.removeItem('auth_token')
      user.value = null
    }
  }

  const logout = () => {
    setToken(null)
    window.location.href = '/login'
  }

  const loginWithGoogle = () => {
    window.location.href = '/auth/google'
  }

  return {
    token: computed(() => token.value),
    user: computed(() => user.value),
    isAuthenticated,
    setToken,
    logout,
    loginWithGoogle,
  }
}
