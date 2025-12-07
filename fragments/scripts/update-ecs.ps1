# Update ECS service to use khietvan123/fragments:lab10
# Finds a service with 'fragments' in its name, registers a new task definition revision with updated image, and updates the service.
$aws = '"C:\Program Files\Amazon\AWSCLIV2\aws.exe"'
Write-Output "Using AWS CLI: $aws"
Write-Output 'Listing ECS clusters...'
$clustersRaw = Invoke-Expression "$aws ecs list-clusters --region us-east-1 --output json"
$clusters = (ConvertFrom-Json $clustersRaw).clusterArns
if (-not $clusters) { Write-Error 'No ECS clusters found'; exit 1 }
Write-Output "Found clusters: $($clusters.Count)"
$foundService = $null
$foundCluster = $null
foreach ($c in $clusters) {
    Write-Output "Checking cluster: $c"
    $servicesRaw = Invoke-Expression "$aws ecs list-services --cluster $c --region us-east-1 --output json"
    $serviceArns = (ConvertFrom-Json $servicesRaw).serviceArns
    if ($serviceArns) {
        foreach ($sarn in $serviceArns) {
            $desc = Invoke-Expression "$aws ecs describe-services --cluster $c --services $sarn --region us-east-1 --output json"
            $svc = (ConvertFrom-Json $desc).services[0]
            if ($svc.serviceName -like '*fragments*' -or $svc.serviceName -eq 'fragments') {
                $foundService = $svc
                $foundCluster = $c
                break
            }
        }
    }
    if ($foundService) { break }
}
if (-not $foundService) { Write-Error 'Could not find a service named fragments in any cluster'; exit 1 }
Write-Output "Found service: $($foundService.serviceName) in cluster $foundCluster"
$taskDefArn = $foundService.taskDefinition
Write-Output "Current taskDefinition: $taskDefArn"
# Describe current task definition
$tdJson = Invoke-Expression "$aws ecs describe-task-definition --task-definition $taskDefArn --region us-east-1 --output json"
$td = (ConvertFrom-Json $tdJson).taskDefinition
# Prepare new task definition payload
$register = @{
    family = $td.family
    containerDefinitions = $td.containerDefinitions
}
if ($td.taskRoleArn) { $register.taskRoleArn = $td.taskRoleArn }
if ($td.executionRoleArn) { $register.executionRoleArn = $td.executionRoleArn }
if ($td.networkMode) { $register.networkMode = $td.networkMode }
if ($td.volumes) { $register.volumes = $td.volumes }
if ($td.requiresCompatibilities) { $register.requiresCompatibilities = $td.requiresCompatibilities }
if ($td.cpu) { $register.cpu = $td.cpu }
if ($td.memory) { $register.memory = $td.memory }
# Update container image(s)
foreach ($cd in $register.containerDefinitions) {
    Write-Output "Updating container $($cd.name) image to khietvan123/fragments:lab10"
    $cd.image = 'khietvan123/fragments:lab10'
}
# Write payload to temp file
$payloadPath = Join-Path $env:TEMP "td-register.json"
$register | ConvertTo-Json -Depth 20 | Out-File -FilePath $payloadPath -Encoding utf8
Write-Output "Registering new task definition revision..."
$regOut = Invoke-Expression "$aws ecs register-task-definition --cli-input-json (Get-Content -Raw -Path \"$payloadPath\") --region us-east-1"
$newArn = (ConvertFrom-Json $regOut).taskDefinition.taskDefinitionArn
if (-not $newArn) { Write-Error 'Failed to register new task definition'; exit 1 }
Write-Output "Registered: $newArn"
Write-Output "Updating service to use new task definition..."
$updateOut = Invoke-Expression "$aws ecs update-service --cluster $foundCluster --service $($foundService.serviceName) --task-definition $newArn --region us-east-1"
Write-Output $updateOut
Write-Output 'Update complete.'
