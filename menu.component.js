import React from "react";

import { Text, View, FlatList } from "react-native";

import Touchable from "react-native-platform-touchable";
import { FontAwesome } from "react-native-vector-icons";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.renderMenu = this.renderMenu.bind(this);
  }
  //        <View style={{ height: 1, backgroundColor: '#000', width: '100%' }} />

  renderSeparator = () => {
    return (
      <View>
        <View style={{ height: 1, backgroundColor: "#CCC", width: "100%" }} />
      </View>
    );
  };

  renderMenu({
    title,
    component,
    onPress,
    icon,
    iconColor,
    image,
    color,
    show,
    button
  }) {
    let left;
    if (icon) {
      left = (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 12
          }}
        >
          <FontAwesome name={icon} color={iconColor} size={20} />
        </View>
      );
    } else if (image) {
      left = (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 12
          }}
        >
          {image}
        </View>
      );
    } else {
      left = null;
    }

    const right =
      left !== null ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <FontAwesome name="angle-right" size={20} />
        </View>
      ) : null;

    const middle = component ? (
      component
    ) : (
      <View
        style={{
          flex: 10,
          justifyContent: "center",
          marginLeft: 15,
          alignItems: !left ? "center" : "flex-start"
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: color ? color : "black", marginRight: 5 }}>
            {title}
          </Text>
          {button ? button : null}
        </View>
      </View>
    );

    return (
      <View>
        <Touchable onPress={onPress}>
          <View
            style={{
              height: 45,
              flexDirection: "row",
              backgroundColor: this.props.backgroundColor
                ? this.props.backgroundColor
                : "white"
            }}
          >
            {left ? (
              <View style={{ flex: 2.5, justifyContent: "center" }}>
                {left}
              </View>
            ) : null}

            <View style={{ flex: 12 }}>{middle}</View>

            {right ? <View style={{ flex: 1 }}>{right}</View> : null}
          </View>
        </Touchable>
      </View>
    );
  }

  render() {
    const { data, ListFooterComponent } = this.props;

    return (
      <FlatList
        data={data.filter(({ show }) => show !== false)}
        renderItem={({ item }) => this.renderMenu(item)}
        keyExtractor={item => `item-${item.id}`}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

export default Menu;
