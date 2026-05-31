import { useState } from 'react'

export default function useToast() {
    const [toast, setToast] = useState(null)

    const showToast = (message, type = 'error') => {
        setToast({ message, type })
    }

    const hideToast = () => setToast(null)

    return { toast, showToast, hideToast }
}