interface IBlobToBase {
  blob: Blob;
}

export const blobToBase64 = ({ blob }: IBlobToBase): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      resolve(reader.result as string);
    };
    reader.onerror = async (e) => {
      reject(e);
    };
    reader.readAsDataURL(blob);
  });

// *****************************************
// * Trigger download from blob or url
// *****************************************
interface IDownloadFile {
  blob?: Blob;
  fileUrl?: string;
  fileName: string;
}
export const downloadFile = ({ blob, fileUrl, fileName }: IDownloadFile) => {
  const href = blob ? window.URL.createObjectURL(blob) : fileUrl;

  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  anchor.setAttribute("download", fileName);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.parentNode.removeChild(anchor);
};

export const downloadFileFromUrl = (url: string, name: string) => {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", url);
  anchor.setAttribute("download", name);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.parentNode.removeChild(anchor);
};

export const readFile = (file: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(`${reader.result}`), false);
    reader.readAsDataURL(file);
  });

interface IBlobToFile {
  blob: Blob;
  fileName: string;
}
export const blobToFile = (params: IBlobToFile): File => {
  const { blob, fileName } = params;

  const b: any = blob;
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  // Cast to a File() type
  return blob as File;
};
