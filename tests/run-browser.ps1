# Pré-requisitos: servidor local em 4173 e Chrome headless isolado em 9222.
$ErrorActionPreference = 'Stop'
$targets = Invoke-RestMethod 'http://127.0.0.1:9222/json/list'
$target = $targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
$socket = [System.Net.WebSockets.ClientWebSocket]::new()
$socket.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$script:messageId = 0
function Send-CDP($method, $parameters) {
  $script:messageId++
  $currentId = $script:messageId
  $message = @{id=$currentId;method=$method;params=$parameters} | ConvertTo-Json -Depth 30 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($message)
  $socket.SendAsync([ArraySegment[byte]]::new($bytes), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  do {
    $stream = [IO.MemoryStream]::new()
    do {
      $buffer = [byte[]]::new(65536)
      $received = $socket.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
      $stream.Write($buffer,0,$received.Count)
    } while (-not $received.EndOfMessage)
    $response = [Text.Encoding]::UTF8.GetString($stream.ToArray()) | ConvertFrom-Json
    $stream.Dispose()
  } while ($response.id -ne $currentId)
  if ($response.error) { throw ($response.error | ConvertTo-Json -Compress) }
  return $response.result
}
Send-CDP 'Page.enable' @{} | Out-Null
Send-CDP 'Runtime.enable' @{} | Out-Null
Send-CDP 'Page.navigate' @{url='http://127.0.0.1:4173/tests/browser.html'} | Out-Null
$expression = @'
new Promise(resolve => {
  let elapsed = 0;
  const timer = setInterval(() => {
    const result = document.querySelector('#result')?.textContent;
    elapsed += 100;
    if ((result && result !== 'RUNNING') || elapsed > 15000) {
      clearInterval(timer);
      resolve(result || 'TIMEOUT');
    }
  }, 100);
})
'@
$evaluation = Send-CDP 'Runtime.evaluate' @{expression=$expression;awaitPromise=$true;returnByValue=$true}
$report = $evaluation.result.value
[IO.File]::WriteAllText((Join-Path (Get-Location) 'test-results/browser-results.json'),$report,[Text.UTF8Encoding]::new($false))
Write-Output $report
# Capturas da própria página em viewports mobile e desktop.
Send-CDP 'Page.navigate' @{url='http://127.0.0.1:4173/'} | Out-Null
foreach ($viewport in @(@{width=390;height=844;mobile=$true;name='mobile'},@{width=1440;height=1100;mobile=$false;name='desktop'})) {
  Send-CDP 'Emulation.setDeviceMetricsOverride' @{width=$viewport.width;height=$viewport.height;deviceScaleFactor=1;mobile=$viewport.mobile} | Out-Null
  Send-CDP 'Runtime.evaluate' @{expression='document.fonts.ready.then(() => Promise.all([...document.images].filter(i=>i.src && i.loading!=="lazy").map(i=>i.decode().catch(()=>{}))))';awaitPromise=$true} | Out-Null
  $screenshot = Send-CDP 'Page.captureScreenshot' @{format='png';captureBeyondViewport=$false}
  [IO.File]::WriteAllBytes((Join-Path (Get-Location) ('test-results/'+$viewport.name+'.png')),[Convert]::FromBase64String($screenshot.data))
}
# Revisão visual das seções mais importantes no celular.
Send-CDP 'Emulation.setDeviceMetricsOverride' @{width=390;height=844;deviceScaleFactor=1;mobile=$true} | Out-Null
foreach ($section in @('ambientes','servicos','contato')) {
  $scrollExpression = "document.documentElement.style.scrollBehavior='auto'; document.querySelectorAll('img').forEach(i=>i.loading='eager'); window.scrollTo(0,document.getElementById('$section').getBoundingClientRect().top+window.scrollY-94); new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))"
  Send-CDP 'Runtime.evaluate' @{expression=$scrollExpression;awaitPromise=$true} | Out-Null
  Send-CDP 'Runtime.evaluate' @{expression='Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{})))';awaitPromise=$true} | Out-Null
  $screenshot = Send-CDP 'Page.captureScreenshot' @{format='png';captureBeyondViewport=$false}
  [IO.File]::WriteAllBytes((Join-Path (Get-Location) ('test-results/mobile-'+$section+'.png')),[Convert]::FromBase64String($screenshot.data))
}
$socket.Dispose()
if (-not ($report | ConvertFrom-Json).pass) { exit 1 }
