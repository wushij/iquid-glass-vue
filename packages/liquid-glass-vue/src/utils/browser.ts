export const isFirefox =
  typeof navigator !== 'undefined'
  && navigator.userAgent.toLowerCase().includes('firefox')
