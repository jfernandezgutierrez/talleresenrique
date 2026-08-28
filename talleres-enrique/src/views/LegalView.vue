<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <span class="section-tag">Información legal</span>
        <h1 class="section-title">{{ content.title }}</h1>
        <div class="divider" />
        <p class="section-desc">Última revisión: {{ s.legal_updated_at_text }}</p>
      </div>
    </section>

    <section class="section-pad">
      <article class="container legal-content">
        <aside v-if="s.legal_pending" class="legal-pending" role="note">
          <strong>Documento pendiente de validación del titular.</strong>
          Antes de publicar deben completarse la razón social o nombre fiscal, NIF y los datos del
          proveedor de alojamiento.
        </aside>
        <section v-for="section in content.sections" :key="section.heading">
          <h2>{{ section.heading }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
        </section>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({ document: { type: String, required: true } })
const settings = useSettingsStore()
const s = computed(() => settings.settings)

const documents = {
  legal: {
    title: 'Aviso legal',
    sections: [
      {
        heading: 'Titular del sitio',
        paragraphs: [
          'Talleres Enrique, con domicilio en C/ Pola n.º 2, Selaya, Cantabria. Los datos fiscales completos se incorporarán tras la validación del titular.',
        ],
      },
      {
        heading: 'Finalidad',
        paragraphs: [
          'Este sitio informa sobre los servicios del taller, muestra un catálogo orientativo y facilita canales de contacto. La disponibilidad indicada debe confirmarse directamente con el establecimiento.',
        ],
      },
      {
        heading: 'Propiedad intelectual',
        paragraphs: [
          'Los textos, fotografías, logotipos y demás contenidos pertenecen a sus respectivos titulares. No se autoriza su reutilización sin permiso.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Política de privacidad',
    sections: [
      {
        heading: 'Datos tratados',
        paragraphs: [
          'La web no incluye formularios propios. Si contactas por teléfono, correo, Facebook o WhatsApp, los datos serán tratados para responder a tu consulta mediante el canal elegido.',
        ],
      },
      {
        heading: 'Base y conservación',
        paragraphs: [
          'El tratamiento se basa en tu solicitud de información o en medidas precontractuales. Los datos se conservarán durante el tiempo necesario para atender la consulta y cumplir obligaciones legales.',
        ],
      },
      {
        heading: 'Tus derechos',
        paragraphs: [
          'Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a mayteruca@hotmail.com. También puedes reclamar ante la Agencia Española de Protección de Datos.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Política de cookies',
    sections: [
      {
        heading: 'Uso actual',
        paragraphs: [
          'La web no instala cookies publicitarias ni de analítica. Solo guarda en el navegador las preferencias visuales elegidas por la persona usuaria.',
        ],
      },
      {
        heading: 'Servicios externos',
        paragraphs: [
          'Al abrir enlaces o vídeos de terceros, como WhatsApp, Facebook, YouTube o Vimeo, esos proveedores pueden aplicar sus propias políticas y tecnologías de seguimiento.',
        ],
      },
      {
        heading: 'Cambios futuros',
        paragraphs: [
          'Si se incorpora analítica o cualquier servicio que requiera consentimiento, se actualizará esta política y se añadirá el mecanismo de consentimiento correspondiente antes de activarlo.',
        ],
      },
    ],
  },
}

const content = computed(() => {
  const base = documents[props.document]
  const field = { legal: 'legal_notice_text', privacy: 'privacy_text', cookies: 'cookies_text' }[props.document]
  return {
    title: base.title,
    sections: [{ heading: base.sections[0].heading, paragraphs: (s.value[field] || '').split(/\n\s*\n/).filter(Boolean) }],
  }
})
</script>

<style scoped>
.page-hero {
  background: var(--header-bg);
  padding: 4rem 0 3rem;
  text-align: center;
  border-bottom: 4px solid var(--yellow);
}
.page-hero .section-title {
  color: var(--header-text);
}
.page-hero .section-desc {
  color: var(--header-text-soft);
}
.legal-content {
  max-width: 820px;
}
.legal-content section + section {
  margin-top: 2rem;
}
.legal-content h2 {
  color: var(--heading);
  font-size: 1.35rem;
  margin-bottom: 0.7rem;
}
.legal-content p {
  color: var(--text-soft);
  line-height: 1.75;
  margin-bottom: 0.7rem;
}
.legal-pending {
  background: #fff7d6;
  border-left: 4px solid var(--yellow-dark);
  color: #55430b;
  padding: 1rem 1.2rem;
  border-radius: var(--radius-sm);
  margin-bottom: 2.2rem;
  line-height: 1.6;
}
.legal-pending strong {
  display: block;
}
</style>
