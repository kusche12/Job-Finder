import Expo, { Notifications } from 'expo';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import registerforNotifications from './src/services/push_notifications';

import AuthScreen from './src/screens/AuthScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import DeckScreen from './src/screens/DeckScreen';
import MapScreen from './src/screens/MapScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import SettingsScreen from './src/screens/SettingsScreen';
class App extends React.Component {
  componentDidMount() {
    registerforNotifications();
    Notifications.addListener((notification) => {
      const { data: { text }, origin } = notification;

      if (origin === 'received' && text) {
        Alert.alert(
          'New Push Notification',
          text,
          [{ text: 'Ok.' }]
        );
      }
    });
  }

  render() {
    const reviewFlow = createStackNavigator({
      Review: ReviewScreen,
      Settings: SettingsScreen
    })
    
    reviewFlow.navigationOptions = {
      title: 'Review',
      tabBarIcon: ({tintColor}) => <Icon name="favorite" size={30} color={tintColor} />
    }
    
    const MainNavigator = createBottomTabNavigator({
      Welcome: WelcomeScreen,
      Auth: AuthScreen,
      mainFlow: createBottomTabNavigator({
        Map: MapScreen,
        Deck: DeckScreen,
        reviewFlow
      }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
          labelStyle: { fontSize: 12 }
        }
      })
    }, { 
      defaultNavigationOptions: {
        tabBarVisible: false
      },
      lazy: true // Only render current screen (this is important)
    });
    
    const AppWrapped = createAppContainer(MainNavigator);

    return (
      <Provider store={store}>
        <AppWrapped />
      </Provider>
    );
  }
}

export default App;
//Expo.registerRootComponent(App);