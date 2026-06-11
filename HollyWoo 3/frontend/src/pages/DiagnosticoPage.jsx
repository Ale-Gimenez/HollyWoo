/**
 * Página de diagnóstico temporária — acesse em /diagnostico
 * Delete depois que tudo funcionar.
 */
import { useEffect, useState } from 'react'

export default function DiagnosticoPage() {
  const [resultado, setResultado] = useState('Testando...')

  useEffect(() => {
    fetch('/api/filmes')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        setResultado(
          `✅ API funcionando!\n` +
          `Total de filmes: ${data.length}\n\n` +
          `Primeiro filme:\n${JSON.stringify(data[0], null, 2)}`
        )
      })
      .catch(err => {
        setResultado(`❌ Erro na API: ${err.message}`)
      })
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>Diagnóstico API</h1>
      <pre style={{
        background: '#1a1a1a', color: '#0f0', padding: '20px',
        borderRadius: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
      }}>
        {resultado}
      </pre>
    </div>
  )
}
