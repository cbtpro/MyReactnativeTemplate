import {CameraRoll, PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ListRenderItemInfo,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';

type Props = {
  readonly maxSelection?: number;
  readonly onFinish: (selected: string[]) => void;
};

const DEFAULT_SELECTION_LIMIT = 9;

const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
    return (
      granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === 'granted' &&
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted'
    );
  }
  return true;
};

function CustomImagePicker ({ maxSelection = DEFAULT_SELECTION_LIMIT, onFinish }: Props) {
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert('权限不足', '请授予访问相册和相机的权限');
        return;
      }

      const result = await CameraRoll.getPhotos({assetType: 'Photos', first: 50});
      setPhotos(result.edges);
    };

    void loadPhotos();
  }, []);

  const handleTakePhoto = useCallback(async () => {
    const result = await launchCamera({
      cameraType: 'back',
      mediaType: 'photo',
      saveToPhotos: true,
    });

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    setSelected(previous => {
      if (previous.length >= maxSelection) return previous;
      return [...previous, uri];
    });

    setPhotos(previous => [
      {node: {image: {uri}}} as PhotoIdentifier, // 保留类型提示
      ...previous,
    ]);
  }, [maxSelection]);

  const toggleSelect = useCallback((uri: string) => {
    setSelected(previous =>
      previous.includes(uri)
        ? previous.filter(item => item !== uri)
        : previous.length < maxSelection
        ? [...previous, uri]
        : previous
    );
  }, [maxSelection]);

  const renderCameraItem = useCallback(() => (
    <TouchableOpacity onPress={() => void handleTakePhoto()} style={styles.imageItem}>
      <View style={styles.cameraButton}>
        <Text style={styles.cameraText}>📷 拍照</Text>
      </View>
    </TouchableOpacity>
  ), [handleTakePhoto]);

  const renderItem = useCallback(
    ({ index, item }: ListRenderItemInfo<PhotoIdentifier>) => {
      if (index === 0 && item.node.image.uri === 'camera') {
        return renderCameraItem();
      }
      const uri = item.node.image.uri;
      const isSelected = selected.includes(uri);
      return (
        <TouchableOpacity key={index} onPress={() => { toggleSelect(uri); }} style={styles.imageItem}>
          <Image source={{uri}} style={styles.image} />
          {isSelected ? <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✔</Text>
            </View> : undefined}
        </TouchableOpacity>
      );
    },
    [selected, toggleSelect, renderCameraItem]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[{node: {image: {uri: 'camera'}}} as PhotoIdentifier, ...photos]}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        renderItem={renderItem}
      />
      <TouchableOpacity onPress={() => { onFinish(selected); }} style={styles.finishButton}>
        <Text style={styles.finishText}>完成（{selected.length}/{maxSelection}）</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomImagePicker;

const styles = StyleSheet.create({
  cameraButton: {
    alignItems: 'center',
    backgroundColor: '#eee',
    flex: 1,
    justifyContent: 'center',
  },
  cameraText: {
    color: '#666',
  },
  checkmark: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 2,
    position: 'absolute',
    right: 4,
    top: 4,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
  finishButton: {
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
  },
  finishText: {
    color: 'white',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageItem: {
    aspectRatio: 1,
    padding: 2,
    width: '33.33%',
  },
});
