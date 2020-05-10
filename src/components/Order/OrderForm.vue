<template>
  <div>
    <v-text-field
      label="Order"
      type="number"
      placeholder="Place qty"
      v-model.number="qty"
    ></v-text-field>
    <div class="d-flex">
      <v-btn @click="createOrder({ side: 'Buy', qty })" color="success">Buy</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="createOrder({ side: 'Sell', qty })" color="error">Sell</v-btn>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: "OrderForm",
    data() {
      return {
        qty: 1
      }
    },
    methods: {
      ...mapActions(['createOrder']),
    }
  }
</script>

<style scoped>

</style>