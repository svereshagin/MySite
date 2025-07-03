export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Если меньше недели - показываем относительное время
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`

  // Иначе показываем дату
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Форматирование количества просмотров
 */
export const formatViews = (views) => {
  if (views < 1000) return views.toString()
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
  return `${(views / 1000000).toFixed(1)}M`
}

/**
 * Генерация slug из заголовка
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Удаляем специальные символы
    .replace(/\s+/g, "-") // Заменяем пробелы на дефисы
    .replace(/-+/g, "-") // Убираем множественные дефисы
    .trim("-") // Убираем дефисы в начале и конце
}

/**
 * Подсчет времени чтения
 */
export const calculateReadTime = (content) => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Обрезка текста с сохранением слов
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text

  const truncated = text.substr(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  return lastSpace > 0 ? truncated.substr(0, lastSpace) + "..." : truncated + "..."
}

/**
 * Извлечение первого изображения из контента
 */
export const extractFirstImage = (content) => {
  const imgRegex = /<img[^>]+src="([^">]+)"/
  const match = content.match(imgRegex)
  return match ? match[1] : null
}

/**
 * Подсветка найденного текста
 */
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text

  const regex = new RegExp(`(${searchTerm})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

/**
 * Валидация email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Debounce функция
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Группировка статей по дате
 */
export const groupArticlesByDate = (articles) => {
  const groups = {}

  articles.forEach((article) => {
    const date = new Date(article.publishedAt)
    const monthYear = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })

    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(article)
  })

  return groups
}

/**
 * Получение цвета для категории
 */
export const getCategoryColor = (category) => {
  const colors = {
    development: "#3b82f6",
    javascript: "#f59e0b",
    backend: "#10b981",
    frontend: "#8b5cf6",
    personal: "#ef4444",
    tutorial: "#06b6d4",
    news: "#f97316",
  }

  return colors[category.toLowerCase()] || "#6b7280"
}
