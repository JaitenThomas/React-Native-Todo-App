import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';

export default class TodoItem extends Component {
  state = {};

  render() {
    const todoItem = this.props.todoItem;

    return (
      <TouchableOpacity style={styles.todoItem} onPress={this.props.toggleDone}>
        <Text
          style={
            todoItem.done
              ? { color: '#AAAAAA', textDecorationLine: 'line-through' }
              : { color: '#313131' }
          }
        >
          {todoItem.title}
        </Text>

        <Button
          titleStyle={{ color: 'red' }}
          title="Remove"
          type="clear"
          onPress={() => this.props.removeTodo()}
        ></Button>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  todoItem: {
    width: '100%',
    height: 40,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15
  }
});
