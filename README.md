# MyReactnativeTemplate

## yarn run android

## yarn run ios

## yarn start

## ios环境

1. 手动删除旧文件（替代 xcodebuild clean）：

```
rm -rf ios/Pods ios/Podfile.lock ios/build
```

2. 重新安装 CocoaPods 依赖：

```
cd ios
pod install
```

如遇到 M 系列芯片兼容问题可尝试：

```
arch -x86_64 pod install
```

3. 返回项目根目录并运行项目：

```
cd ..
yarn ios
```
