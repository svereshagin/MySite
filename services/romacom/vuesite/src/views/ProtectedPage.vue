<template>
  <div class="protected-container">
    <div class="protected-content">
      <div class="success-message">
        <h1 class="page-title">✓ Авторизация успешна</h1>
        <p class="success-text">Добро пожаловать! Вы можете загружать файлы.</p>
      </div>

      <form @submit.prevent="submitForm" class="upload-form">
        <div class="form-group">
          <label for="title" class="form-label">Название</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            maxlength="50"
            class="form-input"
            placeholder="Введите название (до 50 символов)"
            required
          />
          <div class="char-counter">{{ formData.title.length }}/50</div>
        </div>

        <div class="form-group">
          <label for="file" class="form-label">Файл</label>
          <input
            id="file"
            ref="fileInput"
            type="file"
            class="form-input file-input"
            @change="handleFileChange"
            required
          />
          <div class="file-info" v-if="selectedFile">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
          </div>
          <div class="file-limit">Максимальный размер: 5 МБ</div>
        </div>

        <div class="form-group">
          <label for="comment" class="form-label">Комментарий</label>
          <textarea
            id="comment"
            v-model="formData.comment"
            class="form-textarea"
            rows="4"
            maxlength="500"
            placeholder="Добавьте комментарий (до 500 символов)"
          ></textarea>
          <div class="char-counter">{{ formData.comment.length }}/500</div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button" :disabled="loading || !isFormValid">
            {{ loading ? 'Отправка...' : 'Отправить' }}
          </button>

          <button type="button" @click="handleLogout" class="logout-button">
            Выйти
          </button>
        </div>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="successMessage" class="success-response">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { makeAuthenticatedRequest, logout } from '../utils/auth.ts'

export default {
  name: 'ProtectedPage',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const selectedFile = ref(null)
    const fileInput = ref(null)

    const formData = reactive({
      title: '',
      comment: ''
    })

    const isFormValid = computed(() => {
      return formData.title.trim() && selectedFile.value && selectedFile.value.size <= 5 * 1024 * 1024
    })

    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          error.value = 'Файл слишком большой. Максимальный размер: 5 МБ'
          fileInput.value.value = ''
          selectedFile.value = null
          return
        }
        selectedFile.value = file
        error.value = ''
      }
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const submitForm = async () => {
      loading.value = true
      error.value = ''
      successMessage.value = ''

      try {
        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('file', selectedFile.value)
        formDataToSend.append('comment', formData.comment)

        const response = await makeAuthenticatedRequest('http://localhost:8000/api/v1/classwork/', {
          method: 'POST',
          body: formDataToSend
        })

        if (response.ok) {
          successMessage.value = 'Файл успешно отправлен!'
          formData.title = ''
          formData.comment = ''
          selectedFile.value = null
          fileInput.value.value = ''
        } else {
          const data = await response.json()
          error.value = `Ошибка: ${data.detail || data.error || 'Неизвестная ошибка'}`
        }
      } catch (err) {
        error.value = `Ошибка сети: ${err.message}`
      } finally {
        loading.value = false
      }
    }

    const handleLogout = async () => {
      try {
        await logout()
        router.push('/login')
      } catch (err) {
        console.error('Logout error:', err)
        router.push('/login')
      }
    }

    return {
      loading,
      error,
      successMessage,
      formData,
      selectedFile,
      fileInput,
      isFormValid,
      handleFileChange,
      formatFileSize,
      submitForm,
      handleLogout
    }
  }
}
</script>

<style scoped>
.protected-container {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 2rem;
}

.protected-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 32rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 0.5rem;
}

.success-text {
  color: #15803d;
  margin: 0;
}

.upload-form {
  space-y: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.file-input {
  padding: 0.5rem;
}

.char-counter {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
  margin-top: 0.25rem;
}

.file-info {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.file-name {
  font-weight: 500;
}

.file-size {
  color: #6b7280;
  margin-left: 0.5rem;
}

.file-limit {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button {
  flex: 1;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.success-response {
  padding: 0.75rem;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.375rem;
  color: #166534;
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>
