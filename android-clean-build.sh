#!/bin/bash

set -e

echo "清理 Android build 目录..."
rm -rf android/build android/app/build

echo "清理 Codegen 缓存..."
rm -rf android/app/build/generated/source/codegen
rm -rf node_modules/**/android/build/generated/source/codegen

# echo "重新执行 yarn install..."
# yarn install

echo "重新生成 Codegen..."
yarn react-native codegen

echo "清理 Gradle 缓存目录..."
cd android
./gradlew clean build

echo "开始构建 Debug 版本..."
./gradlew assembleDebug

echo "✅ 完成编译"
