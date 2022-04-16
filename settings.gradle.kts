rootProject.name = "Sinope-Core"

include("api:proto:v1", "pkg:stub-android")

pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
    }
}