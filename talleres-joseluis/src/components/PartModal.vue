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

              <!-- Carrusel principal -->
              <div v-if="allImages.length" class="carousel">
                <div class="carousel-main">
                  <img :src="allImages[activeImg].url" :alt="part.name" class="carousel-img" />
                  <button v-if="allImages.length > 1" class="carousel-arrow left"  @click="prevImg">‹</button>
                  <button v-if="allImages.length > 1" class="carousel-arrow right" @click="nextImg">›</button>
                  <div v-if="allImages.length > 1" class="carousel-dots">
                    <button v-for="(_, i) in allImages" :key="i"
                      class="carousel-dot" :class="{ active: i === activeImg }"
                      @click="activeImg = i" />
                  </div>
                </div>
                <div v-if="allImages.length > 1" class="carousel-thumbs">
                  <button v-for="(img, i) in allImages" :key="i"
                    class="thumb-btn" :class="{ active: i === activeImg }"
                    @click="activeImg = i">
                    <img :src="img.url" :alt="'Imagen ' + (i+1)" />
                  </button>
                </div>
              </div>

              <!-- Sin imagen: emoji grande -->
              <div v-else class="no-image-placeholder">
                <span>{{ part.emoji }}</span>
              </div>

              <!-- Vídeos -->
              <div v-if="allVideos.length" class="videos-section">
                <h4 class="videos-title">🎬 Vídeos</h4>
                <div v-for="(vid, i) in allVideos" :key="i" class="video-embed-wrap">
                  <iframe v-if="getYoutubeId(vid.url)"
                    :src="`https://www.youtube.com/embed/${getYoutubeId(vid.url)}`"
                    class="video-iframe" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
                  <iframe v-else-if="getVimeoId(vid.url)"
                    :src="`https://player.vimeo.com/video/${getVimeoId(vid.url)}`"
                    class="video-iframe" frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture" allowfullscreen />
                  <video v-else :src="vid.url" class="video-direct" controls preload="metadata" />
                </div>
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

              <!-- Acciones rápidas -->
              <div class="quick-actions">
                <a class="action-btn whatsapp" :href="whatsappUrl" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.107 1.521 5.833L.057 23.571a.5.5 0 0 0 .612.612l5.638-1.47A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.866 9.866 0 0 1-5.032-1.378l-.36-.214-3.733.973.999-3.627-.235-.373A9.867 9.867 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/></svg>
                  Consultar por WhatsApp
                </a>
                <button class="action-btn form-toggle" @click="showForm = !showForm">
                  {{ showForm ? '✕ Cerrar formulario' : '📨 Enviar consulta' }}
                </button>
              </div>

              <!-- Formulario -->
              <Transition name="slide-down">
                <div v-if="showForm" class="consult-form">
                  <Transition name="fade" mode="out-in">
                    <div v-if="!sent" key="form">
                      <div class="form-row">
                        <div class="form-group">
                          <label>Nombre <span class="req">*</span></label>
                          <input v-model="form.name" type="text" placeholder="Tu nombre" />
                        </div>
                        <div class="form-group">
                          <label>Teléfono <span class="req">*</span></label>
                          <input v-model="form.phone" type="tel" placeholder="Tu teléfono" />
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Máquina / Modelo</label>
                        <input v-model="form.machine" type="text" placeholder="p.ej. John Deere 6130R…" />
                      </div>
                      <div class="form-group">
                        <label>Comentario</label>
                        <textarea v-model="form.message" placeholder="Cantidad, urgencia, descripción del problema…" rows="3" />
                      </div>
                      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
                      <button class="btn btn-secondary" style="width:100%" @click="submit">📨 Enviar consulta</button>
                    </div>
                    <div v-else key="success" class="success-inline">
                      <div class="success-icon">✅</div>
                      <strong>¡Consulta enviada!</strong>
                      <p>Te contactaremos en breve con disponibilidad y precio.</p>
                    </div>
                  </Transition>
                </div>
              </Transition>

            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({ part: { type: Object, default: null } })
const emit  = defineEmits(['close'])

const sent      = ref(false)
const errorMsg  = ref('')
const showForm  = ref(false)
const activeImg = ref(0)
const form      = ref({ name: '', phone: '', machine: '', message: '' })

const PHONE = '34XXXXXXXXX' // ← Cambia por el teléfono real del taller

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

const whatsappUrl = computed(() => {
  if (!props.part) return '#'
  const msg = encodeURIComponent(
    `Hola, me interesa la pieza *${props.part.name}*` +
    (props.part.ref ? ` (REF: ${props.part.ref})` : '') +
    `. ¿Podéis informarme sobre disponibilidad y precio?`
  )
  return `https://wa.me/${PHONE}?text=${msg}`
})

watch(() => props.part, () => {
  sent.value     = false
  errorMsg.value = ''
  showForm.value = false
  activeImg.value = 0
  form.value     = { name: '', phone: '', machine: '', message: '' }
})
watch(() => props.part, val => { document.body.style.overflow = val ? 'hidden' : '' })

function prevImg() { activeImg.value = (activeImg.value - 1 + allImages.value.length) % allImages.value.length }
function nextImg() { activeImg.value = (activeImg.value + 1) % allImages.value.length }

function getYoutubeId(url) {
  const m = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return m ? m[1] : null
}
function getVimeoId(url) {
  const m = url?.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}

function submit() {
  errorMsg.value = ''
  if (!form.value.name.trim() || !form.value.phone.trim()) {
    errorMsg.value = 'Por favor, rellena al menos tu nombre y teléfono.'
    return
  }
  console.log('Consulta:', props.part?.ref, form.value)
  sent.value = true
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
  background: var(--white);
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

/* Videos in gallery */
.videos-section {
  padding: 0.6rem;
  background: #1a1a1a;
  flex-shrink: 0;
}
.videos-title {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  margin-bottom: 0.4rem;
}
.video-embed-wrap {
  border-radius: 6px;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: #000;
  margin-bottom: 0.5rem;
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
.action-btn.form-toggle {
  background: var(--green-pale);
  color: var(--green-dark);
  border: 1px solid rgba(74,158,74,0.3);
}
.action-btn.form-toggle:hover { background: var(--green-mid); color: #fff; }

/* Consult form */
.consult-form {
  border-top: 1px solid var(--gray-mid);
  padding-top: 1rem;
}
.error-msg {
  font-size: 0.83rem;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
.success-inline {
  text-align: center;
  padding: 1.5rem 1rem;
}
.success-inline .success-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
.success-inline strong { display: block; font-size: 1.05rem; color: var(--green-dark); margin-bottom: 0.3rem; }
.success-inline p { font-size: 0.85rem; color: var(--text-soft); }

/* Slide-down transition for form */
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.25s ease; overflow: hidden; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to,
.slide-down-leave-from { opacity: 1; max-height: 600px; }

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
