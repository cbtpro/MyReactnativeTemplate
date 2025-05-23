/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

pluginManagement {
  repositories {
      maven { setUrl("https://maven.aliyun.com/repository/public/") }
      maven { setUrl("https://maven.aliyun.com/repository/central")}
      maven { setUrl("https://maven.aliyun.com/repository/gradle-plugin") }
      maven { setUrl("https://maven.aliyun.com/repository/google") }

    mavenCentral()
    google()
    gradlePluginPortal()
  }
}

plugins { id("org.gradle.toolchains.foojay-resolver-convention").version("0.5.0") }
 dependencyResolutionManagement {
//    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        maven { setUrl("https://maven.aliyun.com/repository/public/") }
        maven { setUrl("https://maven.aliyun.com/repository/central")}
        maven { setUrl("https://maven.aliyun.com/repository/gradle-plugin") }
        maven { setUrl("https://maven.aliyun.com/repository/google") }
        google()
        mavenCentral()
    }
}
include(
    ":react-native-gradle-plugin",
    ":settings-plugin",
    ":shared",
    ":shared-testutil",
)

rootProject.name = "gradle-plugin-root"
