<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="part" class="overlay" @click.self="$emit('close')">
        <div class="modal" role="dialog" aria-modal="true" :aria-label="`Detalle: ${part.name}`">

          <!-- ── Header ─────────────────────────────────────────────────── -->
          <div class="modal-head">
            <button class="close-btn" @click="$emit('close')" aria-label="Cerrar">✕</button>
          </div>

          <!-- ── Layout: galería + info ──────────────────────────────── -->
          <div class="modal-layout">

            <!-- Galería -->
            <div class="gallery-col">

              <!-- Carrusel principal (imágenes y vídeos mezclados) -->
              <div v-if="allMedia.length" class="carousel">
                <div class="carousel-main">

                  <!-- Slide: imagen -->
                  <img v-if="activeItem.type === 'image'" :src="activeItem.url" :alt="part.name" class="carousel-img" />

                  <!-- Slide: vídeo -->
                  <div v-else class="video-embed-wrap">
                    <iframe v-if="getYoutubeId(activeItem.url)"
                      :src="`https://www.youtube.com/embed/${getYoutubeId(activeItem.url)}`"
                      class="video-iframe" frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
                    <iframe v-else-if="getVimeoId(activeItem.url)"
                      :src="`https://player.vimeo.com/video/${getVimeoId(activeItem.url)}`"
                      class="video-iframe" frameborder="0"
                      allow="autoplay; fullscreen; picture-in-picture" allowfullscreen />
                    <video v-else :src="activeItem.url" class="video-direct" controls preload="metadata" />
                  </div>

                  <button v-if="allMedia.length > 1" class="carousel-arrow left"  @click="prevItem">‹</button>
                  <button v-if="allMedia.length > 1" class="carousel-arrow right" @click="nextItem">›</button>
                  <div v-if="allMedia.length > 1" class="carousel-dots">
                    <button v-for="(_, i) in allMedia" :key="i"
                      class="carousel-dot" :class="{ active: i === activeIdx }"
                      @click="activeIdx = i" />
                  </div>
                </div>
                <div v-if="allMedia.length > 1" class="carousel-thumbs">
                  <button v-for="(item, i) in allMedia" :key="i"
                    class="thumb-btn" :class="{ active: i === activeIdx, 'is-video': item.type === 'video' }"
                    @click="activeIdx = i">
                    <img v-if="item.type === 'image'" :src="item.url" :alt="'Imagen ' + (i+1)" />
                    <img v-else-if="getYoutubeId(item.url)" :src="`https://img.youtube.com/vi/${getYoutubeId(item.url)}/default.jpg`" :alt="'Vídeo ' + (i+1)" />
                    <span v-else class="thumb-video-icon">🎬</span>
                    <span v-if="item.type === 'video'" class="thumb-play">▶</span>
                  </button>
                </div>
              </div>

              <!-- Sin imagen ni vídeo: emoji grande -->
              <div v-else class="no-image-placeholder">
                <span>{{ part.emoji }}</span>
              </div>
            </div>

            <!-- Info de la pieza -->
            <div class="info-col">
              <!-- Categoría badge -->
              <span class="cat-badge" :style="{ background: part.catColor + '22', color: part.catColor }">
                {{ part.category }}
              </span>

              <h2 class="part-title">{{ part.name }}</h2>

              <div v-if="part.ref" class="part-ref">
                <span class="ref-label">REF</span>
                <code>{{ part.ref }}</code>
              </div>

              <!-- Stock -->
              <div class="stock-row" :class="`stock-${part.stockStatus}`">
                <span class="stock-dot" />
                <span class="stock-label-text">{{ part.stockLabel }}</span>
              </div>

              <!-- Compatibilidad -->
              <div v-if="part.compat" class="compat-box">
                <div class="compat-icon">🚜</div>
                <div>
                  <div class="compat-title">Compatibilidad</div>
                  <div class="compat-text">{{ part.compat }}</div>
                </div>
              </div>

              <!-- Descripción -->
              <div v-if="part.description" class="description-box">
                <div class="desc-title">Descripción</div>
                <p class="desc-text">{{ part.description }}</p>
              </div>

              <!-- Acción de consulta: solo WhatsApp -->
              <div class="quick-actions">
                <a class="action-btn whatsapp" :href="whatsappUrl" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.107 1.521 5.833L.057 23.571a.5.5 0 0 0 .612.612l5.638-1.47A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.866 9.866 0 0 1-5.032-1.378l-.36-.214-3.733.973.999-3.627-.235-.373A9.867 9.867 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/></svg>
                  Consultar por WhatsApp
                </a>
                <p class="quick-actions-hint">Te respondemos directamente por WhatsApp con disponibilidad y precio.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({ part: { type: Object, default: null } })
const emit  = defineEmits(['close'])

const settings = useSettingsStore()

const activeIdx = ref(0)

const allImages = computed(() => {
  if (!props.part) return []
  const media = props.part.media || []
  const imgs  = media.filter(m => m.type === 'image')
  if (imgs.length) {
    const primary = imgs.find(m => m.is_primary)
    return primary ? [primary, ...imgs.filter(m => !m.is_primary)] : imgs
  }
  if (props.part.image) return [{ url: props.part.image, type: 'image', is_primary: true }]
  return []
})

const allVideos = computed(() =>
  props.part ? (props.part.media || []).filter(m => m.type === 'video') : []
)

// Un único carrusel: primero las imágenes (principal primero), luego los vídeos
const allMedia = computed(() => [...allImages.value, ...allVideos.value])
const activeItem = computed(() => allMedia.value[activeIdx.value] || {})

const whatsappUrl = computed(() => {
  if (!props.part) return '#'
  const msg =
    `Hola, me interesa la pieza *${props.part.name}*` +
    (props.part.ref ? ` (REF: ${props.part.ref})` : '') +
    `. ¿Podéis informarme sobre disponibilidad y precio?`
  return settings.whatsappUrl(msg)
})

watch(() => props.part, () => {
  activeIdx.value = 0
})
watch(() => props.part, val => { document.body.style.overflow = val ? 'hidden' : '' })

function prevItem() { activeIdx.value = (activeIdx.value - 1 + allMedia.value.length) % allMedia.value.length }
function nextItem() { activeIdx.value = (activeIdx.value + 1) % allMedia.value.length }

function getYoutubeId(url) {
  const m = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return m ? m[1] : null
}
function getVimeoId(url) {
  const m = url?.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.modal {
  background: var(--surface);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 94vh;
  overflow-y: auto;
  animation: slide-up 0.25s ease;
  position: relative;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Header */
.modal-head {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.close-btn {
  background: rgba(0,0,0,0.45);
  color: #fff;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  border: none;
  cursor: pointer;
}
.close-btn:hover { background: rgba(0,0,0,0.7); }

/* Layout */
.modal-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 400px;
}

/* Gallery column */
.gallery-col {
  background: #111;
  border-radius: 16px 0 0 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.no-image-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  color: rgba(255,255,255,0.3);
}

/* Carousel */
.carousel { display: flex; flex-direction: column; flex: 1; }

.carousel-main {
  position: relative;
  flex: 1;
  min-height: 260px;
  background: #000;
  overflow: hidden;
}
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  z-index: 2;
  line-height: 1;
}
.carousel-arrow:hover { background: rgba(0,0,0,0.8); }
.carousel-arrow.left  { left: 10px; }
.carousel-arrow.right { right: 10px; }

.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.carousel-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  border: none; cursor: pointer; padding: 0;
  transition: background 0.15s;
}
.carousel-dot.active { background: #fff; }

.carousel-thumbs {
  display: flex;
  gap: 3px;
  padding: 4px;
  background: #1a1a1a;
  overflow-x: auto;
  flex-shrink: 0;
}
.thumb-btn {
  width: 52px; height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid transparent;
  padding: 0; cursor: pointer;
  background: #333;
  transition: border-color 0.15s;
}
.thumb-btn.active { border-color: var(--yellow); }
.thumb-btn img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb-btn.is-video { position: relative; }

.thumb-video-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333;
  font-size: 1.1rem;
}

.thumb-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.85rem;
  background: rgba(0,0,0,0.35);
  pointer-events: none;
}

/* Vídeo dentro del carrusel principal */
.video-embed-wrap {
  position: absolute;
  inset: 0;
  background: #000;
}
.video-iframe,
.video-direct {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}

/* Info column */
.info-col {
  padding: 1.8rem 1.6rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  overflow-y: auto;
}

.cat-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  padding: 0.2rem 0.7rem;
  border-radius: 10px;
  align-self: flex-start;
}

.part-title {
  font-size: 1.45rem;
  color: var(--text-main);
  line-height: 1.25;
  font-family: 'Oswald', sans-serif;
  margin: 0;
}

.part-ref {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.ref-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 1px;
  background: var(--gray-light);
  padding: 2px 6px;
  border-radius: 4px;
}
code {
  font-size: 0.88rem;
  color: var(--green-mid);
  font-family: monospace;
}

/* Stock */
.stock-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
}
.stock-dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
.stock-available { background: #f0fdf4; color: #16a34a; }
.stock-available .stock-dot { background: #22c55e; }
.stock-low       { background: #fffbeb; color: #d97706; }
.stock-low .stock-dot       { background: #f59e0b; }
.stock-out       { background: #fef2f2; color: #dc2626; }
.stock-out .stock-dot       { background: #ef4444; }

/* Compat box */
.compat-box {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  background: var(--gray-light);
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
}
.compat-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 1px; }
.compat-title { font-size: 0.68rem; font-weight: 700; color: var(--text-soft); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.compat-text  { font-size: 0.85rem; color: var(--text-main); line-height: 1.4; }

/* Description */
.description-box {
  border-left: 3px solid var(--green-light);
  padding-left: 0.8rem;
}
.desc-title { font-size: 0.68rem; font-weight: 700; color: var(--text-soft); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.desc-text  { font-size: 0.88rem; color: var(--text-main); line-height: 1.6; margin: 0; }

/* Quick actions */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  border: none;
  width: 100%;
  text-align: center;
}
.action-btn.whatsapp {
  background: #25d366;
  color: #fff;
}
.action-btn.whatsapp:hover { background: #1ebe5a; }
.quick-actions-hint {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-soft);
  margin-top: 0.4rem;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 700px) {
  .modal-layout {
    grid-template-columns: 1fr;
  }
  .gallery-col {
    border-radius: 16px 16px 0 0;
    max-height: 260px;
  }
  .carousel-main { min-height: 200px; }
  .info-col { padding: 1.2rem; }
  .part-title { font-size: 1.2rem; }
}
</style>
