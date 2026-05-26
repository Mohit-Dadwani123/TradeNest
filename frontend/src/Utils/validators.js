// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Password validation (min 6 chars, at least one number and one letter)
export const validatePassword = (password) => {
  const hasMinLength = password.length >= 6
  const hasNumber = /\d/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  return hasMinLength && hasNumber && hasLetter
}

// Stock symbol validation
export const validateStockSymbol = (symbol) => {
  const regex = /^[A-Z]{1,5}$/
  return regex.test(symbol.toUpperCase())
}

// Quantity validation (positive integer)
export const validateQuantity = (quantity) => {
  const num = Number(quantity)
  return !isNaN(num) && Number.isInteger(num) && num > 0 && num <= 100000
}

// Price validation
export const validatePrice = (price) => {
  const num = Number(price)
  return !isNaN(num) && num > 0 && num <= 10000000
}

// Order type validation
export const validateOrderType = (type) => {
  return ['BUY', 'SELL'].includes(type.toUpperCase())
}

// Order duration validation
export const validateOrderDuration = (duration) => {
  return ['DAY', 'GTC', 'IOC'].includes(duration.toUpperCase())
}

// Phone number validation (Indian format)
export const validatePhoneNumber = (phone) => {
  const regex = /^[6-9]\d{9}$/
  return regex.test(phone)
}

// PAN card validation
export const validatePAN = (pan) => {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return regex.test(pan)
}

// Date validation (YYYY-MM-DD)
export const validateDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(date)) return false
  const d = new Date(date)
  return d instanceof Date && !isNaN(d)
}

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {}
  
  for (const field in rules) {
    const value = data[field]
    const rule = rules[field]
    
    if (rule.required && !value) {
      errors[field] = `${field} is required`
    } else if (value) {
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${field} must be less than ${rule.maxLength} characters`
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message || `${field} is invalid`
      }
      if (rule.custom && !rule.custom(value)) {
        errors[field] = rule.message || `${field} is invalid`
      }
    }
  }
  
  return errors
}