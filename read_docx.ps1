Add-Type -AssemblyName System.IO.Compression.FileSystem
$path = "D:\downloads\New Downloads Backup\Kadamb_Kanan_Das_Profile.docx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($path)
$entry = $zip.Entries | Where-Object { $_.Name -eq "document.xml" }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
$text = [regex]::Replace($xml, "<[^>]+>", " ")
$text = [regex]::Replace($text, "\s+", " ")
Write-Output $text.Trim()
