import axios from 'axios'
import Vue from 'vue'
const service = axios.create({
  baseURL: 'http://localhost:80',
  headers: {
      'content-type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 125000
})

service.interceptors.request.use(
  config => {
      return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    Vue.prototype.$snotify.success('message', 'Success', {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
    return response
  },
  error => {
    console.log('err' + error)
    Vue.prototype.$snotify.error(error.response.data.error || 'Something went wrong', 'Error', {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
    return Promise.reject(error)
  }
)

export default service
