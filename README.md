当然可以，以下是你原始内容整理后的 **Markdown 文档格式**，内容结构清晰，便于阅读与维护：

---

# 📱 MyReactnativeTemplate

---

## 🚀 快速命令

### ✅ 启动 Android

```bash
yarn android
```

### ✅ 启动 iOS

```bash
yarn ios
```

### ✅ 启动开发服务器

```bash
yarn start
```

---

## 🧱 Android 环境配置

### 编译打包 APK

```bash
cd android
./gradlew assembleRelease
```

---

## 🍎 iOS 环境配置

### 步骤 1：清理旧依赖（替代 `xcodebuild clean`）

```bash
rm -rf ios/Pods ios/Podfile.lock ios/build
```

### 步骤 2：重新安装 CocoaPods 依赖

```bash
cd ios
pod install
```

如使用 Apple M 系列芯片可尝试：

```bash
arch -x86_64 pod install
```

### 步骤 3：运行项目

```bash
cd ..
yarn ios
```

---

### 🔁 添加新第三方依赖后的流程

在ReactNative的[directory](https://reactnative.directory/?search=%40baronha%2Freact-native-multiple-image-picker)里搜索项目。

以安装 [`@baronha/react-native-multiple-image-picker`](https://nitrogenzlab.github.io/react-native-multiple-image-picker/getting-started) 为例：

```bash
yarn add @baronha/react-native-multiple-image-picker
yarn add -D react-native-nitro-modules
cd ios && pod install
```

---

## 🐛 已解决问题记录

### ❗ Kingfisher 编译失败

错误信息：

```
failed to verify module interface of 'Kingfisher'
```

这通常是由于 Swift 的 ABI 模块接口生成失败。

#### 💡 Kingfisher 是什么？

Kingfisher 是 iOS 的图片下载与缓存库，类似于 Android 的 Glide 或 Picasso。

在 `@baronha/react-native-multiple-image-picker` 的 `podspec` 中明确依赖：

```ruby
s.dependency 'Kingfisher', '~> 8.0'
```

---

### ✅ 解决办法：修改 Podfile 关闭 ABI 导出

https://github.com/NitrogenZLab/react-native-multiple-image-picker/issues/229
https://github.com/onevcat/Kingfisher/issues/2379
将以下代码添加到 `ios/Podfile` 的 `post_install` 钩子中：

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == 'Kingfisher'
      target.build_configurations.each do |config|
        config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'NO'
      end
    end
  end
end
```

然后重新安装 Pods：

```bash
cd ios
pod install
cd ..
yarn ios
```

---

### 🔎 BUILD_LIBRARY_FOR_DISTRIBUTION 是什么？

这是 Xcode 用于构建 `.swiftinterface` 接口文件的选项，开启后容易因 Swift 编译器 bug 出错。设置为 `NO` 可避免此类错误。

---

## 🧠 Hermes 构建错误（iOS）

错误：

```
error .../hermes.xcframework/ios-arm64_x86_64-simulator/*: No such file or directory
```

### ❓ 原因

Hermes 模拟器平台文件缺失，常见于首次安装、缓存异常或下载中断。

---

### ✅ 解决方法

#### 方法 1：清理缓存并重装 Hermes 和 Pods

```bash
rm -rf ios/Pods ios/Podfile.lock ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf node_modules/react-native/ReactCommon/hermes-engine

yarn install
cd ios && pod install --repo-update
cd ..
yarn ios
```

#### 方法 2：禁用 Hermes（可选）

修改 `ios/Podfile`：

```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => false
)
```

修改 Android（如有）：

```gradle
def enableHermes = false
```

然后清理并重装：

```bash
rm -rf node_modules ios/Pods ios/Podfile.lock
yarn install
cd ios && pod install
cd ..
yarn ios
```

#### 方法 3：升级 Hermes（确保兼容）

```bash
npx react-native upgrade
```

---

## 🧾 总结

| 问题                  | 解决方案                                    |
| --------------------- | ------------------------------------------- |
| Kingfisher 编译失败   | 设置 `BUILD_LIBRARY_FOR_DISTRIBUTION = NO`  |
| Hermes 缺失模拟器文件 | 清除缓存并重新安装 Hermes 与 Pods           |
| 不使用 Hermes         | 在 `Podfile` 中设置 `hermes_enabled: false` |
| 模块不兼容或构建失败  | 使用 `npx react-native upgrade` 更新依赖    |

---
