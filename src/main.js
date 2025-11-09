import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import App from './App.vue'
import './assets/global.css'  
import router from './router'


// --- 1. Configura el enlace a tu API de GraphQL ---
const httpLink = createHttpLink({
  // Asegúrate de que esta sea la URL de tu backend de FastAPI
  uri: 'http://localhost:8000/graphql', 
})

// --- 2. Crea el cliente de Apollo con su caché ---
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

// --- 3. Provee el cliente a toda la aplicación ---
const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

app.use(router).mount('#app')
