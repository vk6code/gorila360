import gql from 'graphql-tag';

export const GET_USER_CALENDAR_RANGE = gql`
  query GetUserCalendarRange($userId: ID!, $startDate: String!, $endDate: String!) {
    getUserCalendarRange(userId: $userId, startDate: $startDate, endDate: $endDate) {
      date
      dayType
      dayTypeColor
      workoutIcon
      isCompleted
      isToday
    }
  }
`;

export const GET_USER_DAY_DETAIL = gql`
  query GetUserDayDetail($userId: ID!, $date: String!) {
    getUserDayDetail(userId: $userId, date: $date) {
      date
      dayType
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
`;

export const UPDATE_DAILY_PLAN = gql`
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
`;
