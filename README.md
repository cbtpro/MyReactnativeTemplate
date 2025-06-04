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

在 React Native 项目中，为了加快 Android 依赖的下载速度，您可能希望将 `node_modules/@react-native/gradle-plugin` 中的 `settings.gradle.kts` 文件替换为使用国内镜像源的版本。由于该文件位于 `node_modules` 目录中，每次安装依赖时可能会被覆盖，因此手动替换并不可行。以下是几种自动化的方法，供您参考：

---

## Custom patch

### 使用 Patch 工具

`patch-package` 是一个用于修改 `node_modules` 中依赖的工具，可以在安装依赖后自动应用补丁。

1. **安装 `patch-package`**：

   ```bash
   npm install patch-package postinstall-postinstall --save-dev
   ```

2. **修改 `package.json`**：添加 `postinstall` 脚本：

   ```json
   {
     "scripts": {
       "postinstall": "patch-package"
     }
   }
   ```

3. **手动修改目标文件**：编辑 `node_modules/@react-native/gradle-plugin/settings.gradle.kts`，将其内容替换为您希望的版本。

4. **生成补丁文件**：

   ```bash
   npx patch-package @react-native/gradle-plugin
   ```

这样，每次安装依赖后，`patch-package` 会自动应用补丁，保持您的修改。

---

下面是整理后的 Markdown 文档，结构清晰、格式统一、易于阅读：

---

# React Native 开发 Tips & 常见问题整理

## 基础开发流程

1. **设置淘宝镜像源**
2. **使用 `npm` 或 `yarn` 安装依赖**
3. **替换 `node_modules/@react-native/gradle-plugin/settings.gradle.kts` 文件为群内提供的版本**
   （可加快 Android 依赖下载）
4. **运行项目**

```bash
yarn android
```

---

## 开发建议与调试技巧

### 1. Metro 服务与原生工程的关系

- React Native 的运行依赖于原生 Android/iOS 工程与 JavaScript 打包服务（Metro）。
- 当仅修改 JS 代码（无原生依赖变化）时，无需执行 `yarn android` 重新运行原生工程。
- 可以使用以下命令重启 Metro 服务：

```bash
yarn start
```

- 杀掉 App 重新打开即可自动重连 Metro，加载最新 JS。

---

### 2. 真机无线调试

- 确保手机与电脑在 **同一局域网**。
- 打开 App，摇动设备，进入 RN 调试菜单：

  - 选择 `Settings` → `Debug server host & port`
  - 设置为：`<电脑IP>:8081`，例如：`192.168.1.100:8081`

- 关闭并重启 App，即可重连 Metro 服务。

---

### 3. Android 模拟器调试配置

#### 支持 x86 架构（加快模拟器运行速度）

- 在 `android/gradle.properties` 添加：

  ```properties
  reactNativeArchitectures=arm64-v8a,x86
  ```

- 在 `app/build.gradle` 中添加：

  ```groovy
  abiFilters 'arm64-v8a', 'x86'
  ```

#### 快捷调出调试菜单

- **iOS 模拟器**：`Cmd + D`
- **Android 模拟器**：`Cmd + M` (macOS) / `Ctrl + M` (Windows/Linux)

---

### 一、Gradle 下载失败

当执行到 `yarn android` 时，会尝试下载 `gradle-8.10.2-all.zip`，访问外网失败。

#### 解决方法：

修改 `android/gradle/wrapper/gradle-wrapper.properties` 文件，将：

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.10.2-all.zip
```

替换为腾讯镜像源：

```properties
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.10.2-all.zip
```

清除缓存并重新执行：

```bash
cd android
./gradlew clean
cd ../
yarn android
```

---

### 二、启动失败的可能原因

#### 1. 缓存文件/构建文件损坏

检查 `android/app/build.gradle` 是否包含模拟器所需架构：

```groovy
android {
  defaultConfig {
    ndk {
      abiFilters ..., "x86", "x86_64"
    }
  }
}
```

并确保 `android/gradle.properties` 包含对应配置：

```properties
reactNativeArchitectures=...,x86,x86_64
```

**可选**：如需开启已弃用的 NDK 支持（慎用）：

```properties
android.useDeprecatedNdk=true
```

#### 清理缓存并重新构建：

```bash
rm -rf android/app/build android/.gradle
cd android
./gradlew clean
cd ../
yarn android
```

rn-clean-start.sh

```
#!/bin/bash

# React Native 清理 & 启动脚本
# 适用于 macOS / Linux / Windows (Git Bash)

set -e

# 设置颜色输出
GREEN='\033[0;32m'
NC='\033[0m' # 无色

echo -e "${GREEN}🔄 开始清理 React Native 项目...${NC}"

# 清理缓存和构建文件
rm -rf node_modules
rm -rf android/.gradle
rm -rf android/app/build
rm -rf ios/Pods ios/build
rm -rf ~/.gradle/caches/
watchman watch-del-all 2>/dev/null || true

# 清理 Metro 缓存
rm -rf $TMPDIR/metro-* || true

# 重新安装依赖
echo -e "${GREEN}📦 正在安装依赖...${NC}"
yarn install

# 进入 Android 文件夹执行 clean
cd android
./gradlew clean
cd ..

echo -e "${GREEN}🚀 启动 Metro 服务...${NC}"
yarn start &

# 等待 Metro 启动片刻（可选）
sleep 2

echo -e "${GREEN}📱 启动 Android 应用...${NC}"
yarn android

```

## chmod +x rn-clean-start.sh

React Native 编译慢且很多时候处于 IDLE（空闲等待），主要原因多是构建系统没有充分利用 CPU、I/O 或缓存没命中。以下是实用的提速技巧和优化方案，帮你提升 Android 构建和 React Native 打包速度：

---

## 1. **升级硬件资源 & 并行配置**

- 多核 CPU：确保构建时能用上多核，多线程并行构建。
- SSD：用固态硬盘，I/O 快。
- 大内存：防止频繁读写硬盘和交换。

---

## 2. **Gradle 配置提速**

在 `android/gradle.properties` 加入或确认以下配置：

```properties
# 开启并行构建，多模块时提升速度
org.gradle.parallel=true

# 开启守护进程，避免每次都启动 JVM
org.gradle.daemon=true

# Gradle 编译守护进程最大内存，默认 1G，改大点（根据机器内存）
org.gradle.jvmargs=-Xmx4608m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# 开启构建缓存，缓存编译结果
org.gradle.caching=true

# 关闭版本校验减少网络请求
android.builder.sdkDownload=false

# 开启 TLS1.2/1.3 支持，避免 TLS 握手失败
systemProphttps.protocols=TLSv1.2,TLSv1.3
```

---

## 3. **启用 Gradle 构建缓存和增量构建**

React Native 自身支持增量构建，但你必须保证 Gradle 缓存和 Android build cache 启用。

---

## 4. **开启并行构建：加快 native 代码编译**

`android/app/build.gradle` 里：

```groovy
android {
    ...
    // 并行编译 Native 代码
    externalNativeBuild {
        cmake {
            arguments "-j$(nproc)"
        }
    }
}
```

或在 `gradle.properties` 里：

```properties
org.gradle.parallel=true
```

---

## 5. **关闭不必要的依赖和功能**

- 如果不需要 Hermes 引擎，关闭它（否则 Hermes 也会编译耗时）：

```groovy
project.ext.react = [
    enableHermes: false,
]
```

- 关闭新架构（Fabric）或 React Native Codegen 功能试试。

---

## 6. **升级 React Native、Android Gradle Plugin（AGP）和 Gradle 版本**

新版本通常优化了构建速度和缓存机制。

---

## 7. **使用 Jetifier + Proguard 需慎重**

- Jetifier 开启会拖慢构建，确认是否真的需要。
- Proguard 仅生产构建开启，平时 debug 关闭。

---

## 8. **使用命令行增量打包，避免重复全量构建**

```bash
# 编译 apk
cd android
./gradlew assembleDebug --parallel --info
```

加 `--parallel` 开启多线程构建。

---

## 9. **JavaScript Bundler 配置**

- 使用 Metro 缓存；
- 只打包变更文件，不重复打包整个 bundle。

---

## 10. **调试与分析构建瓶颈**

- 使用 Gradle 的 `--profile` 参数：

```bash
./gradlew assembleDebug --profile
```

生成报告，定位最耗时任务。

---

## 11. **持续集成或云端构建**

- 本地性能有限，可以用云端 CI 系统做缓存和并行编译。

---

## 总结

- 优化 Gradle 配置（并行、缓存、守护进程）
- 减少无用功能（Hermes、新架构）
- 采用更好的硬件
- 定期清理和升级依赖
- 使用 `--profile` 监控和分析

---
