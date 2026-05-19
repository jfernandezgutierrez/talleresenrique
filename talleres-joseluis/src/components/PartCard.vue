<template>
  <article class="part-card" @click="$emit('ask', part)">
    <div class="part-img">
      <img v-if="getPrimaryImage(part)" :src="getPrimaryImage(part)" :alt="part.name" class="part-photo" />
      <span v-else class="part-emoji">{{ part.emoji }}</span>
      <!-- Badge si tiene más imágenes -->
      <div v-if="part.media && part.media.filter(m => m.type === 'image').length > 1" class="media-count-badge">
        📷 {{ part.media.filter(m => m.type === 'image').length }}
      </div>
      <!-- Badge si tiene vídeo -->
      <div v-if="part.media && part.media.some(m => m.type === 'video')" class="video-count-badge">
        🎬
      </div>
    </div>
    <div class="part-body">
      <span
        class="cat-badge"
        :style="{ background: part.catColor + '22', color: part.catColor }"
      >
        {{ part.category }}
      </span>
      <h3 class="part-name">{{ part.name }}</h3>
      <p class="part-ref">REF: {{ part.ref }}</p>
      <p class="part-compat">🚜 {{ part.compat }}</p>
      <p v-if="part.description" class="part-desc">{{ part.description }}</p>
      <div class="part-stock" :class="`stock-${part.stockStatus}`">
        <span class="dot" />
        {{ part.stockLabel }}
      </div>
      <button class="ask-btn" @click.stop="$emit('ask', part)">
        💬 Consultar disponibilidad
      </button>
    </div>
  </article>
</template>

<script setup>
import { getPrimaryImage } from '@/stores/parts'
defineProps({ part: { type: Object, required: true } })
defineEmits(['ask'])
</script>

<style scoped>
.part-card {
  background: var(--white);
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.part-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-strong);
  border-color: var(--green-light);
}

.part-img {
  height: 160px;
  background: var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  overflow: hidden;
  position: relative;
}

.media-count-badge,
.video-count-badge {
  position: absolute;
  bottom: 6px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  pointer-events: none;
  line-height: 1.4;
}
.media-count-badge { right: 6px; }
.video-count-badge { left: 6px; }

.part-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.part-emoji {
  font-size: 4rem;
  line-height: 1;
}

.part-desc {
  font-size: 0.78rem;
  color: var(--text-soft);
  line-height: 1.5;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.part-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cat-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  align-self: flex-start;
}

.part-name {
  font-size: 0.95rem;
  color: var(--text-main);
  margin-bottom: 0.3rem;
  line-height: 1.3;
}

.part-ref {
  font-size: 0.74rem;
  color: var(--text-soft);
  font-family: monospace;
  margin-bottom: 0.4rem;
}

.part-compat {
  font-size: 0.78rem;
  color: var(--text-soft);
  margin-bottom: 0.7rem;
  line-height: 1.4;
}

.part-stock {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  margin-top: auto;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stock-available { color: #16a34a; }
.stock-available .dot { background: #22c55e; }

.stock-low { color: #d97706; }
.stock-low .dot { background: #f59e0b; }

.stock-out { color: #dc2626; }
.stock-out .dot { background: #ef4444; }

.ask-btn {
  width: 100%;
  padding: 0.6rem;
  background: var(--green-pale);
  color: var(--green-dark);
  border-radius: var(--radius-sm);
  font-size: 0.83rem;
  font-weight: 700;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  transition: var(--transition);
  border: 1px solid rgba(74,158,74,0.3);
}

.ask-btn:hover {
  background: var(--green-mid);
  color: var(--white);
}
</style>
