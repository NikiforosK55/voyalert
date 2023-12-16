import React from 'react';
import {Linking, SafeAreaView, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  FAB,
  IconButton,
  Menu,
  Snackbar,
  Text,
} from 'react-native-paper';

import {useFocusEffect} from '@react-navigation/native';

import HomeScreenMenu from '../HomeScreenMenu';
import OneVoy from '../OneVoy';
import ScreenTitle from '../ScreenTitle';
import apiList from '../scripts/ApiList';

export default function HomeScreen({navigation}) {
  const [voyList, setVoyList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const [menuVisible, setMenuVisible] = React.useState(false);
  const handleList = () => {
    setLoading(true);
    apiList().then(data => {
      setLoading(false);
      if (data.ok) {
        setVoyList(data.data);
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    });
  };
  const handleItemPress = item => {
    setMenuVisible(false);
    switch (item) {
      case 'donate':
        navigation.navigate('Donate');
        break;
      case 'bug':
        Linking.openURL('https://github.com/ondrejnedoma/voyalert/issues/new');
        break;
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      handleList();
    }, []),
  );
  const handleOneVoyClick = ({dataSource, voyNumber}) => {
    navigation.navigate('Config', {dataSource, voyNumber});
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <IconButton
          icon="refresh"
          size={24}
          onPress={handleList}
          disabled={loading}
        />
        <HomeScreenMenu
          visible={menuVisible}
          setVisible={setMenuVisible}
          handleItemPress={handleItemPress}
        />
      </View>
      <ScreenTitle smallMarginTop={true}>VoyAlert</ScreenTitle>
      {voyList.map(voy => (
        <OneVoy
          key={voy.dataSource + voy.voyNumber}
          dataSource={voy.dataSource}
          voyNumber={voy.voyNumber}
          onPress={handleOneVoyClick}
        />
      ))}
      <FAB
        icon="plus"
        style={styles.fab}
        size="medium"
        onPress={() => navigation.navigate('Add')}
      />
      <Snackbar
        visible={showErrorSnackbar}
        onDismiss={() => setShowErrorSnackbar(false)}>
        {errorSnackbarText}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 32,
  },
});
