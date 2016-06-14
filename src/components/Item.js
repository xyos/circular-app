import React, { Component } from 'react'
import Dimensions from 'Dimensions';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Image,
  Text,
  View
} from 'react-native'
import CacheableImage from 'react-native-cacheable-image';

var {height, width} = Dimensions.get('window');

export default class Item extends Component {
  constructor(props) {
    super(props)
    this.state={image:props.imagen}
  }

  componentWillMount() {
  }

  render() {
    const wrapperStyles = {
      padding:5
    }
    var imagen = this.props.imagen;
    var urlLink = 'http://168.176.236.6/circular/' + imagen;
    const imgUrl = {uri: urlLink};
    console.log(imgUrl);
    return (
      <View style={wrapperStyles}>
        <View ref="wrapper">
          <CacheableImage
            resizeMode= 'cover'
            style={styles.image}
            source={imgUrl} >
              <View style={styles.row}>
                <Text style={styles.text}>
                  {this.props.name}
                </Text>
              </View>
          </CacheableImage>
          <View style={styles.separator} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    flex: 1
  },
  image:{
    padding: 5,
    width: width-80,
    height: height - 100,
    flex:1
  },
  separator: {
    width: 1,
    backgroundColor: '#CCCCCC'
  },
  text: {
    flex: 1,
    fontSize: 20
  }
})
