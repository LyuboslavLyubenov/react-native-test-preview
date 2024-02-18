import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';
import TodoApp from './Todo';
import React from 'react';
import savePreview from 'react-native-test-preview/savePreview';

describe('Todo', () => {
  afterEach(() => cleanup());

  it('should add a task', async () => {
    render(<TodoApp />);
    const inputField = await screen.findByPlaceholderText('Add a new task...');
    fireEvent.changeText(inputField, 'New todo task');
    const addButton = await screen.findByTestId('addTodoBtn');
    fireEvent.press(addButton);
    //see changes on screen
    savePreview(screen.toJSON());

    expect(screen.getByText('New todo task')).toBeTruthy();
  });

  it('should remove a task', async () => {
    render(<TodoApp />);
    const inputField = await screen.findByPlaceholderText('Add a new task...');
    fireEvent.changeText(inputField, 'New todo task');
    screen.debug();
    const addButton = await screen.findByTestId('addTodoBtn');
    fireEvent.press(addButton);

    const deleteBtn = await screen.findByText('Delete');
    fireEvent.press(deleteBtn);
    //see
    expect(screen.getByText('New todo task')).toBeTruthy();
  });
});
