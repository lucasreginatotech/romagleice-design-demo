# Usa apenas uma credencial já configurada no Git Credential Manager.
# A credencial permanece em memória e nunca é escrita em arquivo ou exibida.
$ErrorActionPreference = 'Stop'
$env:GIT_TERMINAL_PROMPT = '0'
$env:GCM_INTERACTIVE = 'never'
$credentialOutput = "protocol=https`nhost=github.com`n`n" | git credential fill 2>$null
if ($LASTEXITCODE -ne 0) { throw 'GitHub: nenhuma credencial local disponível para criar repositório.' }
$credentialValues = @{}
foreach ($line in $credentialOutput) {
  if ($line -match '^([^=]+)=(.*)$') { $credentialValues[$matches[1]] = $matches[2] }
}
if (-not $credentialValues['password']) { throw 'GitHub: autenticação local indisponível.' }
$headers = @{Authorization = 'Bearer ' + $credentialValues['password']; Accept = 'application/vnd.github+json'; 'X-GitHub-Api-Version' = '2022-11-28'}
$profile = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers
if ($profile.login -ne 'lucasreginatotech') { throw 'Conta GitHub diferente da conta autorizada; nenhuma alteração realizada.' }
$repoName = 'romagleice-design-demo'
$body = @{name=$repoName; description='Demonstração institucional RomaGleice Design por LR Tech. HTML, CSS e JavaScript puro.'; private=$false; auto_init=$false} | ConvertTo-Json
$repo = Invoke-RestMethod -Method Post -Uri 'https://api.github.com/user/repos' -Headers $headers -Body $body -ContentType 'application/json'
Write-Output $repo.html_url
Remove-Variable headers,credentialValues,credentialOutput
