import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  PermissionsAndroid,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
// import * as FS from "expo-file-system";

// import axios from "axios";

interface Props {}
interface State {
  text: string;
  loading: boolean;
  results: any[];
}

type ResponseType = {
  text: string;
  image: string;
};

const Home: React.FC<Props> = () => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [response, setResponse] = useState({} as ResponseType);
  const [image, setImage] = useState<string>("");

  const checkForPlagiarism = async () => {
    try {
      setLoading(true);
      let type = results[0].type;
      let schema = "http://";
      let host = "192.168.100.25";
      let route = "/image";
      let port = "5000";
      let url = "";
      let content_type = "image/jpeg";

      url = schema + host + ":" + port + route;
      console.log(url);

      // let response = await FS.uploadAsync(url, results[0].uri, {
      //   headers:{
      //     "content-type" :content_type,
      //   },
      //   httpMethod: "POST",
      //   uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
      // });
      // response.json();
      // console.log(JSON.stringify(response))
      // setResponse(response.json());

      const base64 = await results[0].base64;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
        }),
      };

      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          setResponse(data);
          console.log(data.text);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const pickDocument = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResults(result.assets!);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResults(result.assets!);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.button} onPress={pickDocument}>
            <Text style={styles.buttonText}>Select Document</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={checkForPlagiarism}>
          <Text style={styles.buttonText}>Check for Plagiarism</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}

        {loading ? (
          <ActivityIndicator size="large" color="#333" />
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{response.text}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: "100%",
    height: 200,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#007aff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007aff",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Home;
