import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import VueApexCharts from "vue3-apexcharts"
import App from './App.vue'
import './assets/global.css'
import router from './router'

import { apolloClient } from './apollo'

import { createPinia } from 'pinia'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

app.use(createPinia())
app.use(VueApexCharts)
app.use(router).mount('#app')
