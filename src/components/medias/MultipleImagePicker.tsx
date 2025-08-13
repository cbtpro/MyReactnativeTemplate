
import type { PickerResult } from '@baronha/react-native-multiple-image-picker';

import { Config, openPicker } from '@baronha/react-native-multiple-image-picker';
import { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, View } from 'react-native';

function MultipleImagePicker() {
  const [selectedImages, setSelectedImages] = useState<PickerResult[]>([]);

  const handleImagePicker = async () => {
    const config: Config = {
      maxSelect: 10,
      maxVideo: 10,
      primaryColor: '#FB9300',
      backgroundDark: '#2f2f2f',
      numberOfColumn: 4,
      mediaType: 'all',
      selectBoxStyle: 'number',
      selectMode: 'multiple',
      language: 'vi', // 🇻🇳 Vietnamese
      theme: 'dark',
      isHiddenOriginalButton: false,
    };

    try {
      const response = await openPicker(config);
      setSelectedImages(response);
    } catch (error) {
      console.warn('Image picker error:', error);
    }
  };
  const selectCameraHandle = () => {
    handleImagePicker();
  }
  return (
    <View style={styles.container}>
      <Button onPress={selectCameraHandle} title="选择图片" />
      <ScrollView horizontal style={styles.imageContainer}>
        {selectedImages.map((image) => (
          <Image
            key={image.localIdentifier}
            resizeMode="cover"
            source={{ uri: image.path }}
            style={styles.image}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default MultipleImagePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    borderRadius: 8,
    height: 100,
    marginRight: 8,
    width: 100,
  },
  imageContainer: {
    marginTop: 16,
  },
});
