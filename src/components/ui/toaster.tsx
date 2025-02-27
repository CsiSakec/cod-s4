"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast, ToastProps } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function (toast: ToastProps) {
        const { id, title, description, action, ...props } = toast as ToastProps & { id: string };
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

interface ToastParams {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function toast({ title, description, action }: ToastParams) {
  const { toast } = useToast()
  toast({ title, description, action })
}
