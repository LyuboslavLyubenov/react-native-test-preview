import React from 'react';
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
  RCTTextInput: TextInput,
  RCTSwitch: Switch,
  RCTScrollView: ScrollView,
  RCTModalHostView: Modal,
  Image: Image,
  RCTSafeAreaView: SafeAreaView,
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

export function TestPreviewComponent({
  jsonToRender,
}: {
  jsonToRender: ScreenDebugType;
}) {
  return renderJSON(jsonToRender);
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
