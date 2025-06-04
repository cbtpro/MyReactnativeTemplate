#!/bin/bash

set -e

echo "[1/6] 清理 Android build 目录..."
rm -rf android/build android/app/build

echo "[2/6] 清理 Codegen 缓存..."
rm -rf android/app/build/generated/source/codegen
rm -rf node_modules/**/android/build/generated/source/codegen

echo "[3/6] 重新执行 yarn install..."
yarn install

echo "[4/6] 重新生成 Codegen..."
yarn react-native codegen

echo "[5/6] 清理 Gradle 缓存目录..."
cd android
./gradlew clean

echo "[6/6] 开始构建 Debug 版本..."
./gradlew assembleDebug

echo "✅ 完成编译"
