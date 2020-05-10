<template>
  <v-simple-table dense height="70vh" fixed-header>
    <template v-slot:default>
      <thead>
      <tr>
        <th class="text-left">Number</th>
        <th class="text-left">Timestamp</th>
        <th class="text-left">Open</th>
        <th class="text-left">High</th>
        <th class="text-left">Low</th>
        <th class="text-left">Close</th>
        <th class="text-left">GrossValue</th>
      </tr>
      </thead>
      <transition-group name="list-complete" tag="tbody">
        <tr v-for="(tradeBin1m, tradeBin1mIndex) in getTradeBin1m" :key="tradeBin1m.timestamp">
          <td>{{ tradeBin1mIndex + 1 }}</td>
          <td>{{ tradeBin1m.timestamp }}</td>
          <td>{{ tradeBin1m.open }}</td>
          <td>{{ tradeBin1m.high }}</td>
          <td>{{ tradeBin1m.low }}</td>
          <td>{{ tradeBin1m.close }}</td>
          <td>{{ tradeBin1m.volume }}</td>
        </tr>
      </transition-group>
    </template>
  </v-simple-table>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'QuotesHistoryTable',
  computed: {
    ...mapGetters(['getTradeBin1m', 'getSelectedQuotes'])
  },
  methods: {
    ...mapActions(['fetchQuotes']),
  },
  created() {
    this.fetchQuotes({ newQuotes: this.getSelectedQuotes })
  }
}
</script>

<style scoped>

</style>