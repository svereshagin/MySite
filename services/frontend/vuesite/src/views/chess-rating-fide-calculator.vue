<template>
  <div class="page-container">
    <!-- Navigation -->
    <ChessFideNavigation />
    <div class="main-content">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          FIDE Chess Rating Calculator
        </h1>
        <p class="page-subtitle">Калькулятор рейтинга ФИДЕ для шахматных матчей</p>
      </div>

      <!-- Main Content Card -->
      <div class="content-card">

        <!-- Main Player Section -->
        <div class="player-section">
          <div class="section-header">
            <div class="section-icon">
              <User class="icon" />
            </div>
            <h2 class="section-title">Основной игрок</h2>
          </div>

          <div class="player-input">
            <input
              v-model.number="mainPlayer.rating"
              type="number"
              min="1000"
              class="rating-input"
              placeholder="Рейтинг (минимум 1000)"
            />
            <div v-if="mainPlayer.rating" class="rating-display">
              <strong>Текущий рейтинг:</strong> {{ mainPlayer.rating }}
            </div>
          </div>
        </div>

        <!-- Opponents Section -->
        <div class="opponents-section">
          <div class="section-header">
            <div class="section-header-left">
              <div class="section-icon">
                <Users class="icon" />
              </div>
              <h2 class="section-title">Противники</h2>
            </div>
            <button
              @click="addOpponent"
              :disabled="!mainPlayer.rating"
              class="add-button"
            >
              <Plus class="button-icon" />
              <span>Добавить</span>
            </button>
          </div>

          <div class="opponents-content">
            <div v-if="!mainPlayer.rating" class="empty-state">
              Сначала введите рейтинг основного игрока
            </div>

            <div v-else-if="opponents.length === 0" class="empty-state">
              Добавьте противников для расчёта
            </div>

            <div v-else class="opponents-list">
              <div
                v-for="(opponent, index) in opponents"
                :key="opponent.id"
                class="opponent-card"
              >
                <div class="opponent-content">
                  <div class="opponent-header">
                    <div class="opponent-number">
                      <span class="number-text">{{ index + 1 }}</span>
                    </div>
                    <span class="opponent-title">Противник {{ index + 1 }}</span>
                  </div>

                  <div class="opponent-form">
                    <!-- Rating Input -->
                    <div class="form-group">
                      <input
                        v-model.number="opponent.rating"
                        type="number"
                        min="1000"
                        class="opponent-input"
                        placeholder="Рейтинг противника (мин. 1000)"
                      />
                    </div>

                    <!-- Result Selection -->
                    <div class="result-buttons">
                      <button
                        @click="opponent.result = 'win'"
                        :class="['result-button', { active: opponent.result === 'win', win: opponent.result === 'win' }]"
                      >
                        <Crown class="result-icon" />
                        Победа
                      </button>
                      <button
                        @click="opponent.result = 'draw'"
                        :class="['result-button', { active: opponent.result === 'draw', draw: opponent.result === 'draw' }]"
                      >
                        <Minus class="result-icon" />
                        Ничья
                      </button>
                      <button
                        @click="opponent.result = 'loss'"
                        :class="['result-button', { active: opponent.result === 'loss', loss: opponent.result === 'loss' }]"
                      >
                        <X class="result-icon" />
                        Поражение
                      </button>
                    </div>
                  </div>

                  <!-- Match Preview -->
                  <div v-if="opponent.rating && opponent.result" class="match-preview">
                    {{ mainPlayer.rating }} vs {{ opponent.rating }} - {{ getResultText(opponent.result) }}
                  </div>
                </div>

                <!-- Delete Button -->
                <button
                  @click="removeOpponent(index)"
                  class="delete-button"
                >
                  <Trash2 class="delete-icon" />
                </button>
              </div>
            </div>

            <!-- Calculate Button -->
            <div v-if="opponents.length > 0" class="calculate-section">
              <button
                @click="calculateAllMatches"
                :disabled="!canCalculate"
                class="calculate-button"
              >
                <Calculator class="button-icon" />
                <span>Рассчитать ({{ validOpponents.length }}/{{ opponents.length }})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="calculationResults" class="results-section">
          <div class="section-header">
            <div class="section-icon">
              <BarChart3 class="icon" />
            </div>
            <h2 class="section-title">Результаты</h2>
          </div>

          <div class="results-grid">
            <!-- Summary -->
            <div class="results-summary">
              <div class="summary-item">
                <span class="summary-label">Исходный рейтинг:</span>
                <span class="summary-value">{{ calculationResults.initialRating }}</span>
              </div>

              <div class="summary-item">
                <span class="summary-label">Изменение:</span>
                <span :class="['summary-value', 'change-value', {
                  positive: calculationResults.totalChange > 0,
                  negative: calculationResults.totalChange < 0,
                  neutral: calculationResults.totalChange === 0
                }]">
                  {{ calculationResults.totalChange > 0 ? '+' : '' }}{{ calculationResults.totalChange }}
                </span>
              </div>

              <div class="summary-item">
                <span class="summary-label">Новый рейтинг:</span>
                <span class="summary-value new-rating">{{ calculationResults.newRating }}</span>
              </div>

              <div class="stats-item">
                <div class="stats-grid">
                  <span class="stat-win">П: {{ calculationResults.stats.wins }}</span>
                  <span class="stat-draw">Н: {{ calculationResults.stats.draws }}</span>
                  <span class="stat-loss">Пор: {{ calculationResults.stats.losses }}</span>
                </div>
              </div>
            </div>

            <!-- Individual Matches -->
            <div class="matches-details">
              <h3 class="details-title">Детали матчей</h3>
              <div class="matches-list">
                <div
                  v-for="(match, index) in calculationResults.matches"
                  :key="index"
                  class="match-item"
                >
                  <span class="match-opponent">vs {{ match.opponentRating }}</span>
                  <span :class="['match-result', {
                    win: match.result === 'win',
                    draw: match.result === 'draw',
                    loss: match.result === 'loss'
                  }]">
                    {{ getResultText(match.result) }}
                  </span>
                  <span :class="['match-change', {
                    positive: match.ratingChange > 0,
                    negative: match.ratingChange < 0,
                    neutral: match.ratingChange === 0
                  }]">
                    {{ match.ratingChange > 0 ? '+' : '' }}{{ match.ratingChange }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  User, Users, Plus, Crown, Minus, X, Calculator, BarChart3,
  Trash2, Home, FileText, Sun
} from 'lucide-vue-next'

import ChessFideNavigation from "@/components/header/ChessFideNavigation.vue";


// Reactive data
const mainPlayer = ref({
  rating: null
})

const opponents = ref([])
const calculationResults = ref(null)

let nextOpponentId = 1

// Computed properties
const validOpponents = computed(() => {
  return opponents.value.filter(opponent =>
    opponent.rating && opponent.rating >= 1000 && opponent.result
  )
})

const canCalculate = computed(() => {
  return mainPlayer.value.rating && mainPlayer.value.rating >= 1000 && validOpponents.value.length > 0
})

// Methods
const addOpponent = () => {
  opponents.value.push({
    id: nextOpponentId++,
    rating: null,
    result: null
  })
}

const removeOpponent = (index) => {
  opponents.value.splice(index, 1)
}

const getScoreValue = (result) => {
  switch (result) {
    case 'win': return 1
    case 'draw': return 0.5
    case 'loss': return 0
    default: return 0
  }
}

const getResultText = (result) => {
  switch (result) {
    case 'win': return 'Победа'
    case 'draw': return 'Ничья'
    case 'loss': return 'Поражение'
    default: return 'Не определён'
  }
}

const calculateExpectedScore = (rating1, rating2) => {
  const ratingDiff = rating2 - rating1
  return 1 / (1 + Math.pow(10, ratingDiff / 400))
}

const calculateAllMatches = async () => {
  const initialRating = mainPlayer.value.rating

  // Подготовка данных для API
  const enemies = {}
  validOpponents.value.forEach((opponent, index) => {
    enemies[`enemy${index + 1}`] = {
      rating: opponent.rating,
      result: getScoreValue(opponent.result)
    }
  })

  const requestData = {
    hero_rating: initialRating,
    enemies
  }

  try {
    const response = await fetch('http://localhost:8000/chess/calculate-rating-fide/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error('Failed to calculate rating')
    }

    const data = await response.json()

    // Обработка ответа от сервера - только новый рейтинг
    const newRating = data.result
    const totalChange = newRating - initialRating

    // Создаем базовые данные для отображения (без детальной информации по матчам)
    const matches = validOpponents.value.map((opponent) => ({
      opponentRating: opponent.rating,
      result: opponent.result,
      ratingChange: 0 // Сервер не возвращает детали по матчам
    }))

    const stats = {
      wins: validOpponents.value.filter(o => o.result === 'win').length,
      draws: validOpponents.value.filter(o => o.result === 'draw').length,
      losses: validOpponents.value.filter(o => o.result === 'loss').length
    }

    calculationResults.value = {
      initialRating,
      newRating,
      totalChange,
      matches,
      stats
    }
  } catch (error) {
    console.error('Error calculating rating:', error)
    alert('Ошибка при расчёте рейтинга. Проверьте подключение к серверу.')
  }
}
// В секции script setup добавьте валидацию

</script>






<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%);
}

.main-content {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  background: linear-gradient(45deg, white, #bfdbfe);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
}

.content-card {
  backdrop-filter: blur(16px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.player-section {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.icon {
  width: 1rem;
  height: 1rem;
  color: white;
}

.player-input {
  max-width: 20rem;
}

.rating-input {
  width: 100%;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  transition: all 0.2s;
}

.rating-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.rating-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.rating-display {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.opponents-section {
  padding: 1.5rem;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.add-button:disabled {
  background: linear-gradient(45deg, #6b7280, #6b7280);
  cursor: not-allowed;
}

.button-icon {
  width: 1rem;
  height: 1rem;
}

.opponents-content {
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.opponents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.opponent-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.opponent-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.opponent-content {
  flex: 1;
}

.opponent-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.opponent-number {
  width: 1.5rem;
  height: 1.5rem;
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-text {
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}

.opponent-title {
  color: white;
  font-weight: 500;
}

.opponent-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.opponent-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
  color: white;
  transition: all 0.2s;
}

.opponent-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.opponent-input:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.25);
}

.result-buttons {
  display: flex;
  gap: 0.5rem;
}

.result-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.result-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.result-button.active.win {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.result-button.active.draw {
  background: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.result-button.active.loss {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.result-icon {
  width: 0.75rem;
  height: 0.75rem;
  margin-bottom: 0.25rem;
}

.match-preview {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.delete-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.delete-button:hover {
  color: #ef4444;
}

.delete-icon {
  width: 1rem;
  height: 1rem;
}

.calculate-section {
  margin-top: 1rem;
}

.calculate-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.calculate-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.calculate-button:disabled {
  background: linear-gradient(45deg, #6b7280, #6b7280);
  cursor: not-allowed;
}

.results-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.results-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.summary-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.summary-value {
  font-weight: 700;
  color: white;
}

.change-value.positive {
  color: #10b981;
}

.change-value.negative {
  color: #ef4444;
}

.change-value.neutral {
  color: #f59e0b;
}

.new-rating {
  font-size: 1.125rem;
}

.stats-item {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.stats-grid {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.stat-win {
  color: #10b981;
}

.stat-draw {
  color: #f59e0b;
}

.stat-loss {
  color: #ef4444;
}

.matches-details {
  display: flex;
  flex-direction: column;
}

.details-title {
  color: white;
  font-weight: 500;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 12rem;
  overflow-y: auto;
}

.match-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.match-opponent {
  color: rgba(255, 255, 255, 0.8);
}

.match-result.win {
  color: #10b981;
  font-weight: 500;
}

.match-result.draw {
  color: #f59e0b;
  font-weight: 500;
}

.match-result.loss {
  color: #ef4444;
  font-weight: 500;
}

.match-change {
  font-weight: 700;
}

.match-change.positive {
  color: #10b981;
}

.match-change.negative {
  color: #ef4444;
}

.match-change.neutral {
  color: #f59e0b;
}

@media (min-width: 768px) {
  .opponent-form {
    grid-template-columns: 1fr 2fr;
  }

  .results-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .main-content {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
