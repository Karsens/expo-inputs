import React from "react";
import { GooglePlacesAutocomplete } from "../../react-native-google-places-autocomplete/GooglePlacesAutocomplete";

class Location extends React.Component {
  static navigationOptions = props => ({ title: "Choose a location" });

  render() {
    const { onChange } = this.props.navigation.state.params;
    const { googlePlacesConfig } = this.props.navigation.state.params;

    return (
      <GooglePlacesAutocomplete
        ref={ref => (this.autoComplete = ref)}
        placeholder="Search"
        minLength={2} // minimum length of text to search
        autoFocus={true}
        returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed="auto" // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description} // custom description render
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          const location = details.geometry.location;

          const cityObj = details.address_components.find(comp =>
            comp.types.includes("locality")
          );
          const city = cityObj && cityObj.long_name;

          const countryObj = details.address_components.find(comp =>
            comp.types.includes("country")
          );
          const country = countryObj && countryObj.long_name;

          onChange({
            address: data.description,
            mapsurl: details.url,
            city,
            country,
            latitude: location.lat,
            longitude: location.lng
          });

          this.props.navigation.goBack();
        }}
        getDefaultValue={() => ""}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: googlePlacesConfig.key,
          language: "en", // language of the results
          types: "geocode" // default: 'geocode'
          // components: "country:nl" // only results for the netherlands
        }}
        styles={{
          textInputContainer: {
            width: "100%",
            backgroundColor: "#FFF"
          },

          textInput: {
            marginLeft: 4,
            marginRight: 4,
            borderRadius: 17,
            height: 34,
            color: "#5d5d5d",
            fontSize: 16
          },

          container: {
            backgroundColor: "white"
          },
          description: {
            fontWeight: "bold"
          },
          predefinedPlacesDescription: {
            color: "#1faadb"
          }
        }}
        //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        //currentLocationLabel="Huidige locatie"
        nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={
          {
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }
        }
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: "distance",
          types: "food"
        }}
        // filterReverseGeocodingByTypes={[
        //   "locality",
        //   "administrative_area_level_1"
        // ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        predefinedPlaces={undefined}
        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        renderLeftButton={() => null}
        renderRightButton={() => null}
      />
    );
  }

  /**
   * 
        <View style={{ backgroundColor: "white" }}>
          <Button
            title="Deze locatie gebruiken"
            onPress={() => {
              const lat1 =
                Math.round(this.state.region.latitude * 10000) / 10000;
              const lat2 = Math.round(this.state.addressLat * 10000) / 10000;
              const lng1 =
                Math.round(this.state.region.longitude * 10000) / 10000;
              const lng2 = Math.round(this.state.addressLng * 10000) / 10000;

              const address =
                lat1 === lat2 && lng1 === lng2 ? this.state.address : undefined;

              const params =
                this.props.navigation.state.params.coordsId === 1
                  ? {
                      coords1: {
                        ...this.state.region,
                        address
                      }
                    }
                  : {
                      coords2: {
                        ...this.state.region,
                        address
                      }
                    };
              this.props.navigation.navigate("Home", params);
            }}
          />
        </View>
   */
}

export default Location;
