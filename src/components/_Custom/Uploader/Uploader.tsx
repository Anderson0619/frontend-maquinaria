import Icon from "components/_Custom/Icon/Icon";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploaderContainer,
  UploaderLabel,
  UploaderThumb,
  UploaderThumbsContainer,
} from "./Uploader.style";

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const imgStyle: CSSProperties = {
  // Add a missing property
  ["objectFit" as any]: "cover",
  display: "block",
  height: "100%",
  width: "100%",
};

export interface IUploaderImage extends File {
  preview?: string;
}

interface IUploader {
  onChange: (images: IUploaderImage[]) => void;
  imageURL?: string[];
  initialImages?: string | string[];
  multiple?: boolean;
  label?: string;
  containerStyle?: CSSProperties;
  showThumbs?: boolean;
  border?: boolean;
  text?: string | JSX.Element;
  icon?: JSX.Element;
}

function Uploader({
  onChange,
  imageURL,
  initialImages,
  multiple = true,
  showThumbs = true,
  label,
  containerStyle,
  border = true,
  text,
  icon,
}: IUploader) {
  const [files, setFiles] = useState<IUploaderImage[]>([]);
  const { t } = useTranslation("common");

  const { getRootProps, getInputProps } = useDropzone({
    // accept: "image/*",
    multiple,
    onDrop: useCallback(
      (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        );
        onChange(acceptedFiles);
      },
      [onChange],
    ),
  });

  // * Make sure to revoke the data uris to avoid memory leaks
  useEffect(() => {
    files?.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    if (initialImages) {
      const initialImagesArray = Array.isArray(initialImages)
        ? initialImages
        : [initialImages];
      const images = initialImagesArray.map((preview, index) => ({
        name: `preview_${index}`,
        preview,
      })) as IUploaderImage[];
      setFiles(images);
      onChange(images);
    }
    // eslint-disable-next-line
  }, [initialImages]);

  useEffect(() => {
    const imagesThumb = imageURL?.map((preview, index) => ({
      name: `preview_${index}`,
      preview,
    })) as IUploaderImage[];
    setFiles(imagesThumb);
  }, [imageURL]);

  const setUploaderStyle = () => {
    const style: CSSProperties = {};

    if (!border) {
      style.border = "none";
    }

    return style;
  };

  const thumbs = files?.map((file) => {
    if (file.preview) {
      return (
        <UploaderThumb key={file.name}>
          <div style={thumbInner}>
            <Image src={file.preview} style={imgStyle} alt={file.name} />
          </div>
        </UploaderThumb>
      );
    }
    return null;
  });

  return (
    <section style={containerStyle}>
      <UploaderLabel>{label}</UploaderLabel>

      <UploaderContainer {...getRootProps()} style={setUploaderStyle()}>
        <input {...getInputProps()} />
        {icon || <Icon icon={["fas", "upload"]} />}
        <div className="dark:text-white">
          {text || (
            <div className="text-center">
              <span className="font-bold">{t("uploader.grab")} </span>{" "}
              {multiple ? t("uploader.imagesMsg") : t("uploader.imageMsg")}
            </div>
          )}
        </div>
      </UploaderContainer>

      <div>
        {showThumbs && thumbs && (
          <UploaderThumbsContainer>{thumbs}</UploaderThumbsContainer>
        )}
      </div>
    </section>
  );
}

export default Uploader;
