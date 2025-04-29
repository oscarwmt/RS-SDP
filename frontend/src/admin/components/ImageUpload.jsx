import { useState, useEffect } from "react";

const ImageUpload = ({
  images,
  setImages,
  imagenDestacada,
  setImagenDestacada,
}) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const updated = [...images];
    const removed = updated.splice(index, 1);
    setImages(updated);
    if (
      imagenDestacada === removed[0]?.preview ||
      imagenDestacada === removed[0]?.url
    ) {
      setImagenDestacada(updated[0]?.preview || updated[0]?.url || "");
    }
  };

  const handleSelectDestacada = (img) => {
    setImagenDestacada(img.preview || img.url);
  };

  useEffect(() => {
    if (!imagenDestacada && images.length > 0) {
      setImagenDestacada(images[0].preview || images[0].url);
    }
  }, [images]);

  return (
    <div className="col-span-2">
      <label className="block mb-1 font-semibold">Imágenes (máx 10)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="flex flex-wrap gap-4 mt-4">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img.preview || img.url}
              alt={`img-${index}`}
              className={`w-32 h-32 object-cover rounded border-4 ${
                imagenDestacada === (img.preview || img.url)
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleSelectDestacada(img)}
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
              onClick={() => handleRemoveImage(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
