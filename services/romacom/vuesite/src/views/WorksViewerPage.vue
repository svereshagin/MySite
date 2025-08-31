<template>
  <div class="works-viewer">
    <div class="header">
      <h1>Просмотр работ участников</h1>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>

    <!-- Username input section -->
    <div class="search-section">
      <div class="username-input">
        <label for="username">Имя пользователя:</label>
        <input
          id="username"
          v-model="searchUsername"
          type="text"
          placeholder="Введите username"
          @keyup.enter="loadUserWorks"
        />
        <button @click="loadUserWorks" :disabled="loading || !searchUsername.trim()">
          {{ loading ? 'Загрузка...' : 'Найти работы' }}
        </button>
      </div>

      <!-- File search -->
      <div class="file-search" v-if="allFiles.length > 0">
        <label for="file-search">Поиск по файлам:</label>
        <input
          id="file-search"
          v-model="fileSearchQuery"
          type="text"
          placeholder="Поиск файлов..."
        />
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      Загрузка работ пользователя...
    </div>

    <!-- Works display -->
    <div v-if="!loading && allFiles.length > 0" class="works-container">
      <div class="works-grid">
        <div
          v-for="file in filteredFiles"
          :key="file.id"
          class="work-card"
        >
          <div class="work-header">
            <h3 class="work-title">{{ file.title }}</h3>
          </div>
          <div class="work-content">
            <p class="work-comment">{{ file.comment }}</p>
            <div class="work-meta">
              <span class="file-name">{{ file.file_name }}</span>
              <span class="file-size">{{ formatFileSize(file.file_size) }}</span>
              <span class="file-date">{{ formatDate(file.created_at) }}</span>
            </div>
          </div>
          <div class="work-actions">
            <button @click="openFile(file)" class="open-file-btn">
              Открыть файл
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No files message -->
    <div v-if="!loading && searchUsername && allFiles.length === 0 && !error" class="no-files">
      <p>Файлы для пользователя "{{ searchUsername }}" не найдены</p>
    </div>

    <!-- File viewing modal -->
    <div v-if="viewingFile" class="file-modal" @click="closeFileModal">
      <div class="file-modal-content" @click.stop>
        <div class="file-modal-header">
          <h4>{{ viewingFile.title }}</h4>
          <button @click="closeFileModal" class="close-btn">×</button>
        </div>
        <div class="file-modal-body">
          <div v-if="isTextFile && fileTextContent" class="text-file-container">
            <div class="file-info">
              <span class="file-name">{{ viewingFile.file_name }}</span>
              <span class="file-type">{{ getFileExtension(viewingFile.file_name) }}</span>
            </div>
            <pre class="text-file-content"><code>{{ fileTextContent }}</code></pre>
          </div>
          <iframe
            :src="fileViewUrl"
            class="file-frame"
            v-else-if="fileViewUrl && !isTextFile"
          ></iframe>
          <div v-else class="loading-file">
            Загрузка файла...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { makeAuthenticatedRequest, logout as authLogout } from '../utils/auth.ts'

export default {
  name: 'WorksViewerPage',
  setup() {
    const router = useRouter()

    // Reactive data
    const searchUsername = ref('')
    const currentUsername = ref('')
    const fileSearchQuery = ref('')
    const allFiles = ref([])
    const viewingFile = ref(null)
    const fileViewUrl = ref('')
    const fileTextContent = ref('')
    const isTextFile = ref(false)
    const loading = ref(false)
    const error = ref('')
    const totalCount = ref(0)

    // Function to determine if file is text-based
    const getTextFileExtensions = () => {
      return [
        'py', 'js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'htm', 'css', 'scss', 'sass',
        'json', 'xml', 'yaml', 'yml', 'md', 'txt', 'log', 'csv', 'sql', 'sh', 'bat',
        'php', 'rb', 'go', 'rs', 'cpp', 'c', 'h', 'java', 'kt', 'swift', 'dart',
        'r', 'scala', 'clj', 'hs', 'elm', 'ex', 'exs', 'pl', 'pm', 'lua', 'vim',
        'gitignore', 'dockerfile', 'makefile', 'readme', 'license', 'changelog'
      ]
    }

    const getFileExtension = (filename) => {
      if (!filename) return ''
      const parts = filename.split('.')
      return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
    }

    const isFileTextBased = (filename) => {
      const extension = getFileExtension(filename)
      const textExtensions = getTextFileExtensions()
      return textExtensions.includes(extension) || !extension
    }

    // Computed properties
    const filteredFiles = computed(() => {
      if (!fileSearchQuery.value.trim()) {
        return allFiles.value
      }

      const query = fileSearchQuery.value.toLowerCase()
      return allFiles.value.filter(file =>
        file.title.toLowerCase().includes(query) ||
        file.comment.toLowerCase().includes(query) ||
        file.file_name.toLowerCase().includes(query)
      )
    })

    // Methods
    const loadUserWorks = async () => {
      if (!searchUsername.value.trim()) return

      loading.value = true
      error.value = ''
      allFiles.value = []
      viewingFile.value = null
      fileViewUrl.value = ''

      try {
        console.log('[v0] Loading works for user:', searchUsername.value)

        const token = sessionStorage.getItem('access_token')
        console.log('[v0] Current access token exists:', !!token)
        console.log('[v0] Token preview:', token ? token.substring(0, 20) + '...' : 'No token')

        const response = await makeAuthenticatedRequest(`/api/v1/classwork/?username_str=${encodeURIComponent(searchUsername.value)}`, {
          method: 'GET'
        })

        console.log('[v0] Response status:', response.status)
        console.log('[v0] Response ok:', response.ok)

        if (response.ok) {
          const result = await response.json()
          console.log('[v0] Received works data:', result)

          allFiles.value = result.data?.data || []
          totalCount.value = result.data?.total_count || 0
          currentUsername.value = searchUsername.value
        } else {
          const errorData = await response.json()
          console.log('[v0] Error response:', errorData)
          error.value = errorData.detail || 'Ошибка при загрузке работ'
        }
      } catch (err) {
        console.error('[v0] Error loading works:', err)
        error.value = 'Ошибка сети при загрузке работ'
      } finally {
        loading.value = false
      }
    }

    const openFile = async (file) => {
      console.log('[v0] Opening file:', file)
      console.log('[v0] File path:', file.file_path)
      console.log('[v0] File name:', file.file_name)

      viewingFile.value = file
      fileViewUrl.value = ''
      fileTextContent.value = ''
      isTextFile.value = isFileTextBased(file.file_name)

      try {
        const url = `/api/v1/classwork/view/?file_path=${encodeURIComponent(file.file_path)}`
        console.log('[v0] Request URL:', url)
        console.log('[v0] Is text file:', isTextFile.value)

        const response = await makeAuthenticatedRequest(url, {
          method: 'GET'
        })

        console.log('[v0] Response status:', response.status)
        console.log('[v0] Response headers:', response.headers)
        console.log('[v0] Content-Type:', response.headers.get('content-type'))

        if (response.ok) {
          if (isTextFile.value) {
            const textContent = await response.text()
            console.log('[v0] Text content length:', textContent.length)

            if (textContent.length === 0) {
              console.log('[v0] Empty text file received')
              error.value = 'Файл пустой'
              viewingFile.value = null
              return
            }

            fileTextContent.value = textContent
            console.log('[v0] Text file loaded successfully')
          } else {
            const blob = await response.blob()
            console.log('[v0] Blob size:', blob.size)
            console.log('[v0] Blob type:', blob.type)

            if (blob.size === 0) {
              console.log('[v0] Empty blob received')
              error.value = 'Файл пустой или не найден'
              viewingFile.value = null
              return
            }

            fileViewUrl.value = URL.createObjectURL(blob)
            console.log('[v0] Created blob URL:', fileViewUrl.value)
          }
        } else {
          const errorText = await response.text()
          console.log('[v0] Error response text:', errorText)
          error.value = 'Не удалось загрузить файл'
          viewingFile.value = null
        }
      } catch (err) {
        console.error('[v0] Error opening file:', err)
        error.value = 'Ошибка при открытии файла'
        viewingFile.value = null
      }
    }

    const closeFileModal = () => {
      if (fileViewUrl.value) {
        URL.revokeObjectURL(fileViewUrl.value)
      }
      viewingFile.value = null
      fileViewUrl.value = ''
      fileTextContent.value = ''
      isTextFile.value = false
    }

    const formatFileSize = (bytes) => {
      if (!bytes) return '0 B'

      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }

    const logout = async () => {
      await authLogout()
      router.push('/login')
    }

    return {
      searchUsername,
      currentUsername,
      fileSearchQuery,
      allFiles,
      viewingFile,
      fileViewUrl,
      fileTextContent,
      isTextFile,
      loading,
      error,
      totalCount,
      filteredFiles,
      loadUserWorks,
      openFile,
      closeFileModal,
      formatFileSize,
      formatDate,
      logout,
      getFileExtension
    }
  }
}
</script>

<style scoped>
.works-viewer {
  min-height: 100vh;
  background: #1a1a1a;
  color: #ffffff;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}

.header h1 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background: #c82333;
}

.search-section {
  background: #2d2d2d;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.username-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.username-input label {
  min-width: 140px;
  font-weight: 500;
}

.username-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 14px;
}

.username-input input:focus {
  outline: none;
  border-color: #007bff;
}

.username-input button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.username-input button:hover:not(:disabled) {
  background: #0056b3;
}

.username-input button:disabled {
  background: #555;
  cursor: not-allowed;
}

.file-search {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-search label {
  min-width: 140px;
  font-weight: 500;
}

.file-search input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 14px;
}

.file-search input:focus {
  outline: none;
  border-color: #28a745;
}

.error {
  background: #dc3545;
  color: white;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 16px;
}

.works-container {
  margin-top: 20px;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.work-card {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #555;
  transition: transform 0.2s, box-shadow 0.2s;
}

.work-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.work-header {
  margin-bottom: 15px;
}

.work-title {
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.work-content {
  margin-bottom: 20px;
}

.work-comment {
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 15px 0;
  min-height: 40px;
}

.work-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #888;
}

.file-name {
  font-weight: 500;
  color: #aaa;
}

.work-actions {
  display: flex;
  justify-content: center;
}

.open-file-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.open-file-btn:hover {
  background: #0056b3;
}

.no-files {
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 16px;
}

.file-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.file-modal-content {
  background: #2d2d2d;
  border-radius: 8px;
  width: 90%;
  height: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}

.file-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #555;
}

.file-modal-header h4 {
  margin: 0;
  color: #ffffff;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #ffffff;
}

.file-modal-body {
  flex: 1;
  padding: 20px;
}

.file-frame {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
  background: #ffffff;
}

.loading-file {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  font-size: 16px;
}

.text-file-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: #1a1a1a;
  border-radius: 4px;
  border: 1px solid #555;
}

.file-info .file-name {
  font-weight: 600;
  color: #ffffff;
}

.file-info .file-type {
  background: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.text-file-content {
  flex: 1;
  margin: 0;
  padding: 20px;
  background: #1a1a1a;
  border: 1px solid #555;
  border-radius: 4px;
  color: #ffffff;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.text-file-content code {
  background: none;
  padding: 0;
  color: inherit;
  font-family: inherit;
}

.text-file-content {
  --keyword-color: #ff7b72;
  --string-color: #a5d6ff;
  --comment-color: #8b949e;
  --number-color: #79c0ff;
}
</style>
