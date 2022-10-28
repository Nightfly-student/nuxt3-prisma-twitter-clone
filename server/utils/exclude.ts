
export function exclude(any, ...keys) {
    for (let key of keys) {
      delete any[key]
    }
    return any
}