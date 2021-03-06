import axios from '@/libs/api.request'

export const login = ({ user, passwd, type }) => {
  const data = {
    user,
    passwd
  }
  return axios.request({
    url: type + '/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (type) => {
  return axios.request({
    url: type + '/info',
    // params: {
    //   token
    // },
    method: 'get'
  })
}

export const logout = (type) => {
  return axios.request({
    url: type + '/logout',
    method: 'get'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
