export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  VerifyEmail: undefined;
};

export type MainTabParamList = {
  DashboardTab: undefined;
  WorklogsTab: undefined;
  MoreTab: undefined;
  ProfileTab: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type WorklogsStackParamList = {
  WorklogsList: undefined;
  WorklogDetail: { id: number };
  WorklogForm: { id?: number };
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  Reports: undefined;
  ReportForm: { id?: number };
  Slides: undefined;
  SlideForm: { id?: number };
  Interviews: undefined;
  InterviewForm: { id?: number };
  JobPostings: undefined;
  Leaves: undefined;
  LeaveForm: undefined;
  MentoringSessions: undefined;
  SessionForm: { id?: number };
  Contacts: undefined;
  ContactForm: undefined;
  MyInterns: undefined;
  Users: undefined;
  UserForm: { id?: number };
  Roles: undefined;
  Configuration: undefined;
  Calendar: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
