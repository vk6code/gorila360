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
      feedback {
        sensation
        recovery
      }
    }
  }
`;
