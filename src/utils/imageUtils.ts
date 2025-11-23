export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Por favor selecciona un archivo de imagen" };
  }
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "La imagen no debe superar los 2MB" };
  }
  return { valid: true };
};
