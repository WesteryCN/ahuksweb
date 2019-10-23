import axios from '@/libs/api.request'

const prefix = 'teacher'

export const setPassword = function ({ passwd }) {
  return axios.request({
    url: prefix + '/setpasswd',
    data: {
      passwd
    },
    method: 'post'
  })
}

export const getClasses = function ({ c_id = null }) {
  return axios.request({
    url: prefix + '/getclass',
    data: {
      c_id
    },
    method: 'post'
  })
}

export const getStudent = function (c_id) {
  return axios.request({
    url: prefix + '/liststd',
    data: {
      c_id
    },
    method: 'post'
  })
}
