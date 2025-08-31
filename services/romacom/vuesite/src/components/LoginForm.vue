<template>
  <div class="login-container">
    <div class="login-form">
      <h2 class="login-title">Вход</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login" class="form-label">Логин</label>
          <input
            id="login"
            v-model="login"
            type="text"
            class="form-input"
            placeholder="Логин"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <div class="password-container">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input password-input"
              placeholder="Пароль"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              <span v-if="showPassword">👁️</span>
              <span v-else>👁️‍🗨️</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="submit-button"
        >
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const login = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const emit = defineEmits(['login-success'])

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const formData = new URLSearchParams()
    formData.append('grant_type', 'password')
    formData.append('username', login.value)
    formData.append('password', password.value)

    console.log('[v0] Attempting login for user:', login.value)

    const response = await fetch('http://localhost:8000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include' // Important: includes cookies for refresh token
    })

    const data = await response.json()
    console.log('[v0] Login response:', response.status, data)

    if (response.ok) {
      sessionStorage.setItem('access_token', data.access_token)
      console.log('[v0] Token saved to sessionStorage:', !!sessionStorage.getItem('access_token'))
      success.value = 'Успешный вход!'
      setTimeout(() => {
        console.log('[v0] Emitting login-success event')
        emit('login-success')
      }, 1000)
    } else {
      error.value = data.error_description || data.error || 'Ошибка входа'
    }
  } catch (err) {
    console.error('[v0] Login error:', err)
    error.value = 'Ошибка сети'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111827;
  padding: 1rem;
}

.login-form {
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 24rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: #f9fafb;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  background-color: #374151;
  color: #f9fafb;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.password-container {
  position: relative;
}

.password-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1rem;
}

.password-toggle:hover {
  color: #d1d5db;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.375rem;
  color: #16a34a;
  font-size: 0.875rem;
  text-align: center;
}
</style>
