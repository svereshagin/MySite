<template>
  <div class="main-column">
    <div class="content-prose">
      <!-- Заголовок -->
      <h4 class="section-title">My Skills</h4>
      <p class="content-paragraph">Technologies and tools I work with</p>

      <!-- Оригинальная сетка 2x2 -->
      <div class="skills-grid">
        <div
          v-for="skill in skills"
          :key="skill.id"
          class="skill-card"
        >
          <!-- Заголовок карточки -->
          <div class="card-header">
            <div class="card-info">
              <div class="skill-icon" :class="getIconBgClass(skill.skill)"></div>
              <span class="skill-name">{{ getSkillCategory(skill.skill) }}</span>
            </div>
            <span class="skill-level" :class="getLevelClass(skill.level)">
              {{ skill.level.toUpperCase() }}
            </span>
          </div>

          <!-- Список технологий -->
          <div class="tech-list">
            <div
              v-for="(tech, index) in parseSkills(skill.skill)"
              :key="index"
              class="tech-item"
            >
              <span class="tech-bullet">●</span>
              <span class="tech-name">{{ tech.trim() }}</span>
            </div>
          </div>

          <!-- Прогресс бар -->
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Proficiency</span>
              <span class="progress-value">{{ getLevelPercentage(skill.level) }}%</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :class="getProgressClass(skill.level)"
                :style="{ width: getLevelPercentage(skill.level) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Skill {
  id: number;
  skill: string;
  level: string;
}

interface Props {
  skills: Skill[];
}

defineProps<Props>()

// Helper functions
const parseSkills = (skillString: string): string[] => {
  const cleanString = skillString.replace(/^[^:]*:\s*/, '');
  return cleanString.split(',').map(s => s.trim());
};

const getSkillCategory = (skillString: string): string => {
  if (skillString.includes('Python') || skillString.includes('Django')) {
    return 'Backend Development';
  } else if (skillString.includes('Vue') || skillString.includes('HTML')) {
    return 'Frontend Development';
  } else if (skillString.includes('SQLalchemy') || skillString.includes('pydantic')) {
    return 'Database & APIs';
  } else if (skillString.includes('Docker') || skillString.includes('Instruments:')) {
    return 'DevOps & Tools';
  }
  return 'General Skills';
};

const getIconBgClass = (skillString: string): string => {
  if (skillString.includes('Python') || skillString.includes('Django')) {
    return 'icon-green';
  } else if (skillString.includes('Vue') || skillString.includes('HTML')) {
    return 'icon-blue';
  } else if (skillString.includes('SQLalchemy') || skillString.includes('pydantic')) {
    return 'icon-blue';
  } else if (skillString.includes('Docker') || skillString.includes('Instruments:')) {
    return 'icon-purple';
  }
  return 'icon-gray';
};

const getLevelClass = (level: string): string => {
  const classes: Record<string, string> = {
    junior: 'level-junior',
    medium: 'level-medium',
    senior: 'level-senior'
  };
  return classes[level] || 'level-junior';
};

const getProgressClass = (level: string): string => {
  const classes: Record<string, string> = {
    junior: 'progress-junior',
    medium: 'progress-medium',
    senior: 'progress-senior'
  };
  return classes[level] || 'progress-junior';
};

const getLevelPercentage = (level: string): number => {
  const percentages: Record<string, number> = {
    junior: 40,
    medium: 70,
    senior: 90
  };
  return percentages[level] || 40;
};
</script>

<style scoped>
/* Базовые стили для интеграции */
.main-column {
  max-width: none;
}

.content-prose {
  line-height: 1.7;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
}

.content-paragraph {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

/* ОРИГИНАЛЬНЫЕ стили навыков */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.skill-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.skill-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skill-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
}

.icon-green {
  background-color: #d1fae5;
}

.icon-blue {
  background-color: #dbeafe;
}

.icon-purple {
  background-color: #e9d5ff;
}

.icon-gray {
  background-color: #f3f4f6;
}

.skill-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.skill-level {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.level-junior {
  background-color: #fef3c7;
  color: #92400e;
}

.level-medium {
  background-color: #dbeafe;
  color: #1e40af;
}

.level-senior {
  background-color: #d1fae5;
  color: #065f46;
}

.tech-list {
  margin-bottom: 1.5rem;
}

.tech-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tech-bullet {
  color: #3b82f6;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.tech-name {
  color: #4b5563;
  font-size: 0.9rem;
}

.progress-section {
  margin-top: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-label,
.progress-value {
  font-size: 0.8rem;
  color: #6b7280;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-junior {
  background-color: #f59e0b;
}

.progress-medium {
  background-color: #3b82f6;
}

.progress-senior {
  background-color: #10b981;
}

/* Адаптивность */
@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
