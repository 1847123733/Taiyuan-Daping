import Cookies from 'js-cookie'
const TokenKey = 'Admin-Token'
const RolesKey = 'Admin-Roles'
const UsernameKey = 'Admin-Username'
export function getToken () {
  return Cookies.get(TokenKey)
}
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken () {
  return Cookies.remove(TokenKey)
}
export function getRoles () {
  return Cookies.get(RolesKey)
}
export function setRoles (roles) {
  return Cookies.set(RolesKey, roles)
}
export function removeRoles () {
  return Cookies.remove(RolesKey)
}
export function getUsername () {
  return Cookies.get(UsernameKey)
}
export function setUsername (username) {
  return Cookies.set(UsernameKey, username)
}
export function removeUsername () {
  return Cookies.remove(UsernameKey)
}
