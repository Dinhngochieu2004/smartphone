pipeline {
    agent any
    stages { 
      stage("Clone"){
        steps{
            echo "Clone code from github"
        }
      }
      stage("Build"){
        steps{
            echo "Build code"
        }
      }
      stage("Test"){
        steps{
            echo "Run unit test"
        }
      }
      stage("Docker"){
        steps{
            echo "build image"
            echo "tag"
            echo "push docker hub2"
        }
      }
    }
}