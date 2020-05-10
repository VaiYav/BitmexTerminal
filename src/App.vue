<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>
    <v-content app>
      <div class="d-flex">
        <div style="width: 33%">
          <quotes-table></quotes-table>
        </div>
        <v-divider vertical></v-divider>
        <div style="width: 66%">
          <quotes-history-table></quotes-history-table>
        </div>
        <v-divider vertical></v-divider>
        <div style="width: 33%">
          <order-form></order-form>
        </div>
      </div>
      <order-history-table></order-history-table>
    </v-content>
    <vue-snotify></vue-snotify>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
    OrderForm: () => import('@/components/Order/OrderForm'),
    OrderHistoryTable: () => import('@/components/Order/OrderHistoryTable'),
    QuotesTable: () => import('@/components/Quotes/QuotesTable'),
    QuotesHistoryTable: () => import('@/components/Quotes/QuotesHistoryTable'),
  }
};
</script>

<style lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .active {
    background: #c1c1c1;
  }
  .list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
  }
  .list-complete-enter, .list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .list-complete-leave-active {
    position: absolute;
  }
</style>