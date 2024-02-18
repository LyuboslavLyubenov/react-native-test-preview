import * as React from 'react';
import { TestPreviewComponent } from 'react-native-test-preview/setup';
import Todo from './Todo';

export default function App() {
  // eslint-disable-next-line eqeqeq
  if (process.env.TEST_PREVIEW == 'true') {
    return <TestPreviewComponent />;
  }
  return <Todo />;
}
