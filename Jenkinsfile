pipeline {
    agent any
    stages { 
      stage("Clone"){
        steps{
            echo "Clone code start"
            git branch: 'main', credentialsId:"cred-github", url:'https://github.com/Dinhngochieu2004/smartphone.git'
            echo "clone finish"
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
            echo "push docker hub"
        }
      }
    }
}