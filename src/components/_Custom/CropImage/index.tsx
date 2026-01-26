import { useModal } from "context/modal/modal.provider";
import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";
import { Button, Slider } from "rsuite";
import { getCroppedImg } from "utils/helpers";

import { CropperWrapper } from "./ImagesCropper.style";

export enum CropImageType {
  ROUND = "round",
  RECT = "rect",
}
interface CropImageProps {
  base64Img: string;
  callback: Function;
  cropShape: CropImageType;
}

const CropImage = (props: CropImageProps) => {
  const { base64Img, callback, cropShape } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [isMount, setIsMount] = useState(false);
  const { closeModal } = useModal();
  const cropImage = useCallback(async () => {
    try {
      const { b64 } = await getCroppedImg({
        imageSrc: base64Img,
        pixelCrop: croppedAreaPixels,
      });
      callback(b64);
      closeModal();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line
  }, [croppedAreaPixels]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    setIsMount(true);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }, [isMount]);

  return (
    <>
      <CropperWrapper>
        <div className="cropper">
          <Cropper
            image={base64Img}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape={cropShape}
          />

          <div id="uploader-slider">
            <Slider
              min={1}
              max={6}
              onChange={setZoom}
              step={0.1}
              tooltip={false}
            />
          </div>
        </div>
      </CropperWrapper>
      <div className="p-3">
        <Button block appearance="primary" color="green" onClick={cropImage}>
          Confirmar Crop
        </Button>
        <Button
          block
          appearance="ghost"
          color="red"
          onClick={closeModal}
          className="mt-3"
        >
          <span className="text-red-500">Cancelar</span>
        </Button>
      </div>
    </>
  );
};
export default CropImage;
