
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
    <div className="diagnostico-wrapper">
      <h1>Diagnóstico API</h1>
      <pre className="diagnostico-pre">
        {resultado}
      </pre>
    </div>
  )
}
