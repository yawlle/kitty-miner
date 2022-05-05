import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  Text,
  useColorScheme,
  ImageBackground,
  View,
} from 'react-native';
import params from './src/params';
import MineField from './src/components/MineField';
import Header from './src/components/Header';
import Sound from 'react-native-sound';
import catImage from './src/image/kitty.jpg';
import LevelSelection from './src/screens/LevelSelection';
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
} from './src/functions';

export default class App extends Component {
  sound = new Sound('angrykitty.mp3');

  constructor(props) {
    super(props);
    this.state = this.createState();
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return Math.ceil(cols * rows * params.difficultLevel);
  };

  createState = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false,
    };
  };

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board);

    openField(board, row, column);
    const lost = hadExplosion(board);
    const won = wonGame(board);

    if (lost) {
      this.sound.play();
      showMines(board);
      Alert.alert("Você perdeu! >_<'", 'Meow.... :(');
    }

    if (won) {
      Alert.alert('Você é o máximo! ^-^', ' Meow meow! ');
    }

    this.setState({board, lost, won});
  };

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board);
    invertFlag(board, row, column);
    const won = wonGame(board);

    if (won) {
      Alert.alert('Você é o máximo! ^-^', ' Meow meow! ');
    }

    this.setState({board, won});
  };

  onLevelSelected = level => {
    params.difficultLevel = level;
    this.setState(this.createState());
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container2}>
          <Header
            flagsLeft={this.minesAmount() - flagsUsed(this.state.board)}
            onNewGame={() => this.setState(this.createState())}
            onFlagPress={() => this.setState({showLevelSelection: true})}
          />
          <LevelSelection
            isVisible={this.state.showLevelSelection}
            onLevelSelected={this.onLevelSelected}
            onCancel={() => this.setState({showLevelSelection: false})}
          />
        </View>

        <View style={styles.board}>
          <MineField
            board={this.state.board}
            onOpenField={this.onOpenField}
            onSelectField={this.onSelectField}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    backgroundColor: '#eeaaaa',
    flex: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#eeaaaa',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
