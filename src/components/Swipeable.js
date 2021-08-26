import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  List,
  ListItem,
  Left,
  Right
} from 'native-base';
import PropTypes from 'prop-types';
import Interactable from 'react-native-interactable';

const style = StyleSheet.create({
  cardHeader: {
    backgroundColor: '#F0EFF5',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  cardHeaderText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  containerNormal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: -250,
    marginTop: -30,
    marginBottom: -30
  },
  miniContainer: {
    marginBottom: -250
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,.8)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container1: {
    flex: 1
  }
});

export default class Swipeable extends React.Component {
  static HorizontalMargin = 10;
  static VerticalMargin = 20;
  static BoundaryPadding = 30;
  static BoundaryBounce = 0;
  static ContainerToCardWidthRatio = 1.35;

  static propTypes = {
    cards: PropTypes.array.isRequired
  };

  state = {
    cardWidth: 0,
    swipeableWidth: 0,
    snapPoints: [],
    swipeableBoundary: 0
  };

  onLayout = e => {
    const containerWidth = e.nativeEvent.layout.width;
    const { cards } = this.props;

    // calculate the width of a card
    const cardWidth = containerWidth / Swipeable.ContainerToCardWidthRatio;
    this.setState({ cardWidth });

    // calculate total swipeable width
    const swipeableWidth = cardWidth * cards.length;
    this.setState({ swipeableWidth });

    // calculate incrementation amount for snap points
    const incrementAmountForOuterCards =
      cardWidth - (containerWidth - cardWidth) / 2 + Swipeable.HorizontalMargin;
    const incrementAmountForInnerCards = cardWidth;

    // calculate snap points
    let x = 0;
    const snapPoints = cards.map((card, index) => {
      const snapPointForCard = { x };
      if (index === 0 || index === cards.length - 2) {
        x -= incrementAmountForOuterCards;
      } else {
        x -= incrementAmountForInnerCards;
      }
      return snapPointForCard;
    });
    this.setState({ snapPoints });

    // calculate the swiping boundary
    const swipeableBoundary =
      snapPoints[cards.length - 1].x - Swipeable.BoundaryPadding;
    this.setState({ swipeableBoundary });
  };

  render() {
    const { cards } = this.props;

    let cardsToRender;

    const styles = StyleSheet.create({
      interactableContainer: {
        flexDirection: 'row',
        marginHorizontal: Swipeable.HorizontalMargin,
        marginVertical: Swipeable.VerticalMargin
      }
    });

    if (this.state.cardWidth > 0) {
      cardsToRender = cards.map((card, index) => {
        const title = 'This Should Be Title';

        return (
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>{title}</Text>
              </Body>
            </CardItem>
            <CardItem style={style.miniContainer}>
              <Text style={style.cardHeaderText}>This Should Be Graphs</Text>
            </CardItem>
          </Card>
        );
      });
    }

    return (
      <View onLayout={this.onLayout}>
        <Interactable.View
          snapPoints={this.state.snapPoints}
          // does not work on Android
          boundaries={
            Platform.OS === 'ios'
              ? {
                  left: this.state.swipeableBoundary,
                  right: Swipeable.BoundaryPadding,
                  bounce: Swipeable.BoundaryBounce
                }
              : { bounce: Swipeable.BoundaryBounce }
          }
          horizontalOnly
          animatedNativeDriver
          style={[
            styles.interactableContainer,
            { width: this.state.swipeableWidth }
          ]}
        >
          {cardsToRender}
        </Interactable.View>
      </View>
    );
  }
}
