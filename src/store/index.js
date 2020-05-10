import Vue from 'vue'
import Vuex from 'vuex'
import { getEntity, postEntity } from '@/api'
import io from 'socket.io-client'
import orderBy from 'lodash/orderBy'
const socket = io.connect('http://localhost');
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    instrument: [],
    selectedQuotes: 'XBTUSD',
    tradeBin1m: [],
    orders: []
  },
  getters: {
    getInstruments: state => orderBy(state.instrument.map(i => ({
      symbol: i.symbol,
      lastPrice: i.lastPrice,
      timestamp: i.timestamp
    })), ['symbol'], ['desc']).filter(i => i.symbol.search(/\./) === -1),
    getSymbols: state => state.instrument.map(i => i.symbol),
    getSelectedQuotes: state => state.selectedQuotes,
    getTradeBin1m: state => state.tradeBin1m,
    getOrders: state => state.orders.reverse().filter((i, ind) => ind <= 99),
    // getEntity: state => (path, iterates, orders) => orderBy(state[path], iterates, orders)
  },
  actions: {
    async fetchInstrument({ commit }, { query, data, path }) {
      const response = await getEntity({
        query: query,
        params: data
      })
      socket.emit('instrument')
      socket.on('instrument:response', (message) => {
        const response = JSON.parse(message)
        if (response.action) commit(`${response.action}`.toUpperCase(), { data: response.data, path: response.table });
      })
      commit('SET_DATA', { data: response.data, path });
    },
    selectQuotes({ commit, dispatch }, { newQuotes, oldQuotes }) {
      commit('SELECT_QUOTES', newQuotes)
      dispatch('fetchQuotes', { newQuotes, oldQuotes })
    },
    async fetchQuotes({ commit }, { newQuotes, oldQuotes }) {
      try {
        const response = await getEntity({
          query: process.env.VUE_APP_API_V1_VERSION + 'trade/bucketed',
          params: {
            binSize: '1m',
            partial: false,
            count: 100,
            reverse: true,
            symbol: newQuotes
          }
        })
        commit('SET_QUOTES', response.data)
        oldQuotes ? socket.emit('quotes:unsubscribe', oldQuotes) : ''
        socket.emit('quotes', newQuotes)
      } catch (e) {
        console.log(e)
      }
    },
    async createOrder({ commit, state }, { side, qty }) {
      try {
        const response = await postEntity({
          query: process.env.VUE_APP_API_V1_VERSION + 'order',
          params: {
            ordType: 'Market',
            symbol: state.selectedQuotes,
            orderQty: qty,
            side: side
          }
        })
        commit('SET_ENTITY', { data: response.data, path: 'orders' });
      } catch (e) {
        console.log(e)
      }
    },
    async fetchOrders({ commit }) {
      const response = await getEntity({
        query: process.env.VUE_APP_API_V1_VERSION + 'order'
      })
      commit('SET_DATA', { data: response.data, path: 'orders' });
    }
  },
  mutations: {
    SET_DATA(state, payload) {
      state[payload.path] = payload.data;
    },
    PARTIAL() {
      // state[payload.path] = payload.data;
    },
    UPDATE(state, payload) {
      state[payload.path] = state[payload.path].reduce((acc, curr) => {
        const entity = payload.data.find(c => c.symbol === curr.symbol)
        if (entity) acc.push({ ...curr, ...entity })
        else acc.push(curr)
        return acc
      }, [])
    },
    SELECT_QUOTES(state, payload) {
      state.selectedQuotes = payload
    },
    SET_QUOTES(state, payload) {
      state.tradeBin1m = payload
    },
    INSERT(state, payload) {
      if (!state[payload.path].find(p => p.timestamp === payload.data[0].timestamp)) {
        state[payload.path].splice(0, 0, payload.data[0])
        state[payload.path].splice(state[payload.path].length - 1, 1)
      }
    },
    SET_ENTITY(state, payload) {
      state[payload.path].push(payload.data)
      // state[payload.path].unshift(payload.data)
    }
  }
})
