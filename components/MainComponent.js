import React, { Component } from 'react';
import Home from './HomeComponent'

import Menu from './MenuComponent';
import About from './AboutComponent';

import Dishdetail from './DishdetailComponent';
import Contact from './ContactComponent';
import Reservation from './ReservationComponent';

import { View, Platform, Image, StyleSheet, Text, ScrollView } from 'react-native';
import { createStackNavigator,createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import {Icon} from 'react-native-elements';

import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
})


const MenuNavigator = createStackNavigator({
  Menu: { screen: Menu,
    navigationOptions: ({navigation}) => ({
      headerLeft: <Icon name= 'menu'
                        size={24}
                        color='white'
                        onPress={() => navigation.toggleDrawer()}
                        />
    })
  },
  Dishdetail: { screen: Dishdetail }
},
{
  initialRouteName: 'Menu',
  navigationOptions: {
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          color: "#fff"            
      }
  }
}
);


const HomeNavigator = createStackNavigator({
  Home: { screen: Home }
},
{
  navigationOptions: ({navigation}) => ({
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          color: "#fff"            
      },
      headerLeft: <Icon name= 'menu'
      size={24}
      color='white'
      onPress={() => navigation.toggleDrawer()}
      />
  })
});

const ContactNavigator = createStackNavigator({
  Contact: { screen: Contact }
},
{
  navigationOptions: ({navigation}) => ({
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          color: "#fff"            
      },
      headerLeft: <Icon name= 'menu'
      size={24}
      color='white'
      onPress={() => navigation.toggleDrawer()}
      />
  })
});

const AboutNavigator = createStackNavigator({
  About: { screen: About },
},
{
  navigationOptions: ({navigation}) => ({
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          color: "#fff"            
      },
      headerLeft: <Icon name= 'menu'
      size={24}
      color='white'
      onPress={() => navigation.toggleDrawer()}
      />
  })
}
);

const ReservationNavigator = createStackNavigator({
  Contact: { screen: Reservation }
},
{
  navigationOptions: ({navigation}) => ({
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          color: "#fff"            
      },
      headerLeft: <Icon name= 'menu'
      size={24}
      color='white'
      onPress={() => navigation.toggleDrawer()}
      />
  })
});

const CustomDrawerContentComponent= (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container}
                  forceInset={{top:'always', horizontal:'never'}}>
      <View style={styles.drawerHeader}>
        <View style={{flex:1}}>
          <Image source={require('./images/logo.png')}
                  style={styles.drawerImage} 
          />
        </View>
        <View style={{flex:2}}>
          <Text style={styles.drawerHeaderText}>Ristorante Confusion</Text>
        </View>
      </View>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const MainNavigator = createDrawerNavigator({
  Home: 
    { screen: HomeNavigator,
      navigationOptions: {
        title: 'Home',
        drawerLabel: 'Home',
        drawerIcon: ({tintcolor}) => (
          <Icon
                name='home'
                type='font-awesome'
                size={24}
                color={tintcolor}
          />
        )
      }
    },
  Menu: 
    { screen: MenuNavigator,
      navigationOptions: {
        title: 'Menu',
        drawerLabel: 'Menu',
        drawerIcon: ({tintcolor}) => (
          <Icon
                name='list'
                type='font-awesome'
                size={24}
                color={tintcolor}
          />
        )
      }, 
    },
    About: 
    { screen: AboutNavigator,
      navigationOptions: {
        title: 'About',
        drawerLabel: 'About',
        drawerIcon: ({tintcolor}) => (
          <Icon
                name='info-circle'
                type='font-awesome'
                size={24}
                color={tintcolor}
          />
        )
      }, 
    },
    Contact: 
    { screen: ContactNavigator,
      navigationOptions: {
        drawerLabel: 'Contact Us',
        drawerIcon: ({tintcolor}) => (
          <Icon
                name='address-card'
                type='font-awesome'
                size={22}
                color={tintcolor}
          />
        )
      }, 
    },
    Reservation: 
    { screen: ReservationNavigator,
      navigationOptions: {
        title: 'Reserve Tabel',
        drawerLabel: 'Rserve tabel',
        drawerIcon: ({tintcolor}) => (
          <Icon
                name='cutlery'
                type='font-awesome'
                size={22}
                color={tintcolor}
          />
        )
      }, 
    },
}, {
drawerBackgroundColor: '#D1C4E9',
contentComponent: CustomDrawerContentComponent
});


class Main extends Component {
  
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }
/*
  onDishSelect(dishId) {
    this.setState({selectedDish: dishId})
}
*/
  render() {
 
    return (
      <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
        <MainNavigator />
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  drawerHeader:{
    backgroundColor:'#512ad8',
    height:140,
    alignItems: 'center',
    justifyContent:'center',
    flex:1,
    flexDirection:'row'
  },
  drawerHeaderText:{
    color: 'white',
    fontSize: 24,
    fontWeight:'bold'
  },
  drawerImage:{
    margin:10,
    width: 80,
    height: 60
  }
})
  
export default connect(mapStateToProps, mapDispatchToProps)(Main);

/*
<Menu dishes={this.state.dishes} onPress={(dishId) => this.onDishSelect(dishId)} />
<Dishdetail dish={this.state.dishes.filter((dish) = 

  */