import { ref, computed, onMounted, watch } from "vue"

export function useBlog() {
  // Реактивные данные
  const articles = ref([])
  const categories = ref([])
  const popularPosts = ref([])
  const popularTags = ref([])

  const searchQuery = ref("")
  const selectedCategory = ref("all")
  const currentPage = ref(1)
  const isLoading = ref(false)

  const articlesPerPage = 6

  // Вычисляемые свойства
  const filteredArticles = computed(() => {
    let filtered = articles.value

    // Фильтр по категории
    if (selectedCategory.value !== "all") {
      filtered = filtered.filter((article) => article.category.toLowerCase() === selectedCategory.value.toLowerCase())
    }

    // Поиск
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          article.author.name.toLowerCase().includes(query),
      )
    }

    return filtered
  })

  const totalPages = computed(() => Math.ceil(filteredArticles.value.length / articlesPerPage))

  const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * articlesPerPage
    const end = start + articlesPerPage
    return filteredArticles.value.slice(start, end)
  })

  // Методы для работы с API
  const fetchArticles = async () => {
    isLoading.value = true
    try {
      // Здесь будет реальный API запрос
      // const response = await fetch('/api/articles')
      // const data = await response.json()

      // Моковые данные для демонстрации
      await new Promise((resolve) => setTimeout(resolve, 1000))

      articles.value = [
        {
          id: 1,
          title: "Getting Started with Vue.js 3 Composition API",
          slug: "2024/01/getting-started-with-vue-js-3",
          excerpt:
            "Learn how to use Vue.js 3 composition API with practical examples and best practices for modern web development.",
          content: "Vue.js 3 introduced the composition API...",
          image: "/placeholder.svg?height=200&width=300",
          category: "Development",
          tags: ["vue", "javascript", "frontend", "composition-api"],
          author: {
            name: "John Doe",
            slug: "john-doe",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          publishedAt: "2024-01-15",
          readTime: 5,
          views: 1250,
        },
        {
          id: 2,
          title: "Building Scalable REST APIs with Python FastAPI",
          slug: "2024/01/building-scalable-apis-with-python",
          excerpt:
            "Complete guide to building robust and scalable REST APIs using Python FastAPI framework with authentication.",
          content: "FastAPI is a modern, fast web framework...",
          image: "/placeholder.svg?height=200&width=300",
          category: "Backend",
          tags: ["python", "api", "backend", "fastapi"],
          author: {
            name: "Jane Smith",
            slug: "jane-smith",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          publishedAt: "2024-01-10",
          readTime: 8,
          views: 890,
        },
        {
          id: 3,
          title: "JavaScript ES2024 New Features Deep Dive",
          slug: "2024/01/javascript-es2024-new-features",
          excerpt: "Explore the latest JavaScript features introduced in ES2024 specification with practical examples.",
          content: "JavaScript continues to evolve...",
          image: "/placeholder.svg?height=200&width=300",
          category: "JavaScript",
          tags: ["javascript", "es2024", "features", "modern-js"],
          author: {
            name: "Mike Johnson",
            slug: "mike-johnson",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          publishedAt: "2024-01-05",
          readTime: 6,
          views: 654,
        },
        {
          id: 4,
          title: "My Journey into Web Development",
          slug: "2024/01/my-journey-into-web-development",
          excerpt:
            "A personal story about transitioning from a different career into web development and lessons learned.",
          content: "Two years ago, I was working in...",
          image: "/placeholder.svg?height=200&width=300",
          category: "Personal",
          tags: ["career", "story", "motivation", "beginners"],
          author: {
            name: "John Doe",
            slug: "john-doe",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          publishedAt: "2024-01-01",
          readTime: 4,
          views: 432,
        },
      ]
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      // Подсчитываем статьи по категориям
      const categoryCount = {}
      articles.value.forEach((article) => {
        categoryCount[article.category] = (categoryCount[article.category] || 0) + 1
      })

      categories.value = [
        { name: "All", slug: "all", count: articles.value.length },
        ...Object.entries(categoryCount).map(([name, count]) => ({
          name,
          slug: name.toLowerCase(),
          count,
        })),
      ]
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchPopularContent = async () => {
    try {
      // Популярные статьи (по просмотрам)
      popularPosts.value = [...articles.value]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          image: article.image,
          publishedAt: article.publishedAt,
        }))

      // Популярные теги
      const tagCount = {}
      articles.value.forEach((article) => {
        article.tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      })

      popularTags.value = Object.entries(tagCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          count,
        }))
    } catch (error) {
      console.error("Failed to fetch popular content:", error)
    }
  }

  // Сброс пагинации при изменении фильтров
  const resetPagination = () => {
    currentPage.value = 1
  }

  // Отслеживание изменений фильтров
  const watchFilters = () => {
    watch([searchQuery, selectedCategory], resetPagination)
  }

  // Инициализация
  onMounted(async () => {
    await fetchArticles()
    await fetchCategories()
    await fetchPopularContent()
    watchFilters()
  })

  return {
    // Реактивные данные
    articles,
    searchQuery,
    selectedCategory,
    currentPage,
    isLoading,

    // Вычисляемые свойства
    filteredArticles,
    paginatedArticles,
    totalPages,

    // Данные для компонентов
    categories,
    popularPosts,
    popularTags,

    // Методы
    fetchArticles,
    fetchCategories,
    fetchPopularContent,
    resetPagination,
    watchFilters,
  }
}
