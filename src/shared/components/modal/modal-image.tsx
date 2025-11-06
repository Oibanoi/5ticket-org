import React, { useCallback, useRef, useState } from "react";
import InputWithIcons from "../input/input-with-icons";
import useBoolean from "shared/hooks/useBoolean";
import { readFileFromSystem } from "shared/utilities/file";
import { createEventEmitter, useEventListener } from "shared/lib/event";
import { Button, Input, Modal } from "antd";

type Props = {};

const IMAGE_SELECTOR = "IMAGE_SELECTOR";
const ModalSelectImage = (props: Props) => {
  const isOpen = useBoolean();
  const [type, setType] = useState(0);
  const [url, setUrl] = useState("");
  const [accept, setAccpet] = useState("image/*");
  const modalRef = useRef({ resolve(data: any) {}, reject(error: any) {} });

  const handleOpenSelectImage = useCallback(
    (callback: any, accept: string) => {
      isOpen.setTrue();
      setAccpet(accept || "image/*");
      callback.reject ||= () => void 0;
      modalRef.current = callback;
    },
    [isOpen]
  );
  const handleSelectImage = () => {
    readFileFromSystem(accept, (files) => {
      modalRef.current.resolve(files);
      reset();
    });
    true;
  };
  const handleInputUrl = () => {
    setType(1);
  };
  const reset = () => {
    setType(0);
    isOpen.setFalse();
    setUrl("");
    setAccpet("image/*");
    modalRef.current = { resolve(data: any) {}, reject(error: any) {} };
  };
  const handleSubmitUrl = () => {
    modalRef.current.resolve(url);
    reset();
  };
  const handleClose = () => {
    modalRef.current.reject(new Error("Modal closed"));
    reset();
  };

  useEventListener(IMAGE_SELECTOR, handleOpenSelectImage);

  return (
    <Modal
      open={isOpen.value}
      onCancel={handleClose}
      footer={null}
      centered
      title={<span className="font-semibold text-xl">Chọn file</span>}
      className="max-w-lg w-full"
      bodyStyle={{ padding: "24px" }}
    >
      {type === 0 ? (
        <div className="space-y-3 mt-4">
          <Button className="w-full" type="primary" onClick={handleSelectImage}>
            Tải lên
          </Button>
          <Button className="w-full" onClick={handleInputUrl}>
            Đường dẫn
          </Button>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          <Input
            placeholder="eg: https://image.com/image.png"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            size="large"
          />
          <Button className="w-full" type="primary" onClick={handleSubmitUrl} disabled={!url}>
            Chọn
          </Button>
        </div>
      )}
    </Modal>
  );
};

function handleSelectImage(): Promise<FileList | string>;
function handleSelectImage(type: string): Promise<FileList | string>;
function handleSelectImage(
  onSuccess: (item: FileList | string) => void,
  onError?: (error: Error) => void
): void;
function handleSelectImage(
  type: string,
  onSuccess: (item: FileList | string) => void,
  onError?: (error: Error) => void
): void;
function handleSelectImage(typeOrOnSuccess?: any, onSuccess?: any, onError?: any): any {
  const emiter = createEventEmitter(IMAGE_SELECTOR);
  if (!typeOrOnSuccess || typeof typeOrOnSuccess === "string") {
    if (onSuccess) return emiter({ resolve: onSuccess, reject: onError }, typeOrOnSuccess);
    return new Promise((resolve, reject) => {
      emiter({ resolve, reject }, typeOrOnSuccess);
    });
  } else if (typeof typeOrOnSuccess === "function") {
    onError = onSuccess;
    onSuccess = typeOrOnSuccess;
    return emiter({ resolve: onSuccess, reject: onError });
  } else {
    return new Promise((resolve, reject) => {
      emiter({ resolve, reject });
    });
  }
}

ModalSelectImage.open = handleSelectImage;
export default ModalSelectImage;
