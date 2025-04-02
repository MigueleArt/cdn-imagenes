import { useState } from "react";
import Image from "next/image";

export default function Galeria() {
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);

  const manejarCambioArchivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files && evento.target.files.length > 0) {
      setArchivo(evento.target.files[0]);
    }
  };

  const subirImagen = async () => {
    if (!archivo) return alert("Selecciona un archivo.");

    const formData = new FormData();
    formData.append("file", archivo);

    try {
      const respuesta = await fetch("http://localhost:4000/images/upload", {
        method: "POST",
        body: formData,
      });

      const datos = await respuesta.json();
      const urlBase = datos.result.variants[0].split("?")[0];

      setImagenes([...imagenes, urlBase]);
      setArchivo(null);
      (document.getElementById("archivoInput") as HTMLInputElement).value = "";
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <header className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Galería de Imágenes</h1>
        <div className="mt-4 flex gap-4 justify-center">
          <input id="archivoInput" type="file" className="border p-2 rounded" onChange={manejarCambioArchivo} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={subirImagen}>
            Subir Imagen
          </button>
        </div>
      </header>

      <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imagenes.length > 0 ? (
          imagenes.map((src, index) => (
            <div key={index} className="relative w-60 h-60 cursor-pointer" onClick={() => setVistaPrevia(src)}>
              <Image src={src} alt={`Imagen ${index + 1}`} layout="fill" objectFit="cover" className="rounded-lg shadow-lg" />
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-600">No hay imágenes aún.</p>
        )}
      </main>

      {vistaPrevia && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4" onClick={() => setVistaPrevia(null)}>
          <div className="relative max-w-3xl w-full">
            <Image src={vistaPrevia} alt="Vista previa" layout="intrinsic" width={750} height={750} className="rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
