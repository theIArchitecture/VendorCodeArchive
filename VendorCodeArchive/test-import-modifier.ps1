# Test if modifier is being extracted
$pattern = '^[\uFEFF]?\s*using\s+(?<modifier>static\s+)?(?<module>[\w\.]+)\s*;'

$tests = @(
    'using System.Text;',
    'using static System.Math;',
    '﻿using System.Collections.Generic;',
    'using static Amazon.Runtime.Internal.Endpoints.StandardLibrary.Fn;'
)

foreach ($test in $tests) {
    if ($test -match $pattern) {
        $module = $matches['module']
        $modifier = $matches['modifier']
        Write-Host "Test: '$test'" -ForegroundColor Yellow
        Write-Host "  module='$module'" -ForegroundColor Green
        Write-Host "  modifier='$modifier'" -ForegroundColor $(if ($modifier) { "Green" } else { "Red" })
    }
}
