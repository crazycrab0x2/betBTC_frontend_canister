import { useToast } from 'vue-toastification'

const toast = useToast()
export const copyText = (content: string, message?: string) => {
  if (!content) return
  const tempInput = document.createElement('input')
  tempInput.value = content
  document.body.appendChild(tempInput)
  tempInput.select()
  tempInput.setSelectionRange(0, 99999)
  document.execCommand('copy')
  document.body.removeChild(tempInput)
  if (message) toast.success(message)
}
