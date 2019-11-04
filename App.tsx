import { Notifications } from 'expo';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

const App: React.FC = () => {
  const today = new Date();

  const askPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync('notifications');
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return false;
    }
    return true;
  };

  const scheduleNotification = async () => {
    const schedule = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      hour: today.getHours(),
      minute: today.getMinutes() + 2
    };
    Notifications.scheduleNotificationWithCalendarAsync(
      {
        title: "I'm Scheduled",
        body: "Wow, I can show up even when app is closed",
        data: 'aaaa',
        ios: {
          sound: true,
        }
      },
      schedule
    ).then(id => {
      console.log(id);
    });
  };

  askPermissions();

  if (!TaskManager.isTaskDefined('setAlarm')) {
    TaskManager.defineTask('setAlarm', body => {
      scheduleNotification();
    });
  }

  BackgroundFetch.registerTaskAsync('setAlarm', {
    minimumInterval: 60 * 2
  });

  return (
    <View style={styles.container}>
      <Button
        title={"Schedule Notification"}
        onPress={() => scheduleNotification()}
      />
      <Button
        title="Cancel Scheduled Notifications"
        onPress={() => Notifications.cancelAllScheduledNotificationsAsync()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;