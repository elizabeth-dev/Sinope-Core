plugins {
    `java-library`
}

java {
    sourceSets.getByName("main").resources.srcDir(".")
    sourceSets.getByName("main").resources.exclude("gradle-build")
}
