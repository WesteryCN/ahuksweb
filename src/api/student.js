import axios from '@/libs/api.request'

const prefix = 'student'

export const getExam = function (status) {
  return axios.request({
    url: prefix + '/getexam',
    params: {
      status
    },
    method: 'get'
  })
}

export const getQues = function (exam_id) {
  return axios.request({
    url: prefix + '/getquestion',
    data: {
      exam_id
    },
    method: 'post'
  })
}

export const startAsk = function (exam_id) {
  return axios.request({
    url: prefix + '/startask',
    data: {
      exam_id
    },
    method: 'post'
  })
}

export const endAsk = function (exam_id, cheat, stu_ans) {
  return axios.request({
    url: prefix + '/endask',
    data: {
      exam_id,
      cheat,
      stu_ans
    },
    method: 'post'
  })
}

export const getScore = function (exam_id) {
  return axios.request({
    url: prefix + '/getmyscore',
    data: {
      exam_id
    },
    method: 'post'
  })
}
