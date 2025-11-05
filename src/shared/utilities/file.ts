import { FileIconType } from "shared/components/icon/file-icon";

export interface MediaProps {
  src: string;
  name: string;
  lastModified: number;
  extention: string;
  id?: number;
  file: string | File;
  type?: FileIconType | undefined;
}
const imagesRender = new Map<string, MediaProps>();

export const htmlContentToFile = (htmlContent: string, fileName: string = "document.html") => {
  const blob = new Blob([htmlContent], { type: "text/html" });
  return new File([blob], fileName, { type: "text/html" });
};

type IMGType = File | string;
function fileToBlob(files?: IMGType | FileList | Array<IMGType>): MediaProps[] {
  if (!files) return [];
  const filesRender: MediaProps[] = [];
  const f = Array.isArray(files) || files instanceof FileList ? files : [files];
  for (let i = 0; i < f.length; i++) {
    const file = f[i];
    if (typeof file === "string") {
      const extention = ext(file);
      filesRender.push({
        src: file,
        name: "file_number_" + i,
        lastModified: Date.now(),
        file,
        extention,
        type: getFileTypeByExtension(extention),
      });
      continue;
    }

    const key = file.name + "_" + file.lastModified;
    if (imagesRender.has(key)) {
      filesRender.push(imagesRender.get(key)!);
      continue;
    }
    const extention = ext(file.name);
    imagesRender.set(key, {
      src: URL.createObjectURL(file),
      name: file.name,
      lastModified: file.lastModified,
      file,
      extention,
      type: getFileTypeByExtension(extention),
    });
    filesRender.push(imagesRender.get(key)!);
  }
  return filesRender;
}
function toFiles<D>(files?: D): Array<File> {
  return Array.from((files as any) || []);
}
function toFileList(...files: File[]) {
  const data = new DataTransfer();
  files.map((file) => data.items.add(file));
  return data.files;
}
function ext(url: string) {
  const _url = url.substring(url.lastIndexOf(".") + 1, url.length) || url;
  return _url.split("?")[0];

  // // Remove everything to the last slash in URL
  // url = url.substr(1 + url.lastIndexOf("/"));

  // // Break URL at ? and take first part (file name, extension)
  // url = url.split("?")[0];

  // // Sometimes URL doesn't have ? but #, so we should aslo do the same for #
  // url = url.split("#")[0];

  // // Now we have only extension
  // return url;
}

function readFileFromSystem(
  accept: string | string[],
  callback: (files: FileList) => void,
  isMultiple?: boolean
): void;
function readFileFromSystem(accept: string | string[], callback: any, isMultiple?: boolean) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = Array.isArray(accept) ? accept.join(", ") : accept;
  input.multiple = Boolean(isMultiple);
  input.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (target.files) {
      callback(target.files);
      // if (isMultiple) callback(target.files);
      // else callback(target.files[0]);
    }
  });
  input.click();
}
const textFiles = ["txt", "csv", "json", "xml", "html", "log", "md"];
const documentFiles = ["docx", "pdf", "pptx", "xlsx"];
const imageFiles = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
const audioFiles = ["mp3", "wav", "flac"];
const videoFiles = ["mp4", "avi", "mkv"];
const compressedFiles = ["zip", "rar", "tar.gz"];
const applicationFiles = ["psd", "ai", "dwg", "java", "py"];
const databaseFiles = ["sqlite", "db"];
const miscellaneousFiles = ["exe", "dll", "iso", "torrent"];
const fontFileTypes = [
  { name: "TrueType Font", extension: ".ttf" },
  { name: "OpenType Font", extension: ".otf" },
  { name: "Web Open Font Format", extension: ".woff" },
  { name: "Web Open Font Format 2", extension: ".woff2" },
  { name: "PostScript Type 1 Font", extension: ".pfb" },
  { name: "Bitmap Font", extension: ".fon" },
  { name: "Embedded OpenType Font", extension: ".eot" },
  { name: "SVG Font", extension: ".svg" },
  { name: "Composite Font", extension: ".composite" },
  // Add more font file types as needed
];
const imageFileTypes = [
  { name: "JPEG Image", extension: ".jpg" },
  { name: "PNG Image", extension: ".png" },
  { name: "GIF Image", extension: ".gif" },
  { name: "BMP Image", extension: ".bmp" },
  { name: "SVG Image", extension: ".svg" },
  { name: "TIFF Image", extension: ".tiff" },
  { name: "WebP Image", extension: ".webp" },
  { name: "ICO Image", extension: ".ico" },
  { name: "JPEG 2000 Image", extension: ".jp2" },
  { name: "Exif Image", extension: ".exif" },
  { name: "RAW Image", extension: ".raw" },
  // Add more image file types as needed
];
const presentationFileTypes = [
  { name: "PPTX (Microsoft PowerPoint Presentation)", extension: ".pptx" },
  { name: "PPT (Microsoft PowerPoint 97-2003 Presentation)", extension: ".ppt" },
  { name: "ODP (OpenDocument Presentation)", extension: ".odp" },
  { name: "KEY (Apple Keynote Presentation)", extension: ".key" },
  { name: "PDF (Portable Document Format)", extension: ".pdf" },
  { name: "SXI (LibreOffice Impress Presentation)", extension: ".sxi" },
  { name: "PPS (Microsoft PowerPoint Slide Show)", extension: ".pps" },
];

const settingsFileTypes = [
  { name: "JSON (JavaScript Object Notation)", extension: ".json" },
  { name: "XML (Extensible Markup Language)", extension: ".xml" },
  { name: "INI (Initialization File)", extension: ".ini" },
  { name: "YAML (YAML Ain't Markup Language)", extension: ".yaml" },
  { name: "TOML (Tom's Obvious, Minimal Language)", extension: ".toml" },
  { name: "CFG (Configuration File)", extension: ".cfg" },
  { name: "CONF (Configuration File)", extension: ".conf" },
  { name: "PROP (Properties File)", extension: ".prop" },
  { name: "SET (Settings File)", extension: ".set" },
  { name: "PREF (Preferences File)", extension: ".pref" },
  { name: "ENV (Environment Variables File)", extension: ".env" },
  // Add more settings file types as needed
];
const spreadsheetFileTypes = [
  { name: "XLSX (Microsoft Excel Spreadsheet)", extension: ".xlsx" },
  { name: "XLS (Microsoft Excel 97-2003 Spreadsheet)", extension: ".xls" },
  { name: "ODS (OpenDocument Spreadsheet)", extension: ".ods" },
  { name: "CSV (Comma-Separated Values)", extension: ".csv" },
  { name: "TSV (Tab-Separated Values)", extension: ".tsv" },
  { name: "NUMBERS (Apple Numbers Spreadsheet)", extension: ".numbers" },
  { name: "GNUMERIC (Gnumeric Spreadsheet)", extension: ".gnumeric" },
];
function getFileTypeByExtension(extension: string): FileIconType | undefined {
  //"3d",
  // "acrobat",
  // "audio",
  // "binary",
  // "code",
  // "code2",
  // "compressed",
  // "document",
  // "drive",

  switch (extension.toLowerCase()) {
    case "pdf":
      return "acrobat";
    case "ttf":
    case "otf":
    case "woff":
    case "woff2":
    case "pfb":
    case "fon":
    case "eot":
    case "svg":
    case "composite":
      return "font";

    case "jpg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
    case "tiff":
    case "webp":
    case "ico":
    case "jp2":
    case "exif":
    case "raw":
      return "image";
    case "pptx":
    case "ppt":
    case "odp":
    case "key":
    case "sxi":
    case "pps":
      return "presentation";
    case "json":
    case "xml":
    case "ini":
    case "yaml":
    case "toml":
    case "cfg":
    case "conf":
    case "prop":
    case "set":
    case "pref":
    case "env":
      return "settings";

    case "xlsx":
    case "xls":
    case "ods":
    case "csv":
    case "tsv":
    case "numbers":
    case "gnumeric":
      return "spreadsheet";

    case "svg":
    case "ai":
    case "eps":
    case "cdr":
    case "wmf":
      return "vector";
    case "mp4":
    case "avi":
    case "mkv":
      return "video";

    case "gpx":
      return "map";

    default:
      return undefined;
  }
}
export { getFileTypeByExtension, fileToBlob, readFileFromSystem, toFiles, toFileList, ext };
