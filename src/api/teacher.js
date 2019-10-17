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
