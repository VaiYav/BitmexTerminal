<template>
  <v-simple-table height="70vh" fixed-header>
    <template v-slot:default>
      <thead>
      <tr>
        <th class="text-left">Symbol</th>
        <th class="text-left">Price</th>
      </tr>
      </thead>
      <tbody>
      <tr
          style="cursor: pointer"
          v-for="instrument in getInstruments"
          :key="`${instrument.symbol}+${instrument.timestamp}`"
          :class="{ active: getSelectedQuotes === instrument.symbol }"
          @click="fetchQuotes(instrument.symbol)">
        <td>{{ instrument.symbol }}</td>
        <td>
          <transition name="fade" mode="out-in">
            <div :key="`${instrument.symbol}-${instrument.lastPrice}`">
              {{instrument.lastPrice}}
            </div>
          </transition></td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'QuotesTable',
  computed: {
    ...mapGetters(['getInstruments', 'getSelectedQuotes'])
  },
  methods: {
    ...mapActions(['selectQuotes', 'fetchQuotes', 'fetchInstrument']),
    fetchQuotes(symbol) {
      if (symbol !== this.getSelectedQuotes) this.selectQuotes({ oldQuotes: this.getSelectedQuotes, newQuotes: symbol })
    }
  },
  created() {
    this.fetchInstrument({
      query: process.env.VUE_APP_API_V1_VERSION + 'instrument/active',
      params: {},
      path: 'instrument'
    })
  }
}
</script>

<style scoped>

</style>