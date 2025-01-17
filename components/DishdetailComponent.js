import React from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

import {postFavorite, postComment} from '../redux/ActionCreators';
import { COMMENTS_FAILED } from '../redux/ActionTypes';

import { DISHES } from "../shared/dishes";
import { COMMENTS } from "../shared/comments";

import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {
    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recogniseDrag = ({moveX, moveY, dx, dy}) => {
        if (dx <- 200)
            return true;
        else
            return false;
    };

    const recogniseComment = ({moveX, moveY, dx, dy}) => {
        if (dx > 200)
            return true;
        else
            return false;
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
        this.view.rubberBand(1000)
        .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recogniseDrag(gestureState))
                Alert.alert(
                    'Add to Favorites',
                    'Are you sure you wish t0 add' + dish.name + 'to your favotites',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Operation Cancelled'),
                            style:'cancel'
                        },
                        {
                            text: 'Ok',
                            onPress: () => props.favorite ? console.log('Already favorite') : props.onPress()
                        }
                    ],
                    {cancelable: false}
                )
            if (recogniseComment(gestureState))
                props.onAddCommentPress()    
            return true;
        }
    });

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share' + title
        });
    }

    if( dish!= null) {
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
            <Card
            featuredTitle={dish.name}
            image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                />
                <Icon
                    raised={true}
                    reverse={true}
                    name="pencil"
                    type="font-awesome"
                    color="#512DA8"
                    onPress={() => props.onAddCommentPress()}
                />
                <Icon
                    raised
                    reverse
                    name='share'
                    type='font-awesome'
                    color='#51d2a8'
                    onPress={() => shareDish(dish.name, dish.description, baseUrl+dish.image)}
                />
            </Card>
            </Animatable.View>
        );
    }
    else{
        return(<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>
    );
}

class Dishdetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          dishes: DISHES,
          comments: COMMENTS,
          favorites: [],
          showModal: false,
          rating: 5,
          author: "",
          comment: "",
        };
      }
    
      toggleModal() {
        this.setState({ showModal: !this.state.showModal });
      }
    
      resetForm() {
        this.setState({
          rating: 5,
          author: "",
          comment: "",
        });
      }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'

    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    onAddCommentPress={() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                >
                <View style={{ marginTop: 40 }}>
                <Rating
                    showRating
                    minValue={1}
                    onFinishRating={(value) => this.setState({ rating: value })}
                    style={{ paddingVertical: 10 }}
                    startingValue={5}
                />
                <Input
                    placeholder="Author"
                    leftIcon={{ type: "font-awesome", name: "user-o" }}
                    onChangeText={(value) => this.setState({ author: value })}
                />
                <Input
                    placeholder="Comment"
                    leftIcon={{ type: "font-awesome", name: "comment-o" }}
                    onChangeText={(value) => this.setState({ comment: value })}
                />
                <Button
                    onPress={() => {
                        this.props.postComment(
                        dishId,
                        this.state.rating,
                        this.state.author,
                        this.state.comment
                        );
                    this.toggleModal();
                    this.resetForm();
                    }}
                    color="#512DA8"
                    title="Submit"
                />
                <Button
                    onPress={() => {
                        this.toggleModal();
                        this.resetForm();
                    }}
                    color="grey"
                    title="Cancel"
                />
                </View>
                </Modal>
            
            </ScrollView>
            
          );
    }
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);