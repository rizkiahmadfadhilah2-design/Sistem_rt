export default function SuratPreview({ isi }) {
  return (
    <div className="bg-white p-10 max-w-3xl mx-auto shadow rounded">
      <pre className="whitespace-pre-wrap font-serif">
        {isi}
      </pre>
    </div>
  )
}
