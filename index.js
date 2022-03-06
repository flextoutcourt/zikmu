/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import OneSignal from 'react-native-onesignal';

OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("046417d8-d5df-4ade-b19d-91e2954b6790");

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {

});

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    let notification = notificationReceivedEvent.getNotification();
    const data = notification.additionalData

    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {

});

AppRegistry.registerComponent(appName, () => App);
