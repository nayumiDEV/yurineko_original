export default function isEnableDarkmode(user) {
  if (!user) return false
  if (parseInt(user.role) != 1 || user.isPremium == true) return true
  return false
}
