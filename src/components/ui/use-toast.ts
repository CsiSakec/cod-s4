// Simplified version of the toast hook
import { useState } from "react"

export type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props])
    
    if (props.duration !== Infinity) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t !== props))
      }, props.duration || 5000)
    }
  }

  return { toast, toasts }
}

export { toast } from "@/components/ui/toaster"
