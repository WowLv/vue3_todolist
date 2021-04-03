/**
 * 设置缓存
 */
const SetStorage = (key, value, type = 'session') => {
  return new Promise((resolve, reject) => {
    switch (type) {
      case 'session':
        try {
          sessionStorage.setItem(key, JSON.stringify(value))
          resolve()
        } catch (e) {
          reject(e)
        }
        break
      case 'local':
        try {
          localStorage.setItem(key, JSON.stringify(value))
          resolve()
        } catch (e) {
          reject(e)
        }
        break
    }
  })
}
/**
 * 获取缓存
 */
const GetStorage = (key, type = 'session') => {
  let r = null
  switch (type) {
    case 'session':
      if (sessionStorage.getItem(key)) {
        r = JSON.parse(sessionStorage.getItem(key))
      }
      break
    case 'local':
      if (localStorage.getItem(key)) {
        r = JSON.parse(localStorage.getItem(key))
      }
      break
  }
  return r
}

/**
 * 移除指定缓存
 */
const RemoveStorage = (key, type = 'session') => {
  return new Promise((resolve, reject) => {
    switch (type) {
      case 'session':
        try {
          sessionStorage.removeItem(key)
          resolve()
        } catch (e) {
          reject(e)
        }
        break
      case 'local':
        try {
          localStorage.removeItem(key)
          resolve()
        } catch (e) {
          reject(e)
        }
        break
    }
  })
}
/**
 * 清除所有的storage缓存
 */
const ClearStorage = (type = 'session') => {
  return new Promise((resolve, reject) => {
    switch (type) {
      case 'session':
        try {
          sessionStorage.clear()
          resolve()
        } catch (e) {
          reject(e)
        }
        break
      case 'local':
        try {
          localStorage.clear()
          resolve()
        } catch (e) {
          reject(e)
        }
        break
    }
  })
}
export default {
  SetStorage,
  GetStorage,
  RemoveStorage,
  ClearStorage
}
