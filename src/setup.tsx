import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  Modal,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import TestRenderer from 'react-test-renderer';
import type { ScreenDebugType } from './ScreenDebugType';

const nativeElementMap: Record<string, typeof React.Component> = {
  RCTView: View,
  View: View,
  RCTText: Text,
  Text: Text,
  TextInput: TextInput,
  RCTTextInput: TextInput,
  Switch: Switch,
  RCTSwitch: Switch,
  ScrollView: ScrollView,
  RCTScrollView: ScrollView,
  Modal: Modal,
  RCTModalHostView: Modal,
  RCTSafeAreaView: SafeAreaView,
  SafeAreaView: SafeAreaView,
  Image: Image,
  BaseImage: Image,
  ActivityIndicator: ActivityIndicator,
};

function convertToCreateElement(
  json: TestRenderer.ReactTestRendererJSON
): React.ComponentElement<any, any> {
  if (!json) return React.createElement(View);

  const elementType = nativeElementMap[json.type] || View;
  const props = json.props || {};

  if (json.children) {
    const children = json.children.map((child) => {
      if (typeof child === 'string') {
        return React.createElement(Text, null, child);
      } else {
        return convertToCreateElement(child);
      }
    });

    return React.createElement(elementType, props, children);
  }

  return React.createElement(elementType, props);
}

function renderJSON(json: ScreenDebugType) {
  if (isTestRenderedJSON(json)) return convertToCreateElement(json);
  return React.createElement(View);
}

function isTestRenderedJSON(
  json: ScreenDebugType
): json is TestRenderer.ReactTestRendererJSON {
  return Array.isArray(json) || !!json?.type;
}

export function TestPreviewComponent() {
  const [json, setJson] = React.useState<ScreenDebugType>(null);

  useEffect(() => {
    import('./rendered.json').then((data) => {
      setJson(data);
    });
  }, []);

  return renderJSON(json);
}

export function registerComponent(
  Component: typeof React.Component,
  defaultProps = {}
) {
  const testRendered = TestRenderer.create(<Component {...defaultProps} />);
  const json = testRendered.toJSON();

  if (isTestRenderedJSON(json)) {
    nativeElementMap[json.type] = Component;
    return;
  }

  console.error(
    'Could not register component. Please check that you are passing a valid React component.'
  );
}
