import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ToastAndroid,
  AsyncStorage
} from 'react-native';
import Header from './components/Header';
import InputBar from './components/InputBar';
import TodoItem from './components/TodoItem';

export default class App extends Component {
  state = {
    todoInput: '',
    todos: []
  };

  componentWillMount() {
    //AsyncStorage.clear();
    this.fetchTodos();
  }

  async fetchTodos() {
    try {
      let todos = [];

      await AsyncStorage.getAllKeys((err, keys) => {
        // console.log(keys + '');
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = store[i][1];

            todos.push(JSON.parse(value));

            this.setState({ todos });
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  addNewTodo() {
    let todos = this.state.todos;
    let todoInput = this.state.todoInput;

    if (todoInput <= 0) {
      let message = 'Input field cannot be empty!';
      ToastAndroid.show(message, 0.5);

      return;
    }

    // Add todo to state array
    todos.unshift({
      id: todos.length + 1,
      title: this.state.todoInput,
      done: false
    });

    // Add todo to local storage

    let note = {
      id: todos.length + 1,
      title: this.state.todoInput,
      done: false
    };

    AsyncStorage.setItem('' + note.id, JSON.stringify(note));

    this.setState({
      todos,
      todoInput: ''
    });
  }

  toggleDone(item) {
    let todos = this.state.todos;

    todos = todos.map(todo => {
      if (todo.id == item.id) {
        todo.done = !todo.done;
      }

      return todo;
    });

    //Update toggled note
    AsyncStorage.getItem('' + item.id)
      .then(note => {
        note = JSON.parse(note);

        note.done = !note.done;

        AsyncStorage.setItem('' + item.id, JSON.stringify(note));
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({ todos });
  }

  removeTodo(item) {
    let todos = this.state.todos;

    todos = todos.filter(todo => todo.id !== item.id);

    //Remove note
    AsyncStorage.removeItem('' + item.id)
      .then(() => {
        console.log('item successfully removed');
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({ todos });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={'Todoapp'} />

        <InputBar
          textChange={todoInput => this.setState({ todoInput })}
          addNewTodo={() => this.addNewTodo()}
          todoInput={this.state.todoInput}
        />

        <FlatList
          data={this.state.todos}
          extraData={this.state}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item, index }) => (
            <TodoItem
              todoItem={item}
              toggleDone={() => this.toggleDone(item)}
              removeTodo={() => this.removeTodo(item)}
            />
          )}
        />

        <Text>{this.state.todoInput}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  }
});
