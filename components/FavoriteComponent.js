import React from 'react';
import { FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

import {Loading} from './LoadingComponent';
import {deleteFavorite} from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
});

class Favorites extends React.Component{
    
    static navigationOptions = {
        title: 'My Favorites'
    }
    render() {

        const {navigate} = this.props.navigation;

        const renderMenuItem = ({item, index}) => {

            const rightButton = [
                {
                    text: 'Delete',
                    type: 'delete',
                    onPress: () => this.props.deleteFavorite(item.id)
                }
            ];

            return(
                <Swipeout right={rightButton} autoClose={true}>
                    <ListItem
                        key={index}
                        title={item.name}
                        subtitle={item.description}
                        hideChevron={true}
                        onPress={() => navigate('Disdetail', {dishId: item.id})}
                        leftAvatar={{source: {uri: baseUrl + item.image}}}
                    />
                </Swipeout>
            );
        }
       if(this.props.dishes.isLoading){
           return(
               <Loading />
           );
       }
       else if(this.props.dishes.errMess)
       {
           return(
               <View>
                   <Text>{this.props.dishes.errMess}</Text>
               </View>
           );
       }
       else{
           return(
               <FlatList
                    data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(el => el === dish.id))}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                />
         );
       }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);