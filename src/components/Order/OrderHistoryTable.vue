<template>
  <v-simple-table dense height="70vh" fixed-header>
    <template v-slot:default>
      <thead>
      <tr>
        <th class="text-left">Number</th>
        <th class="text-left">Timestamp</th>
        <th class="text-left">Symbol</th>
        <th class="text-left">Side</th>
        <th class="text-left">Price</th>
        <th class="text-left">orderQty</th>
        <th class="text-left">ordStatus</th>
        <th class="text-left">orderID</th>
      </tr>
      </thead>
      <transition-group name="list-complete" tag="tbody">
        <tr v-for="(order, orderIndex) in getOrders" :key="order.timestamp">
          <td>{{ orderIndex + 1 }}</td>
          <td>{{ order.timestamp }}</td>
          <td>{{ order.symbol }}</td>
          <td>{{ order.side }}</td>
          <td>{{ order.price }}</td>
          <td>{{ order.orderQty }}</td>
          <td>{{ order.ordStatus }}</td>
          <td>{{ order.orderID }}</td>
        </tr>
      </transition-group>
    </template>
  </v-simple-table>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'OrderHistoryTable',
  computed: {
    ...mapGetters(['getOrders'])
  },
  methods: {
    ...mapActions(['fetchOrders']),
  },
  created() {
    this.fetchOrders()
  }
}
</script>

<style scoped>

</style>