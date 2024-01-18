import { useEffect, useRef } from "react";
import {
  TextInput,
  Keyboard,
  Dimensions,
  Animated,
  useAnimatedValue,
} from "react-native";

const overlayColor = '#000000';

function KeyboardAvoidingTextInput({
  style = {},
  placeholder = "default placeholder",
  onChangeText,
  onChange,
  containerStyle = {},
  value = "",
  overlay = true,
}) {
  const keyboardHeight = useRef(0);
  const screenHeight = useRef(0);
  const containerBottom = useRef(0);
  const containerHeight = useRef(0);
  const translateY = useAnimatedValue(0);
  const overlayOpacity = useAnimatedValue(0);
  const containerRef = useRef();
  const textFieldRef = useRef();
  const initialized = useRef(false);
  const keyboardShowPromise = useRef({ promise: null, resolve: null });

  function animateUpwards(targetValue, duration = 100) {
    Animated.timing(translateY, {
      toValue: targetValue,
      duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(overlayOpacity, {
      toValue: 0.5,
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
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  useEffect(() => {
    // get the screen height
    const height = Dimensions.get("screen").height;
    // console.log(`screen height: ${height}`);
    screenHeight.current = height;
    // add listeners for keyboard show and hide
    Keyboard.addListener("keyboardDidShow", handleKeyboardShow);
    Keyboard.addListener("keyboardDidHide", handleKeyboardHide);
    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
      if (keyboardShowPromise.current) {
        keyboardShowPromise.current = { promise: null, resolve: null };
      }
    };
  }, []);

  function calculateComponentBottom(event) {
    const { height, y } = event.nativeEvent.layout;
    containerBottom.current = y + height;
    containerHeight.current = height;
  }

  function adjustPosition() {
    // console.log(`keyboard height: ${keyboardHeight.current}`);
    const topOfKeyboard = screenHeight.current - keyboardHeight.current;
    // console.log(`top of keyboard: ${topOfKeyboard}`);
    // console.log(`bottom of component: ${containerBottom.current}`);
    const adjust =
      topOfKeyboard - containerBottom.current - containerHeight.current;
    // console.log(`adjust: ${adjust}`);
    if (adjust < 0) {
      animateUpwards(adjust);
    }
  }

  function handleKeyboardShow(event) {
    keyboardHeight.current = event.endCoordinates.height;

    if (!keyboardShowPromise.current?.promise) {
      keyboardShowPromise.current.promise = new Promise((resolve) => {
        keyboardShowPromise.current.resolve = resolve;
      });
    }

    if (keyboardShowPromise.current.resolve) {
      keyboardShowPromise.current.resolve();
      keyboardShowPromise.current.resolve = null;
      keyboardShowPromise.current.promise = null;
    }
  }
  function handleKeyboardHide(_) {
    // _ is a convention for unused variables
    textFieldRef.current.blur();
    animateDownwards();
  }

  async function handleFocus() {
    if (!initialized.current && keyboardHeight.current == 0) {
      initialized.current = true;
      // wait for the keyboard to show and calculate its height
      if (!keyboardShowPromise.current.promise) {
        keyboardShowPromise.current.promise = new Promise(
          (resolve) => (keyboardShowPromise.current.resolve = resolve)
        );
      }
      const before = Date.now();
      await keyboardShowPromise.current.promise;
      const after = Date.now();
      console.log(`Waited for the keyboard for ${after - before}ms`);
    }
    adjustPosition();
  }

  return (
      
      <Animated.View
        style={[containerStyle, { transform: [{ translateY }] }]}
        ref={containerRef}
        onLayout={calculateComponentBottom}
      >
        {overlay && <Animated.View
          style={[
            {
              position: 'absolute',
              width: Dimensions.get('screen').width * 2,
              height: Dimensions.get('screen').height * 2,
              backgroundColor: overlayColor,
              opacity: overlayOpacity,
              pointerEvents: 'none',
            },
            {
              transform: [
                {
                  translateX: Dimensions.get('screen').width * -1
                },
                {
                  translateY: Dimensions.get('screen').height * -1
                }
              ]
            }
          ]}
        />}
        <TextInput
          placeholder={placeholder}
          style={style}
          onFocus={handleFocus}
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
