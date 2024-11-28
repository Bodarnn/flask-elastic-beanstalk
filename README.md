# Prerequisites

Elastic beanstalk requires a zipped app file to be uploaded when configuring the application and environment. To do this navigate to the project's folder:

```
git clone https://github.com/Bodarnn/flask-elastic-beanstalk.git
cd flask-elastic-beanstalk
```

Then zip the contents of the folder:

```
zip -r app.zip .
```

# Usage

- To run this app using Elastic Beanstalk on AWS, go to the Elastic Beanstalk Dashboard and click 'Create Application'

## Configure Environment

- For the environment tier, choose 'Web server environment'
- Provide an 'application name' and 'environment name'
- Under Platform, choose 'Managed Platform', select the platform 'Python', choose platform branch 'Python 3.11 running on 64bit Amazon Linux 2023', and platform version '4.3.1'
- Upload the zip file of the application by choosing the 'Upload your code' option and uploading from local file

## Configure Service Access

- Create or use an existing elastic beanstalk IAM service role that contains the AdministratorAccess-AWSElasticBeanstalk policy 
- Create or use an existing EC2 key pair
- Create or use an EC2 instance profile with the policies: AWSElasticBeanstalkWebTier, AWSElasticBeanstalkWorkerTier, and AWSElasticBeanstalkMulticontainerDocker

## Configure Instance Traffic and Scaling

- Under Step 4 - Configure instance traffic and scaling, navigate to the Instances tab. For Root volume (boot device), select the 'General Purpose 3 (SSD)' option.
- Under Instance metadata service (IMDS), ensure the Deactivated option is selected for IMDSv1
- Select the instance type 't.3 Large' and skip to the review page and click the 'Submit' button to set up the app's environment.


