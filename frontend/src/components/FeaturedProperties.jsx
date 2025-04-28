import React from "react";

const FeaturedProperties = () => {
  // Simulación de propiedades
  const properties = [
    {
      id: 1,
      title: "Casa moderna en Las Condes",
      price: "$200.000.000",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title: "Departamento en Providencia",
      price: "$150.000.000",
      image: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {properties.map((property) => (
        <div key={property.id} className="border rounded shadow">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-blue-600 font-bold">{property.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
