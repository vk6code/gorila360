# Backend Additions for Calendar

To support the new calendar features (bulk updates, mobile drag & drop optimizations), please consider adding the following to the backend:

## 1. Bulk Update Mutation

Currently, the frontend sends multiple `updateDailyPlan` mutations when saving changes in the calendar editor. A bulk mutation would be more efficient.

**Schema Definition:**

```graphql
input DailyPlanUpdateInput {
  date: String!
  dayTypeId: String # or ID
  # stepsDone, caloriesDone optional if only updating planning
}

extend type Mutation {
  bulkUpdateDailyPlans(userId: ID!, inputs: [DailyPlanUpdateInput!]!): [DailyPlan]
}
```

**Resolver Logic:**

- Iterate through `inputs`.
- For each input, perform the upsert/update logic similar to `updateDailyPlan`.
- Return the list of updated plans.

## 2. Default Targets in DayType

Ensure the `DayType` model or configuration in the backend reflects the business rules for default targets if they are not explicitly set on the plan:

- **Training Days (A, B, C, D)**: Default Steps Target = 15,000
- **Rest Days (REST)**: Default Steps Target = 20,000

This ensures that when `getUserDayDetail` is called, the `steps` field returns these defaults if no specific override exists.

## 3. Auth Handling

Ensure all calendar queries (`getUserCalendarRange`, `getUserDayDetail`) return a clear error or empty state if the `userId` does not match the authenticated user (or if no user is authenticated), to prevent data leakage or "loading forever" states.
