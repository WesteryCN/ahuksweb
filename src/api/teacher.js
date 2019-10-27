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

export const getExam = function (exam_id = null) {
  return axios.request({
    url: prefix + '/listexam',
    data: {
      exam_id
    },
    method: 'post'
  })
}

export const getProblem = function (exam_id) {
  return axios.request({
    url: prefix + '/listques',
    data: {
      exam_id
    },
    method: 'post'
  })
}

export const delProblem = function ({ exam_id, q_rank }) {
  return axios.request({
    url: prefix + '/delques',
    data: {
      exam_id,
      q_rank
    },
    method: 'post'
  })
}

export const getLeftScore = function (exam_id) {
  return axios.request({
    url: prefix + '/leftscore',
    data: {
      exam_id
    },
    method: 'post'
  })
}

export const addProblem = function (data) {
  return axios.request({
    url: prefix + '/addques',
    data: data,
    method: 'post'
  })
}

export const getClassExam = function (class_id) {
  return axios.request({
    url: prefix + '/listlink',
    data: {
      class_id
    },
    method: 'post'
  })
}

export const addClassExam = function ({ class_id, exam_id }) {
  return axios.request({
    url: prefix + '/linkexam',
    data: {
      class_id,
      exam_id
    },
    method: 'post'
  })
}

export const delClassExam = function ({ class_id, exam_id }) {
  return axios.request({
    url: prefix + '/dellink2',
    data: {
      class_id,
      exam_id
    },
    method: 'post'
  })
}
