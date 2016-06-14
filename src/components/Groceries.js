import React, { Component } from 'react'
import {
  ListView,
  NetInfo,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import Firebase from 'firebase'
import config from '../../config'
import Item from './Item'

const itemsRef = new Firebase(`${ config.FIREBASE_ROOT }/eventos`)
const connectedRef = new Firebase(`${ config.FIREBASE_ROOT }/.info/connected`)

export default class Groceries extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newItem: ''
    }
  }

  componentWillMount() {
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.props.loadOfflineItems()

    itemsRef.on('child_added', (snapshot) => {
      this.props.addItem(snapshot.val())
    })

    itemsRef.on('child_removed', (snapshot) => {
      this.props.removeItem(snapshot.val().id)
    })

    if (NetInfo) {
      NetInfo.isConnected.fetch().done(isConnected => {
        if (isConnected) {
          this.props.checkConnection()
        } else {
          this.props.goOffline()
        }
      })
    } else {
      this.props.checkConnection()
    }

    connectedRef.on('value', snap => {
      if (snap.val() === true) {
        this.props.goOnline()
      } else {
        this.props.goOffline()
      }
    })
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('NEXT PROPS')
  //   console.log(nextProps)

  // }

  renderRow(rowData) {
    console.log(this.props.connected)
    return (
      <Item
        name               = {rowData.nombre}
        descripcion        = {rowData.descripcion}
        imagen             = {rowData.imagen}
        pie_de_foto        = {rowData.pie_de_foto}
        organizador        = {rowData.organizador}
        telefono_contacto  = {rowData.telefono_contacto}
        link_inscripciones = {rowData.link_inscripciones}
        fecha_inscripcion  = {rowData.fecha_inscripcion}
        area_convergencia  = {rowData.area_convergencia}
        tipo               = {rowData.tipo}
        latitud            = {rowData.latitud}
        longitud           = {rowData.longitud}
        lugar              = {rowData.lugar}
        fechas             = {rowData.fechas}
      />
    )
  }

  render() {
    console.log('PROPS!')
    console.log(this.props)
    let items, readonlyMessage
    if (this.props.connected) {
      items = this.props.onlineItems
    } else if (this.props.connectionChecked) {
      items = this.props.offlineItems
      readonlyMessage = <Text style={styles.offline}>Offline</Text>
    } else {
      items = []
      readonlyMessage = <Text style={styles.offline}>Loading...</Text>
    }

    return (
      <View style={styles.container}>
        {readonlyMessage}
        <ListView
          style={styles.list}
          horizontal={true}
          dataSource={this.dataSource.cloneWithRows(items)}
          enableEmptySections={true}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#666666'
  },
  list:{
    paddingLeft: 5,
    paddingRight: 5,
  },
  offline: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5
  }
})
