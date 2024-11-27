import type { Notification } from '@/types/notificationTypes'
export const getNotificationTextFromType = (notification: Notification) => {
  const { content, types } = notification
  const typeKeys = Object.keys(types)
  if (content) {
    return content
  } else if (typeKeys.length) {
    switch (typeKeys[0]) {
      case 'Like':
        return '🤍 to your comment'
      case 'Unlike':
        return 'removed 🤍 to your comment'
      case 'ThumbUp':
        return '👍🏻 to your comment'
      case 'UnThumbUp':
        return 'removed 👍🏻 to your comment'
      case 'ThumbDown':
        return '👎🏻 to your comment'
      case 'UnThumbDown':
        return 'removed 👎🏻 to your comment'
      case 'Reply':
        return 'reply to your comment'
      default:
        return 'received a notification'
    }
  } else {
    return 'No content available'
  }
}
