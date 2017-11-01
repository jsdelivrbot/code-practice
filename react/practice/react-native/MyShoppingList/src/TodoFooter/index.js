import React, {Component} from 'react'
import { View, Text,Button, TextInput } from 'react-native';

class TodoFooter extends Component {


  //删除完成的todos
  deleteExpireItem = () => {
    this.props.deleteExpireItem()
  }

  //处理改变
  handleChange = () => {
    const {changeAllChecked, isAllDone} = this.props

    changeAllChecked(!isAllDone)
  }

  render() {

    const {doneCount, totalCount, isAllDone} = this.props
    // const display = doneCount>0 ? 'block' : 'none'
    return (
      <View className="todo-footer">
        <View>
          <TextInput type="checkbox" checked={isAllDone} onChange={this.handleChange}/>
        </View>
        <View>
          <Text>Complete {doneCount} / Total {totalCount}</Text>
        </View>
        <Button title="delete expired item" className="btn btn-danger" onPress={this.deleteExpireItem}/>
      </View>
    )
  }
}

export default TodoFooter
