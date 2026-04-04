
### DevOps

```yaml
# azure-pipelines.yml

trigger:
  branches:
    include:
      - develop
      - main

pr:
  branches:
    include:
      - develop
      - main

schedules:
  - cron: "0 2 * * *"       # Daily at 2:00 AM UTC
    displayName: Daily Build
    branches:
      include:
        - develop
        - main
    always: true

variables:
  buildConfiguration: 'Release'
  solution: '**/*.sln'
  artifactName: 'drop'

stages:

# ----------------------------
# Stage 1: Build
# ----------------------------
- stage: Build
  displayName: 'Build .NET REST API'
  jobs:
  - job: BuildJob
    pool:
      vmImage: 'windows-latest'
    steps:
      - task: UseDotNet@2
        displayName: 'Install .NET SDK'
        inputs:
          packageType: 'sdk'
          version: '7.x'    # adjust to your .NET version

      - task: NuGetToolInstaller@1

      - task: NuGetCommand@2
        inputs:
          restoreSolution: '$(solution)'

      - task: VSBuild@1
        inputs:
          solution: '$(solution)'
          configuration: '$(buildConfiguration)'

      - task: VSTest@2
        inputs:
          platform: 'Any CPU'
          configuration: '$(buildConfiguration)'

      - task: PublishBuildArtifacts@1
        inputs:
          PathtoPublish: '$(Build.ArtifactStagingDirectory)'
          ArtifactName: '$(artifactName)'
          publishLocation: 'Container'

# ----------------------------
# Stage 2: Deploy to Dev
# ----------------------------
- stage: DeployDev
  displayName: 'Deploy to Dev Environment'
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranchName'], 'develop'))
  jobs:
  - deployment: DevDeployment
    environment: 'Dev'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: '<YOUR-SERVICE-CONNECTION>'
              appType: 'webApp'
              appName: '<DEV-APP-NAME>'
              package: '$(Pipeline.Workspace)/$(artifactName)/**/*.zip'

# ----------------------------
# Stage 3: Deploy to Prod
# ----------------------------
- stage: DeployProd
  displayName: 'Deploy to Production Environment'
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranchName'], 'main'))
  approval:
    approvals:
      - name: 'Production Deployment Approval'
        reviewers:
          - '<your-email@domain.com>'
  jobs:
  - deployment: ProdDeployment
    environment: 'Production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: '<YOUR-SERVICE-CONNECTION>'
              appType: 'webApp'
              appName: '<PROD-APP-NAME>'
              package: '$(Pipeline.Workspace)/$(artifactName)/**/*.zip'

```

### 1️⃣ Pool

Definition:

A pool specifies where the pipeline runs — the VM or agent that executes your jobs.

You can use:

Hosted pools: Microsoft-managed VMs (windows-latest, ubuntu-latest, macos-latest)

Self-hosted pools: Your own machines/servers that act as agents

Example:

pool:
  vmImage: 'windows-latest'  # Hosted agent


This tells Azure DevOps: “Run this job on a Windows VM with the latest pre-installed tools.”

How it affects environment specs:

The vmImage defines the OS and pre-installed software.

For example:

windows-latest → .NET SDK, MSBuild, Visual Studio tools

ubuntu-latest → .NET SDK, Node.js, Python, etc.

### 2️⃣ Job

Definition:

A job is a unit of work in your pipeline.

It runs on a single agent from the pool.

Jobs can run sequentially (default) or in parallel.

Example:

jobs:
- job: BuildJob
  pool:
    vmImage: 'windows-latest'
  steps:
    - script: echo "Building..."


Notes:

Each job gets its own agent workspace, so files/artifacts must be published to share across jobs.

Jobs can have dependencies using dependsOn.

### 3️⃣ Task

Definition:

A task is a single step inside a job, like a command or script.

Azure DevOps provides predefined tasks (like DotNetCoreCLI@2, VSBuild@1, AzureWebApp@1) or you can run custom scripts.

Example:

steps:
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '7.x'

- task: VSBuild@1
  inputs:
    solution: '**/*.sln'
    configuration: 'Release'


How it works:

Tasks are executed in order inside the job.

Tasks rely on the agent provided by the pool for the right environment.

### Standard way to have the environment specific settings
1️⃣ Use ASP.NET Core’s built-in environment system

Create separate files for each environment:

settings.Development.json
settings.Production.json


Load them conditionally in Program.cs or Startup.cs:

var builder = WebApplication.CreateBuilder(args);

// Set up configuration
builder.Configuration
       .AddJsonFile("settings.json", optional: false, reloadOnChange: true)
       .AddJsonFile($"settings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
       .AddEnvironmentVariables();

var app = builder.Build();


builder.Environment.EnvironmentName is automatically set by ASPNETCORE_ENVIRONMENT.

Common values: Development, Staging, Production.

2️⃣ Set environment in DevOps pipeline

You can pass environment variables in your pipeline YAML:

variables:
  ASPNETCORE_ENVIRONMENT: 'Development'  # For dev builds


Or during release stage:

- task: AzureWebApp@1
  inputs:
    azureSubscription: '<SERVICE_CONNECTION>'
    appName: '<DEV-APP>'
    package: '$(Pipeline.Workspace)/drop/**/*.zip'
    appSettings: '-ASPNETCORE_ENVIRONMENT Production'


The appSettings parameter sets environment variables in the Azure App Service.

3️⃣ Alternative: Use a single settings.env.json

If you want one file per environment:

settings.Development.json
settings.Production.json


Then copy/rename the correct file during the pipeline:

# In the Build or Release stage
- task: CopyFiles@2
  inputs:
    SourceFolder: '$(Build.SourcesDirectory)'
    Contents: 'settings.$(ASPNETCORE_ENVIRONMENT).json'
    TargetFolder: '$(Build.ArtifactStagingDirectory)'
    flattenFolders: true

- task: RenameFiles@1
  inputs:
    SourceFolder: '$(Build.ArtifactStagingDirectory)'
    Contents: 'settings.$(ASPNETCORE_ENVIRONMENT).json'
    TargetName: 'settings.json'


Your app always reads settings.json.

The pipeline ensures the correct environment version is deployed.

4️⃣ Key points
Feature	How it works
ASPNETCORE_ENVIRONMENT	.NET automatically sets IWebHostEnvironment.EnvironmentName
appsettings.{Environment}.json	Automatically loaded if present
Pipeline override	Set environment variable or copy the correct file during release

✅ Recommendation:

Stick with appsettings.{Environment}.json — it’s standard, supported, and works well with DevOps environments.

Only use custom .env JSON if you have special reasons.

## IDM flow
Step-wise Flow

User opens the web app / SPA dashboard

The app checks if the user is already logged in (token exists).

User is not authenticated → app redirects user to Azure AD login page

Redirect URL includes:

client_id (your app)

response_type=code

scope (permissions required, e.g., openid profile api://<API_ID>/read)

code_challenge (for PKCE)

User enters username and password (or SSO)

Azure AD authenticates the user.

User may also consent to the requested scopes.

Azure AD issues an Authorization Code

Redirects the browser back to SPA’s redirect URI with the code.

SPA exchanges Authorization Code + PKCE verifier for tokens

POST request to Azure AD token endpoint.

Azure AD responds with:

ID Token → contains user identity info (name, email, roles)

Access Token → used to access APIs

Refresh Token → used to obtain new access tokens silently

SPA stores tokens securely

Usually in memory or secure browser storage (avoid localStorage if possible).

SPA calls the backend API

Sends Access Token in Authorization: Bearer <token> header.

API validates the Access Token

Verifies signature, audience, scopes, expiration.

Extracts user claims from the token to identify the user.

API returns user-specific data → SPA renders the dashboard.

Access Token expires

SPA uses Refresh Token to request a new Access Token from Azure AD.

Process repeats silently, no user login required.

Optional Step Diagram (Linear)
User -> SPA: Open dashboard
SPA -> Azure AD: Redirect to login (PKCE)
User -> Azure AD: Enter username/password
Azure AD -> User: Authenticate & consent
Azure AD -> SPA: Return Authorization Code
SPA -> Azure AD: Exchange code + PKCE verifier
Azure AD -> SPA: Return ID Token + Access Token + Refresh Token
SPA -> API: Call API with Access Token
API -> SPA: Validate token & return user data
SPA: Render dashboard
SPA -> Azure AD (on token expiry): Use Refresh Token
Azure AD -> SPA: Return new Access Token