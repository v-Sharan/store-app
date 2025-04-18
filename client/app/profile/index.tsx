import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const Create = () => {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState<string | null | undefined>(null);
  const [ext, setExt] = useState(null);

  const handlePost = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", "Mototr data");
    //@ts-ignore
    formData.append("image", {
      name: fileName,
      uri: image,
      type: `image/${ext}`,
    });
    //@ts-ignore
    formData.append("quantity", 8);
    formData.append("description", "description");
    formData.append("orgId", "F3CD3");
    formData.append("category", "Mototr");
    console.log(formData);

    // axios
    //   .post("https://store-app-vykv.onrender.com/products/create", formData, {
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "multipart/form-data",
    //       // Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
    //     Alert.alert(res.data.message);
    //     // setTimeout(() => {
    //     //   navigation.navigate("Home");
    //     // }, 1000);
    //   })
    //   .catch((err: any) => {
    //     Alert.alert(err.response.data.message);
    //   })
    //   .finally(() => setLoading(false));
    setImage(null);
  };

  const handleReset = () => {
    setImage(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 2],
      quality: 1,
    });

    if (!result.canceled) {
      const filename = result.assets[0].uri.split("/").pop();
      const split = filename?.split(".");
      //@ts-ignore
      setFileName(split[0]);
      //@ts-ignore
      setExt(split[1]);
      //@ts-ignore
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.imagePreview} onPress={pickImage}>
        <Image
          source={image ? { uri: image } : require("../../assets/preview.png")}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
        />
        <Button title="Send" onPress={handlePost} />
      </TouchableOpacity>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  imagePreview: {
    height: 250,
    width: 250,
    borderRadius: 20,
    backgroundColor: "#ccc",
    paddingVertical: 5,
    alignSelf: "center",
    marginVertical: 15,
  },
});
