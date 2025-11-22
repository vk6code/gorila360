# Frontend Context for Backend Development

## Project Overview

- **Stack**: Vue 3, Vite, Tailwind CSS, Apollo Client (GraphQL).
- **PWA**: Fully configured with `vite-plugin-pwa`.
- **Styling**: "Dark gritty gym" aesthetic (dark mode, orange accents).

## Configuration

- **GraphQL Endpoint**: Configured in `src/main.js` using `import.meta.env.VITE_GRAPHQL_URI`.
- **Production URL**: `https://api.gorila360.es/graphql` (set in `.env.production`).

## Required Backend Features

### 1. Dashboard Data (`DashboardView.vue`)

The dashboard currently uses mock data. The backend needs to provide a GraphQL query to replace this.

**Current Mock Data Structure:**

```javascript
const user = { name: 'Alejandro' }
const dailyWorkout = {
  title: 'Entreno de Pierna',
  image: '/assets/leg-day-bg.jpg', // URL to image
}
const stats = {
  streak: 3, // Current streak
  streakTarget: 4, // Target streak
  visual: 75, // Progress percentage
  mission: 4, // Mission percentage
  tshirt: 6, // Months until t-shirt reward
  pack: 2, // Renewals count
}
```

### 2. Diet Plan Data (`DietView.vue`)

The diet view expects a `userDietPlan` query.

**Required GraphQL Schema:**

```graphql
type DietItem {
  name: String!
  amount: String!
}

type UserDietPlan {
  userName: String!
  fatsPlanned: [DietItem!]!
  carbsPlanned: [DietItem!]!
  proteinsPlanned: [DietItem!]!
}

type Query {
  userDietPlan: UserDietPlan
}
```

## Deployment

- **Domain**: `gorila360.es`
- **CI/CD**: GitHub Actions deploys to Hetzner via SSH.
