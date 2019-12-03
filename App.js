import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ToastAndroid
} from 'react-native';
import Header from './components/Header';
import InputBar from './components/InputBar';
import TodoItem from './components/TodoItem';

export default class App extends Component {
  state = {
    todoInput: '',
    todos: [
      { id: 0, title: 'Take out the trash', done: false },
      { id: 1, title: 'Cook dinner', done: false }
    ]
  };

  addNewTodo() {
    let todos = this.state.todos;
    let todoInput = this.state.todoInput;

    if (todoInput <= 0) {
      let message = 'Input field cannot be empty!';
      ToastAndroid.show(message, 0.5);

      return;
    }

    todos.unshift({
      id: todos.length + 1,
      title: this.state.todoInput,
      done: false
    });

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

    this.setState({ todos });
  }

  removeTodo(item) {
    let todos = this.state.todos;

    todos = todos.filter(todo => todo.id !== item.id);

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
