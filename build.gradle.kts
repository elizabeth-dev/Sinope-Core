plugins {
    id("com.android.application") version "7.0.4" apply false
    id("com.google.protobuf") version "0.8.18" apply false
    kotlin("jvm") version "1.6.10" apply false // Compose Compiler required version
    id("org.jlleitschuh.gradle.ktlint") version "10.2.0"

    id("com.google.cloud.artifactregistry.gradle-plugin") version "2.1.5"
}

apply(plugin = "maven-publish")


ext["grpcVersion"] = "1.45.0"
ext["grpcKotlinVersion"] = "1.2.1" // CURRENT_GRPC_KOTLIN_VERSION
ext["protobufVersion"] = "3.19.4"
ext["coroutinesVersion"] = "1.6.0"

allprojects {
    repositories {
        mavenLocal()
        mavenCentral()
        google()

        maven {
            url = uri("artifactregistry://europe-maven.pkg.dev/test-sinope/sinope")
        }

    }

    publishing {
        repositories {
            maven {
                url = uri("artifactregistry://europe-maven.pkg.dev/test-sinope/sinope")
            }
        }
    }

    apply(plugin = "org.jlleitschuh.gradle.ktlint")

    project.buildDir = file("gradle-build")
}
