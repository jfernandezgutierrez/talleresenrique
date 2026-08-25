$ErrorActionPreference = 'Stop'
$inputDoc = 'D:\CLAUDE\taller\DOCUMENTACIÓN\03_Revisión_web\Revision_diseno_web_Talleres_Enrique.docx'
$outputPdf = 'D:\CLAUDE\taller\DOCUMENTACIÓN\03_Revisión_web\docx_qa\Revision_diseno_web_Talleres_Enrique.pdf'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($inputDoc, $false, $true)
    $doc.ExportAsFixedFormat($outputPdf, 17)
    $doc.Close($false)
} finally {
    $word.Quit()
}
