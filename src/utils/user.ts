import type { PickedUser } from '@/types/marketDataTypes'

export const getDisplayName = (u: PickedUser) => {
  if (u.displayName) {
    return u.displayName
  } else if (u.handle) {
    return u.handle
  } else if (u.avatar) {
    return u.avatar
  }
  return u.id
}
