$ErrorActionPreference = 'Stop'
$env:GIT_TERMINAL_PROMPT = '0'
$env:GCM_INTERACTIVE = 'never'
$credentialOutput = "protocol=https`nhost=github.com`n`n" | git credential fill 2>$null
if ($LASTEXITCODE -ne 0) { throw 'GitHub: autenticação local indisponível.' }
$credentialValues = @{}
foreach ($line in $credentialOutput) { if ($line -match '^([^=]+)=(.*)$') { $credentialValues[$matches[1]] = $matches[2] } }
$headers = @{Authorization='Bearer '+$credentialValues['password']; Accept='application/vnd.github+json'; 'X-GitHub-Api-Version'='2022-11-28'}
$body = @{build_type='legacy'; source=@{branch='main';path='/'}} | ConvertTo-Json
$result = Invoke-RestMethod -Method Post -Uri 'https://api.github.com/repos/lucasreginatotech/romagleice-design-demo/pages' -Headers $headers -Body $body -ContentType 'application/json'
Write-Output $result.html_url
Remove-Variable headers,credentialValues,credentialOutput
