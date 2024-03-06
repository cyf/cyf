export interface IBlob {
  lastModified: number;
  type: string;
  name: string;
}

export async function getBase64(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export async function blobToFile(blob: Blob, options: IBlob): Promise<any> {
  const { name, ...ret } = options;
  return new Promise((resolve, reject) => {
    const file = new File([blob], options.name, ret);

    resolve(file);
  });
}
