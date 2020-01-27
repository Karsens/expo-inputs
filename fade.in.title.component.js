import React from "react";
import { Animated, Text } from "react-native";

type P = { title: string, show: boolean };
type S = { show: boolean, animation: Animated.Value };

const MAXHEIGHT = 15;
class FadeInTitle extends React.Component<P, S> {
  constructor(props: P) {
    super(props);

    this.state = {
      show: false,
      animation: new Animated.Value(props.show ? MAXHEIGHT : 0)
    };
  }

  componentDidMount() {
    this.setState({ show: this.props.show });
  }

  componentDidReceiveProps({ show }) {
    if (show !== this.state.show) {
      this.toggle(show);
    }
  }

  toggle(to: boolean | undefined = undefined) {
    if (to === false && this.state.show === false) {
      return;
    }

    const newShow = to !== undefined ? to : !this.state.show;

    const set = () =>
      this.setState({
        show: newShow //Step 2
      });

    if (newShow === false) {
      // hide the component once the animation is about to be done
      setTimeout(() => set(), 200);
    } else {
      //show the component instantly, otherwise the animation can't be seen
      set();
    }

    //Animation Step 1
    let initialValue = this.state.show ? MAXHEIGHT : 0,
      finalValue = this.state.show ? 0 : to === false ? 0 : MAXHEIGHT;

    this.state.animation.setValue(initialValue); //Step 2
    Animated.spring(
      //Step 3
      this.state.animation,
      {
        toValue: finalValue
      }
    ).start(() => {}); //Step 4
  }

  render() {
    return this.state.show ? (
      <Animated.View style={{ height: this.state.animation }}>
        <Text style={{ fontSize: 12 }}>{this.props.title}:</Text>
      </Animated.View>
    ) : null;
  }
}

export default FadeInTitle;
