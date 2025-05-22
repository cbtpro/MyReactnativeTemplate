
import type { PickerResult } from '@baronha/react-native-multiple-image-picker';

import { Config, openPicker } from '@baronha/react-native-multiple-image-picker';
import { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, View } from 'react-native';

function MultipleImagePicker() {
  const [selectedImages, setSelectedImages] = useState<PickerResult[]>([]);

  const handleImagePicker = async () => {
    const config: Config = {
      isPreview: true,
      maxSelect: 5,
      mediaType: 'image',
      numberOfColumn: 4,
      selectedAssets: selectedImages,
      selectMode: 'multiple',
    };

    try {
      const response = await openPicker(config);
      setSelectedImages(response);
    } catch (error) {
      console.warn('Image picker error:', error);
    }
  };
  const selectCameraHandle = () => {
    void handleImagePicker();
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
