<template>
  <div class="calendar-container">
    <!-- Background Image -->
    <div
      class="background-image"
      :style="{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop)' }"
    ></div>

    <!-- Navigation -->
    <header :class="['header', { 'header-loaded': isLoaded }]">
      <div class="header-left">
        <Menu class="icon" />
        <span class="logo">Calendar</span>
      </div>
      <div class="header-right">
        <div class="search-container">
          <Search class="search-icon" />
          <input
            type="text"
            placeholder="Search"
            class="search-input"
          />
        </div>
        <Settings class="icon" />
        <div class="user-avatar">U</div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Sidebar -->
      <div :class="['sidebar', { 'sidebar-loaded': isLoaded }]">
        <div class="sidebar-content">
          <button class="create-button">
            <Plus class="button-icon" />
            <span>Create</span>
          </button>

          <!-- Mini Calendar -->
          <div class="mini-calendar">
            <div class="mini-calendar-header">
              <h3 class="mini-calendar-title">{{ currentMonth }}</h3>
              <div class="mini-calendar-nav">
                <button class="nav-button">
                  <ChevronLeft class="nav-icon" />
                </button>
                <button class="nav-button">
                  <ChevronRight class="nav-icon" />
                </button>
              </div>
            </div>
            <div class="mini-calendar-grid">
              <div
                v-for="(day, i) in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
                :key="i"
                class="mini-calendar-day-header"
              >
                {{ day }}
              </div>
              <div
                v-for="(day, i) in miniCalendarDays"
                :key="i"
                :class="[
                  'mini-calendar-day',
                  { 'mini-calendar-day-active': day === 5 },
                  { 'mini-calendar-day-hidden': !day }
                ]"
              >
                {{ day }}
              </div>
            </div>
          </div>

          <!-- My Calendars -->
          <div class="my-calendars">
            <h3 class="my-calendars-title">My calendars</h3>
            <div class="calendar-list">
              <div v-for="(cal, i) in myCalendars" :key="i" class="calendar-item">
                <div :class="['calendar-color', cal.colorClass]"></div>
                <span class="calendar-name">{{ cal.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <button class="add-button">
          <Plus class="add-icon" />
        </button>
      </div>

      <!-- Calendar View -->
      <div :class="['calendar-view', { 'calendar-view-loaded': isLoaded }]">
        <!-- Calendar Controls -->
        <div class="calendar-controls">
          <div class="controls-left">
            <button class="today-button">Today</button>
            <div class="nav-controls">
              <button class="nav-control-button nav-control-left">
                <ChevronLeft class="nav-control-icon" />
              </button>
              <button class="nav-control-button nav-control-right">
                <ChevronRight class="nav-control-icon" />
              </button>
            </div>
            <h2 class="current-date">{{ currentDate }}</h2>
          </div>
          <div class="view-controls">
            <button
              @click="currentView = 'day'"
              :class="['view-button', { 'view-button-active': currentView === 'day' }]"
            >
              Day
            </button>
            <button
              @click="currentView = 'week'"
              :class="['view-button', { 'view-button-active': currentView === 'week' }]"
            >
              Week
            </button>
            <button
              @click="currentView = 'month'"
              :class="['view-button', { 'view-button-active': currentView === 'month' }]"
            >
              Month
            </button>
          </div>
        </div>

        <!-- Week View -->
        <div class="week-view">
          <div class="week-container">
            <!-- Week Header -->
            <div class="week-header">
              <div class="time-header"></div>
              <div
                v-for="(day, i) in weekDays"
                :key="i"
                class="day-header"
              >
                <div class="day-name">{{ day }}</div>
                <div :class="['day-number', { 'day-number-active': weekDates[i] === 5 }]">
                  {{ weekDates[i] }}
                </div>
              </div>
            </div>

            <!-- Time Grid -->
            <div class="time-grid">
              <!-- Time Labels -->
              <div class="time-labels">
                <div
                  v-for="(time, i) in timeSlots"
                  :key="i"
                  class="time-slot"
                >
                  {{ formatTime(time) }}
                </div>
              </div>

              <!-- Days Columns -->
              <div
                v-for="dayIndex in 7"
                :key="dayIndex"
                class="day-column"
              >
                <!-- Time slots background -->
                <div
                  v-for="timeIndex in timeSlots.length"
                  :key="timeIndex"
                  class="time-slot-bg"
                ></div>

                <!-- Events -->
                <div
                  v-for="(event, i) in getEventsForDay(dayIndex)"
                  :key="event.id"
                  :class="['event', event.colorClass]"
                  :style="getEventStyle(event)"
                  @click="handleEventClick(event)"
                >
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-time">{{ `${event.startTime} - ${event.endTime}` }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Popup -->
      <transition name="ai-popup">
        <div v-if="showAIPopup" class="ai-popup">
          <div class="ai-popup-content">
            <button
              @click="showAIPopup = false"
              class="ai-popup-close"
            >
              <X class="close-icon" />
            </button>
            <div class="ai-popup-body">
              <div class="ai-icon-container">
                <Sparkles class="ai-icon" />
              </div>
              <div class="ai-text-container">
                <p class="ai-text">{{ typedText }}</p>
                <span v-if="typedText.length < fullAIText.length" class="cursor">|</span>
              </div>
            </div>
            <div class="ai-popup-buttons">
              <button
                @click="handleAIResponse(true)"
                class="ai-button ai-button-yes"
              >
                Yes
              </button>
              <button
                @click="handleAIResponse(false)"
                class="ai-button ai-button-no"
              >
                No
              </button>
            </div>
            <transition name="music-player">
              <div v-if="isPlaying" class="music-player">
                <button
                  class="music-button"
                  @click="togglePlay"
                >
                  <Pause class="music-icon" />
                  <span>Pause Hans Zimmer</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </transition>

      <!-- Event Modal -->
      <transition name="modal">
        <div v-if="selectedEvent" class="modal-overlay" @click="selectedEvent = null">
          <transition name="modal-content">
            <div
              v-if="selectedEvent"
              :class="['modal-content', selectedEvent.colorClass]"
              @click.stop
            >
              <h3 class="modal-title">{{ selectedEvent.title }}</h3>
              <div class="modal-details">
                <p class="modal-detail">
                  <Clock class="detail-icon" />
                  {{ `${selectedEvent.startTime} - ${selectedEvent.endTime}` }}
                </p>
                <p class="modal-detail">
                  <MapPin class="detail-icon" />
                  {{ selectedEvent.location }}
                </p>
                <p class="modal-detail">
                  <Calendar class="detail-icon" />
                  {{ `${weekDays[selectedEvent.day - 1]}, ${weekDates[selectedEvent.day - 1]} ${currentMonth}` }}
                </p>
                <p class="modal-detail modal-detail-attendees">
                  <Users class="detail-icon detail-icon-top" />
                  <span>
                    <strong>Attendees:</strong><br />
                    {{ selectedEvent.attendees.join(', ') || 'No attendees' }}
                  </span>
                </p>
                <p class="modal-detail">
                  <strong>Organizer:</strong> {{ selectedEvent.organizer }}
                </p>
                <p class="modal-detail">
                  <strong>Description:</strong> {{ selectedEvent.description }}
                </p>
              </div>
              <div class="modal-buttons">
                <button
                  class="modal-button modal-button-edit"
                  @click="editEvent(selectedEvent)"
                >
                  Edit
                </button>
                <button
                  class="modal-button modal-button-close"
                  @click="selectedEvent = null"
                >
                  Close
                </button>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
  Clock,
  MapPin,
  Users,
  Calendar,
  Pause,
  Sparkles,
  X
} from 'lucide-vue-next'

// Reactive state
const isLoaded = ref(false)
const showAIPopup = ref(false)
const typedText = ref('')
const isPlaying = ref(false)
const currentView = ref('week')
const currentMonth = ref('March 2025')
const currentDate = ref('March 5')
const selectedEvent = ref(null)

// AI text
const fullAIText = "Looks like you don't have that many meetings today. Shall I play some Hans Zimmer essentials to help you get into your Flow State?"

// Sample data
const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const weekDates = [3, 4, 5, 6, 7, 8, 9]
const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8)

const events = ref([
  {
    id: 1,
    title: 'Team Meeting',
    startTime: '09:00',
    endTime: '10:00',
    colorClass: 'event-blue',
    day: 1,
    description: 'Weekly team sync-up',
    location: 'Conference Room A',
    attendees: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    organizer: 'Alice Brown',
  },
  {
    id: 2,
    title: 'Lunch with Sarah',
    startTime: '12:30',
    endTime: '13:30',
    colorClass: 'event-green',
    day: 1,
    description: 'Discuss project timeline',
    location: 'Cafe Nero',
    attendees: ['Sarah Lee'],
    organizer: 'You',
  },
  {
    id: 3,
    title: 'Project Review',
    startTime: '14:00',
    endTime: '15:30',
    colorClass: 'event-purple',
    day: 3,
    description: 'Q2 project progress review',
    location: 'Meeting Room 3',
    attendees: ['Team Alpha', 'Stakeholders'],
    organizer: 'Project Manager',
  },
])

const myCalendars = [
  { name: 'My Calendar', colorClass: 'color-blue' },
  { name: 'Work', colorClass: 'color-green' },
  { name: 'Personal', colorClass: 'color-purple' },
  { name: 'Family', colorClass: 'color-orange' },
]

// Computed properties
const miniCalendarDays = computed(() => {
  const daysInMonth = 31
  const firstDayOffset = 5
  return Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1
  )
})

// Methods
const formatTime = (hour) => {
  if (hour === 12) return '12 PM'
  if (hour > 12) return `${hour - 12} PM`
  if (hour === 0) return '12 AM'
  return `${hour} AM`
}

const getEventStyle = (event) => {
  const startHour = parseInt(event.startTime.split(':')[0])
  const startMinute = parseInt(event.startTime.split(':')[1])
  const endHour = parseInt(event.endTime.split(':')[0])
  const endMinute = parseInt(event.endTime.split(':')[1])

  const startDecimal = startHour + startMinute / 60
  const endDecimal = endHour + endMinute / 60

  const top = (startDecimal - 8) * 80
  const height = (endDecimal - startDecimal) * 80

  return {
    top: `${Math.max(0, top)}px`,
    height: `${Math.max(20, height)}px`,
    left: '4px',
    right: '4px',
    minHeight: '20px'
  }
}

const getEventsForDay = (dayIndex) => {
  return events.value.filter(event => event.day === dayIndex)
}

const handleEventClick = (event) => {
  selectedEvent.value = event
}

const editEvent = (event) => {
  console.log('Edit event:', event)
}

const handleAIResponse = (accepted) => {
  if (accepted) {
    isPlaying.value = true
  } else {
    showAIPopup.value = false
  }
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (!isPlaying.value) {
    showAIPopup.value = false
  }
}

// Lifecycle hooks
let popupTimer = null
let typingInterval = null

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)

  popupTimer = setTimeout(() => {
    showAIPopup.value = true

    let i = 0
    typingInterval = setInterval(() => {
      if (i < fullAIText.length) {
        typedText.value += fullAIText.charAt(i)
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)
  }, 3000)
})

onUnmounted(() => {
  if (popupTimer) clearTimeout(popupTimer)
  if (typingInterval) clearInterval(typingInterval)
})
</script>

<style scoped>
/* Base Styles */
* {
  box-sizing: border-box;
}

.calendar-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.background-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

/* Header Styles */
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.header-loaded {
  opacity: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  font-size: 24px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.search-input {
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 8px 16px 8px 40px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  outline: none;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  ring: 2px solid rgba(255, 255, 255, 0.3);
}

.icon {
  width: 24px;
  height: 24px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Main Content */
.main-content {
  position: relative;
  height: 100vh;
  width: 100%;
  padding-top: 80px;
  display: flex;
}

/* Sidebar */
.sidebar {
  width: 256px;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  padding: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-top-right-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0;
  transition: opacity 0.5s ease 0.2s;
}

.sidebar-loaded {
  opacity: 1;
}

.sidebar-content {
  flex: 1;
}

.create-button {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 9999px;
  background: #3b82f6;
  padding: 12px 16px;
  color: white;
  width: 100%;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.create-button:hover {
  background: #2563eb;
}

.button-icon {
  width: 20px;
  height: 20px;
}

/* Mini Calendar */
.mini-calendar {
  margin-bottom: 24px;
}

.mini-calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.mini-calendar-title {
  color: white;
  font-weight: 500;
  margin: 0;
}

.mini-calendar-nav {
  display: flex;
  gap: 4px;
}

.nav-button {
  padding: 4px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-icon {
  width: 16px;
  height: 16px;
  color: white;
}

.mini-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}

.mini-calendar-day-header {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  padding: 4px 0;
}

.mini-calendar-day {
  font-size: 12px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mini-calendar-day:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mini-calendar-day-active {
  background: #3b82f6;
  color: white;
}

.mini-calendar-day-hidden {
  visibility: hidden;
}

/* My Calendars */
.my-calendars-title {
  color: white;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.calendar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calendar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.color-blue { background: #3b82f6; }
.color-green { background: #10b981; }
.color-purple { background: #8b5cf6; }
.color-orange { background: #f59e0b; }

.calendar-name {
  color: white;
  font-size: 14px;
}

.add-button {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #3b82f6;
  padding: 16px;
  color: white;
  width: 56px;
  height: 56px;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.2s ease;
}

.add-button:hover {
  background: #2563eb;
}

.add-icon {
  width: 24px;
  height: 24px;
}

/* Calendar View */
.calendar-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.5s ease 0.3s;
}

.calendar-view-loaded {
  opacity: 1;
}

.calendar-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.today-button {
  padding: 8px 16px;
  color: white;
  background: #3b82f6;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.today-button:hover {
  background: #2563eb;
}

.nav-controls {
  display: flex;
}

.nav-control-button {
  padding: 8px;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-control-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-control-left {
  border-radius: 6px 0 0 6px;
}

.nav-control-right {
  border-radius: 0 6px 6px 0;
}

.nav-control-icon {
  width: 20px;
  height: 20px;
}

.current-date {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.view-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.view-button {
  padding: 4px 12px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.view-button-active {
  background: rgba(255, 255, 255, 0.2);
}

/* Week View */
.week-view {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.week-container {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  height: 100%;
  min-height: 600px;
}

.week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.time-header {
  padding: 12px;
}

.day-header {
  padding: 12px;
  text-align: center;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.day-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.day-number {
  font-size: 18px;
  font-weight: 500;
  margin-top: 4px;
  color: white;
}

.day-number-active {
  background: #3b82f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px auto 0;
}

.time-grid {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  position: relative;
}

.time-labels {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
}

.time-slot {
  height: 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 8px 0 0;
  text-align: right;
  font-size: 12px;
}

.day-column {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.time-slot-bg {
  height: 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease;
}

.time-slot-bg:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Events */
.event {
  position: absolute;
  border-radius: 6px;
  padding: 8px;
  color: white;
  font-size: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.event:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.event-blue { background: #3b82f6; }
.event-green { background: #10b981; }
.event-purple { background: #8b5cf6; }
.event-orange { background: #f59e0b; }

.event-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-time {
  opacity: 0.8;
  font-size: 10px;
  margin-top: 4px;
}

/* AI Popup */
.ai-popup {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 20;
}

.ai-popup-content {
  width: 450px;
  position: relative;
  background: linear-gradient(135deg,
  rgba(59, 130, 246, 0.3) 0%,
  rgba(59, 130, 246, 0.3) 50%,
  rgba(37, 99, 235, 0.3) 100%);
  backdrop-filter: blur(16px);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: white;
}

.ai-popup-close {
  position: absolute;
  top: 8px;
  right: 8px;
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.ai-popup-close:hover {
  color: white;
}

.close-icon {
  width: 20px;
  height: 20px;
}

.ai-popup-body {
  display: flex;
  gap: 12px;
}

.ai-icon-container {
  flex-shrink: 0;
}

.ai-icon {
  width: 20px;
  height: 20px;
  color: #93c5fd;
}

.ai-text-container {
  min-height: 80px;
}

.ai-text {
  font-size: 16px;
  font-weight: 300;
  line-height: 1.5;
  margin: 0;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.ai-popup-buttons {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.ai-button {
  flex: 1;
  padding: 10px 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 14px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.ai-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.music-player {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.music-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 16px;
  color: white;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.music-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.music-icon {
  width: 16px;
  height: 16px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 448px;
  width: 100%;
  margin: 0 16px;
  color: white;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-detail {
  display: flex;
  align-items: center;
  margin: 0;
}

.modal-detail-attendees {
  align-items: flex-start;
}

.detail-icon {
  margin-right: 8px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.detail-icon-top {
  margin-top: 4px;
}

.modal-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-button-edit {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.modal-button-edit:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-button-close {
  background: white;
  color: #374151;
}

.modal-button-close:hover {
  background: #f3f4f6;
}

/* Transitions */
.ai-popup-enter-active,
.ai-popup-leave-active {
  transition: all 0.3s ease;
}

.ai-popup-enter-from,
.ai-popup-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

.music-player-enter-active,
.music-player-leave-active {
  transition: all 0.3s ease;
}

.music-player-enter-from,
.music-player-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

/* Scrollbar Styles */
.week-view::-webkit-scrollbar {
  width: 6px;
}

.week-view::-webkit-scrollbar-track {
  background: transparent;
}

.week-view::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.week-view::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 16px;
  }

  .sidebar {
    width: 200px;
  }

  .ai-popup-content {
    width: 350px;
  }

  .modal-content {
    margin: 0 8px;
  }
}
</style>
