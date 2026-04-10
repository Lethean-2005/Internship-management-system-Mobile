import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { IconHome, IconFileText, IconGridDots, IconUser, IconHomeFilled, IconFileTextFilled, IconLayoutGridFilled, IconUserFilled } from '@tabler/icons-react-native';
import { colors } from '../lib/theme';
import type { MainTabParamList, DashboardStackParamList, WorklogsStackParamList, MoreStackParamList, ProfileStackParamList } from './types';

// Screens
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { WorklogsScreen } from '../screens/main/WorklogsScreen';
import { WorklogDetailScreen } from '../screens/main/WorklogDetailScreen';
import { WorklogFormScreen } from '../screens/main/WorklogFormScreen';
import { MoreMenuScreen } from '../screens/main/MoreMenuScreen';
import { ReportsScreen } from '../screens/main/ReportsScreen';
import { SlidesScreen } from '../screens/main/SlidesScreen';
import { InterviewsScreen } from '../screens/main/InterviewsScreen';
import { JobPostingsScreen } from '../screens/main/JobPostingsScreen';
import { LeavesScreen } from '../screens/main/LeavesScreen';
import { MentoringSessionsScreen } from '../screens/main/MentoringSessionsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { EditProfileScreen } from '../screens/main/EditProfileScreen';
import { PersonalInformationScreen } from '../screens/main/PersonalInformationScreen';
import { SecurityScreen } from '../screens/main/SecurityScreen';
import { MyInternsScreen } from '../screens/main/MyInternsScreen';
import { CalendarScreen } from '../screens/main/CalendarScreen';
import { UsersScreen } from '../screens/main/UsersScreen';
import { UserFormScreen } from '../screens/main/UserFormScreen';
import { RolesScreen } from '../screens/main/RolesScreen';
import { ConfigurationScreen } from '../screens/main/ConfigurationScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const WorklogsStack = createNativeStackNavigator<WorklogsStackParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function DashboardNavigator() {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
    </DashboardStack.Navigator>
  );
}

function WorklogsNavigator() {
  const { t } = useTranslation();
  return (
    <WorklogsStack.Navigator>
      <WorklogsStack.Screen name="WorklogsList" component={WorklogsScreen} options={{ title: t('worklogs.title') }} />
      <WorklogsStack.Screen name="WorklogDetail" component={WorklogDetailScreen} options={{ title: t('worklogs.title') }} />
      <WorklogsStack.Screen name="WorklogForm" component={WorklogFormScreen} options={{ title: t('worklogs.newWorklog') }} />
    </WorklogsStack.Navigator>
  );
}

function MoreNavigator() {
  const { t } = useTranslation();
  return (
    <MoreStack.Navigator>
      <MoreStack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ title: 'More' }} />
      <MoreStack.Screen name="Reports" component={ReportsScreen} options={{ title: t('reports.title') }} />
      <MoreStack.Screen name="Slides" component={SlidesScreen} options={{ title: t('slides.title') }} />
      <MoreStack.Screen name="Interviews" component={InterviewsScreen} options={{ title: t('interviews.title') }} />
      <MoreStack.Screen name="JobPostings" component={JobPostingsScreen} options={{ title: t('jobPostings.title') }} />
      <MoreStack.Screen name="Leaves" component={LeavesScreen} options={{ title: t('leaves.title') }} />
      <MoreStack.Screen name="MentoringSessions" component={MentoringSessionsScreen} options={{ title: t('mentoring.title') }} />
      <MoreStack.Screen name="MyInterns" component={MyInternsScreen} options={{ title: 'My Interns' }} />
      <MoreStack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
    </MoreStack.Navigator>
  );
}

function ProfileNavigator() {
  const { t } = useTranslation();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: t('profile.accountSettings') }} />
      <ProfileStack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={{ title: t('auth.personalInfo') }} />
      <ProfileStack.Screen name="Security" component={SecurityScreen} options={{ title: t('profile.security') }} />
      <ProfileStack.Screen name="Users" component={UsersScreen} options={{ title: t('sidebar.users') }} />
      <ProfileStack.Screen
        name="UserForm"
        component={UserFormScreen}
        options={({ route }) => ({ title: route.params?.id ? t('users.editUser') : t('users.createUser') })}
      />
      <ProfileStack.Screen name="Roles" component={RolesScreen} options={{ title: t('sidebar.roles') }} />
      <ProfileStack.Screen name="Configuration" component={ConfigurationScreen} options={{ title: t('config.title') }} />
    </ProfileStack.Navigator>
  );
}

const tabIcons = {
  DashboardTab: { outline: IconHome, filled: IconHomeFilled },
  WorklogsTab: { outline: IconFileText, filled: IconFileTextFilled },
  MoreTab: { outline: IconGridDots, filled: IconLayoutGridFilled },
  ProfileTab: { outline: IconUser, filled: IconUserFilled },
} as const;

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: colors.gray[400],
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: 8,
          paddingTop: 10,
          height: 60,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = tabIcons[route.name as keyof typeof tabIcons];
          const TabIcon = focused ? icons.filled : icons.outline;
          return <TabIcon size={24} color={color} strokeWidth={focused ? 0 : 1.5} />;
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="WorklogsTab" component={WorklogsNavigator} options={{ title: 'Worklogs' }} />
      <Tab.Screen name="MoreTab" component={MoreNavigator} options={{ title: 'More' }} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
