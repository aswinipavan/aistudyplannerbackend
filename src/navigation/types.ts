import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
  Exams: undefined;
  AddExam: undefined;
};

export type TimetableStackParamList = {
  TimetableList: undefined; // To match TimetableScreen
  GenerateTimetable: undefined;
  StudySlotDetail: undefined;
  StudyTimer: { subjectId?: string; subjectName?: string };
};

export type SubjectsStackParamList = {
  SubjectsList: undefined;
  SubjectDetail: { subjectId: string };
  AddSubject: undefined;
  Materials: undefined;
};

export type AITutorStackParamList = {
  ChatSessions: undefined;
  Chat: { sessionId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Exams: undefined;
  Performance: undefined;
  Analytics: undefined;
  AddMark: undefined;
  Priority: undefined;
  Subscription: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  TimetableStack: NavigatorScreenParams<TimetableStackParamList>;
  SubjectsStack: NavigatorScreenParams<SubjectsStackParamList>;
  AITutorStack: NavigatorScreenParams<AITutorStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Onboarding: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
