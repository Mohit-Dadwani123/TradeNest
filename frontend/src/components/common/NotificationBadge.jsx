import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NotificationBadge = ({ count, max = 99 }) => {
  if (count === 0) return null

  const displayCount = count > max ? `${max}+` : count

  return (
    <AnimatePresence>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
      >
        {displayCount}
      </motion.span>
    </AnimatePresence>
  )
}

export default NotificationBadge