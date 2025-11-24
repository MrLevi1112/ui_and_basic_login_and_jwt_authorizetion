# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Set project base directory
$MAVEN_PROJECTBASEDIR = $PSScriptRoot

# Run Maven wrapper
& "$env:JAVA_HOME\bin\java.exe" `
  -classpath "$MAVEN_PROJECTBASEDIR\.mvn\wrapper\maven-wrapper.jar" `
  "-Dmaven.multiModuleProjectDirectory=$MAVEN_PROJECTBASEDIR" `
  org.apache.maven.wrapper.MavenWrapperMain $args
