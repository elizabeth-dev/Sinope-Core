import com.google.protobuf.gradle.generateProtoTasks
import com.google.protobuf.gradle.id
import com.google.protobuf.gradle.plugins
import com.google.protobuf.gradle.protobuf
import com.google.protobuf.gradle.protoc

plugins {
    id("com.android.library")
    kotlin("android")
    id("com.google.protobuf")

    `maven-publish`
    id("com.google.cloud.artifactregistry.gradle-plugin") version "2.1.4"
}

dependencies {
    protobuf(project(":api:proto:v1"))

    api(kotlin("stdlib"))
    api("org.jetbrains.kotlinx:kotlinx-coroutines-android:${rootProject.ext["coroutinesVersion"]}")

    api("io.grpc:grpc-stub:${rootProject.ext["grpcVersion"]}")
    api("io.grpc:grpc-protobuf-lite:${rootProject.ext["grpcVersion"]}")
    api("io.grpc:grpc-kotlin-stub:${rootProject.ext["grpcKotlinVersion"]}")
    api("com.google.protobuf:protobuf-kotlin-lite:${rootProject.ext["protobufVersion"]}")
}

android {
    namespace = "app.sinope.grpc_api.v1.model"

    compileSdk = 32
    buildToolsVersion = "32.0.0"

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().all {
    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
        freeCompilerArgs = listOf("-Xopt-in=kotlin.RequiresOptIn")
    }
}

protobuf {
    protoc {
        artifact = "com.google.protobuf:protoc:${rootProject.ext["protobufVersion"]}"
    }
    plugins {
        id("java") {
            artifact = "io.grpc:protoc-gen-grpc-java:${rootProject.ext["grpcVersion"]}"
        }
        id("grpc") {
            artifact = "io.grpc:protoc-gen-grpc-java:${rootProject.ext["grpcVersion"]}"
        }
        id("grpckt") {
            artifact = "io.grpc:protoc-gen-grpc-kotlin:${rootProject.ext["grpcKotlinVersion"]}:jdk7@jar"
        }
    }
    generateProtoTasks {
        all().forEach {
            it.plugins {
                id("java") {
                    option("lite")
                }
                id("grpc") {
                    option("lite")
                }
                id("grpckt") {
                    option("lite")
                }
            }
            it.builtins {
                id("kotlin") {
                    option("lite")
                }
            }
        }
    }
}

repositories {
    maven(url = "artifactregistry://europe-maven.pkg.dev/test-sinope/sinope")
}

publishing {
    publications {
        publications {
            create<MavenPublication>("release") {
                groupId = "app.sinope.grpc_api"
                artifactId = "stub-android"
                version = "1.0.0-SNAPSHOT"

                afterEvaluate{
                    from(components["release"])
                }
            }
        }
    }

    repositories {
        maven(url = "artifactregistry://europe-maven.pkg.dev/test-sinope/sinope")
    }
}
