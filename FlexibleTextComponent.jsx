import { useEffect, useRef } from "react";
import {
  TextInput,
  Keyboard,
  Dimensions,
  Animated,
  useAnimatedValue,
} from "react-native";

function KeyboardAvoidingTextInput({
  style,
  placeholder,
  onChangeText,
  onChange,
  containerStyle = {},
  value = "",
}) {
  const keyboardHeight = useRef(0);
  const screenHeight = useRef(0);
  const containerBottom = useRef(0);
  const containerHeight = useRef(0);
  const translateY = useAnimatedValue(0);
  const containerRef = useRef();
  const textFieldRef = useRef();
  const initialized = useRef(false);

  function animateUpwards(targetValue, duration = 100) {
    Animated.timing(translateY, {
      toValue: targetValue,
      duration,
      useNativeDriver: true,
    }).start();
  }

  function animateDownwards() {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  // get the screen height
  useEffect(() => {
    const height = Dimensions.get("screen").height;
    console.log(`screen height: ${height}`);
    screenHeight.current = height;
    Keyboard.addListener("keyboardDidShow", onKeyboardShow);
    Keyboard.addListener("keyboardDidHide", onKeyboardHide);
    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  function calculateComponentBottom(event) {
    const { height, y } = event.nativeEvent.layout;
    containerBottom.current = y + height;
    containerHeight.current = height;
  }

  function adjustPosition() {
    console.log(`keyboard height: ${keyboardHeight.current}`);
    const topOfKeyboard = screenHeight.current - keyboardHeight.current;
    console.log(`top of keyboard: ${topOfKeyboard}`);
    console.log(`bottom of component: ${containerBottom.current}`);
    const adjust =
      topOfKeyboard - containerBottom.current - containerHeight.current;
    console.log(`adjust: ${adjust}`);
    if (adjust < 0) {
      animateUpwards(adjust);
    }
  }

  function onKeyboardShow(event) {
    keyboardHeight.current = event.endCoordinates.height;
  }
  function onKeyboardHide(_) {
    textFieldRef.current.blur();
    animateDownwards(500);
  }

  return (
    <Animated.View
      style={[containerStyle, { transform: [{ translateY }] }]}
      ref={containerRef}
      onLayout={calculateComponentBottom}
    >
      <TextInput
        placeholder={placeholder}
        style={style}
        onFocus={() => {
          if (!initialized.current) {
            initialized.current = true;
            setTimeout(adjustPosition, 250); // leave a little time for the keyboard the show and calculate the height
            return;
          }
          adjustPosition();
        }}
        onBlur={animateDownwards}
        ref={textFieldRef}
        onChangeText={onChangeText}
        onChange={onChange}
        value={onChangeText || onChange ? value : undefined}
      />
    </Animated.View>
  );
}

export default KeyboardAvoidingTextInput;
