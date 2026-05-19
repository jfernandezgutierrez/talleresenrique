import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useContactStore = defineStore('contact', () => {
  const sending = ref(false)
  const sent    = ref(false)
  const error   = ref(null)

  // Simula envío (aquí se integraría con un backend, EmailJS, Formspree, etc.)
  async function sendMessage(payload) {
    sending.value = true
    error.value   = null
    try {
      // Simulación de llamada asíncrona
      await new Promise(resolve => setTimeout(resolve, 900))
      console.log('Mensaje enviado:', payload)
      sent.value = true
    } catch (e) {
      error.value = 'Error al enviar el mensaje. Por favor inténtalo de nuevo.'
    } finally {
      sending.value = false
    }
  }

  function reset() {
    sent.value    = false
    error.value   = null
    sending.value = false
  }

  return { sending, sent, error, sendMessage, reset }
})
