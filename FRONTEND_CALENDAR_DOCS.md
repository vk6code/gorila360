# Frontend Calendar Documentation

This document describes the GraphQL operations used by the Frontend for the Calendar module. Use this to verify backend implementation.

## 1. Get User Calendar Range (Monthly/Weekly View)

**Operation Name:** `GetUserCalendarRange`
**Used In:** `StudentCalendarEdit.vue`, `StudentCalendarWeek.vue`

### Query

```graphql
query GetUserCalendarRange($userId: ID!, $startDate: String!, $endDate: String!) {
  getUserCalendarRange(userId: $userId, startDate: $startDate, endDate: $endDate) {
    date
    dayType {
      code
    }
    dayTypeColor
    workoutIcon
    isCompleted
    isToday
  }
}
```

### Expected Response (JSON)

```json
{
  "data": {
    "getUserCalendarRange": [
      {
        "date": "2025-11-29",
        "dayType": { "code": "A" },
        "dayTypeColor": "#3B82F6",
        "workoutIcon": "dumbbell",
        "isCompleted": false,
        "isToday": true
      }
    ]
  }
}
```

---

## 2. Get User Day Detail (Daily View)

**Operation Name:** `GetUserDayDetail`
**Used In:** `StudentCalendarDay.vue`

### Query

```graphql
query GetUserDayDetail($userId: ID!, $date: String!) {
  getUserDayDetail(userId: $userId, date: $date) {
    date
    dayType {
      code
    }
    calories
    steps
    workoutName
    focus
    caloriesDone
    stepsDone
    feedback {
      sensation
      recovery
    }
  }
}
```

### Expected Response (JSON)

```json
{
  "data": {
    "getUserDayDetail": {
      "date": "2025-11-29",
      "dayType": { "code": "A" },
      "calories": 2500,
      "steps": 15000,
      "workoutName": "Pierna Hipertrofia",
      "focus": "Cuádriceps",
      "caloriesDone": 1200,
      "stepsDone": 8500,
      "feedback": {
        "sensation": "good",
        "recovery": "full"
      }
    }
  }
}
```

---

## 3. Update Daily Plan (Single Day)

**Operation Name:** `UpdateDailyPlan`
**Used In:** `StudentCalendarDay.vue`

### Mutation

```graphql
mutation UpdateDailyPlan($userId: ID!, $date: String!, $input: DailyPlanInput!) {
  updateDailyPlan(userId: $userId, date: $date, input: $input) {
    date
    dayType {
      code
    }
    caloriesTarget
    stepsTarget
    caloriesDone
    stepsDone
  }
}
```

### Input Variable Example

```json
{
  "userId": "1",
  "date": "2025-11-29",
  "input": {
    "dayTypeId": "B",
    "stepsDone": 12000
  }
}
```

---

## 4. Bulk Update Daily Plans (Edit View)

**Operation Name:** `BulkUpdateDailyPlans`
**Used In:** `StudentCalendarEdit.vue`

### Mutation

```graphql
mutation BulkUpdateDailyPlans($userId: ID!, $inputs: [DailyPlanUpdateInput!]!) {
  bulkUpdateDailyPlans(userId: $userId, inputs: $inputs) {
    date
    dayType {
      code
    }
    status
  }
}
```

### Input Variable Example

```json
{
  "userId": "1",
  "inputs": [
    { "date": "2025-11-29", "dayTypeId": "A" },
    { "date": "2025-11-30", "dayTypeId": "REST" }
  ]
}
```
