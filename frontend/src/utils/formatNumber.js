export const formatNumber = (numero) => {
  if (!numero || isNaN(numero)) return "N/A"; // Manejo de valores inválidos
  return new Intl.NumberFormat("es-CL", { style: "decimal" }).format(numero);
};
