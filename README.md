# Implementing Datadog APM in a Kubernetes Environment with Node.js  

This guide walks you through setting up Datadog APM using an admission controller in a Kubernetes environment, specifically for a Node.js application.  

---

## **1. Create a Datadog Account and Retrieve API Keys**  

1. Visit [Datadog](https://www.datadoghq.com/) and sign up for an account.  
   - Choose a data region (e.g., US). A 14-day free trial is included.  
2. Retrieve your **API Key** and **APP Key** from the Datadog dashboard.  
   - Keep these keys private—they are essential for configuring the Datadog Agent.  

---

## **2. Set Up AWS EKS Cluster**  

### **Install and Configure AWS CLI**  
1. Install the AWS CLI by following the [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).  
2. Configure the CLI with your AWS credentials:  
   ```bash  
   aws configure  
   ```  
   Enter the following when prompted:  
   - AWS Access Key ID  
   - AWS Secret Access Key  
   - Default region name  
   - Default output format  
3. Verify the configuration:  
   ```bash  
   aws configure list  
   ```  

### **Install eksctl**  
1. Install `eksctl` to manage EKS clusters:  
   ```bash  
   curl -s -L "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp  
   sudo mv /tmp/eksctl /usr/local/bin  
   eksctl version  
   ```  

### **Create an EKS Cluster**  
1. Create a cluster with the following command:  
   ```bash  
   eksctl create cluster \  
     --name my-eks-cluster \  
     --region <AWS_REGION> \  
     --nodes 2 \  
     --node-type t3.medium  
   ```  
   Replace `<AWS_REGION>` with your desired AWS region.  
2. Verify the cluster creation:  
   ```bash  
   eksctl get cluster  
   ```  

---

## **3. Install and Configure Helm for Datadog Agent**  

### **Install Helm**  
Helm simplifies Kubernetes application management.  

1. Add the Datadog Helm repository:  
   ```bash  
   helm repo add datadog https://helm.datadoghq.com  
   helm repo update  
   ```  

2. Create a Kubernetes secret for your Datadog API key:  
   ```bash  
   kubectl create secret generic datadog-secret --from-literal api-key=<DATADOG_API_KEY>  
   ```  
   Replace `<DATADOG_API_KEY>` with your actual API key.  

### **Configure Datadog Agent**  
1. Create a `datadog-values.yaml` file to define configurations such as:  
   - API keys  
   - Memory limits  
   - Volumes  
   - APM features  
   - Admission controller settings  

2. Install the Datadog Agent using Helm:  
   ```bash  
   helm install datadog-agent -f datadog-values.yaml datadog/datadog  
   ```  

### **Verify Admission Controller Webhook**  
Check if the webhook is correctly configured:  
```bash  
kubectl get MutatingWebhookConfiguration  
```  

---

## **4. Set Up and Deploy Node.js App**  

### **Create a Node.js App**  
1. Write a simple "Hello, Datadog APM!" app and install the Datadog tracer:  
   ```bash  
   npm install dd-trace  
   ```  
2. Integrate Datadog tracing in `app.js`:  
   ```javascript  
   const tracer = require('dd-trace').init();  
   console.log("Hello, Datadog APM!");  
   ```  

### **Build and Push Docker Image**  
1. Build and tag the Docker image:  
   ```bash  
   docker build -t <ECR_REPOSITORY_URI>:latest .  
   docker tag nodejs-app:latest <ECR_URI>/nodejs-app:latest  
   ```  
2. Push the image to Amazon ECR:  
   ```bash  
   docker push <ECR_REPOSITORY_URI>:latest  
   ```  

### **Deploy to Kubernetes**  
1. Create a deployment YAML file (`deployment.yaml`) for the Node.js app.  
2. Apply the deployment:  
   ```bash  
   kubectl apply -f deployment.yaml  
   ```  

---

## **5. Verify Metrics in Datadog APM**  

1. Generate traffic to the pod:  
   ```bash  
   kubectl port-forward pod/<POD_NAME> <LOCAL_PORT>:<POD_PORT>  
   ```  
   Example:  
   ```bash  
   kubectl port-forward pod/nodejs-app-1234abcd 3001:3001  
   ```  
2. Access the app locally (`http://localhost:3001`) and generate traffic using tools like `curl` or `ab`.  
3. Open the Datadog web interface:  
   - Navigate to **APM > Services**.  
   - Look for the `nodejs-app` service and monitor traces.  

---

## **Conclusion**  

This project emphasized debugging and attention to detail, particularly in configuring Kubernetes and Datadog integrations.  

If you have any questions or need further assistance, feel free to reach out to me on **Twitter/X**.  

Happy Monitoring! 😊  