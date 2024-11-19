import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null); // State to track which task is being edited
  const scaleAnimation = useRef(new Animated.Value(0)).current; // Animation for adding
  const fadeAnimation = useRef({}).current; // Store fade animations for tasks

  const addTask = () => {
    if (task.trim()) {
      const newTask = { id: Date.now().toString(), text: task, completed: false };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      fadeAnimation[newTask.id] = new Animated.Value(1); // Initialize fade value for the new task
      setTask('');
      triggerAddAnimation(); // Trigger animation for adding
    }
  };

  const triggerAddAnimation = () => {
    scaleAnimation.setValue(0); // Reset scale value
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const deleteTask = (taskId) => {
    // Trigger fade-out animation
    Animated.timing(fadeAnimation[taskId], {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Remove task after animation completes
      setTasks((prevTasks) => prevTasks.filter((item) => item.id !== taskId));
    });
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId); // Mark the task as being edited
      setTask(taskToEdit.text); // Populate the input with the current task text
    }
  };

  const saveEditedTask = () => {
    if (task.trim() && editingTaskId !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === editingTaskId ? { ...item, text: task } : item
        )
      );
      setTask('');
      setEditingTaskId(null); // Reset editing task
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add or edit a task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={editingTaskId ? saveEditedTask : addTask} // Add or save edit based on mode
        >
          <Text style={styles.addButtonText}>{editingTaskId ? 'Save' : '+'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.taskContainer,
              {
                opacity: fadeAnimation[item.id], // Apply fade animation
                transform: [{ scale: scaleAnimation }], // Apply scale animation
              },
            ]}
          >
            <TouchableOpacity
              style={styles.taskTextContainer}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editTask(item.id)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButton}>X</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#5C5CFF',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    color: '#FF5C5C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  editButton: {
    color: '#FFB84C',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
