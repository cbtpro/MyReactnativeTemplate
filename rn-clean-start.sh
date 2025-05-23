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