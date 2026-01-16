import { useState } from "react"

interface UseErrorModalReturn {
  isErrorModalOpen: boolean
  errorTitle: string
  errorMessage: string
  showError: (title: string, message: string) => void
  closeErrorModal: () => void
}

export function useErrorModal(): UseErrorModalReturn {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [errorTitle, setErrorTitle] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const showError = (title: string, message: string) => {
    setErrorTitle(title)
    setErrorMessage(Array.isArray(message) ? message.join(', ') : message)
    setIsErrorModalOpen(true)
  }

  const closeErrorModal = () => {
    setIsErrorModalOpen(false)
  }

  return {
    isErrorModalOpen,
    errorTitle,
    errorMessage,
    showError,
    closeErrorModal,
  }
}
