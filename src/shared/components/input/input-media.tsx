import { UseFormRegisterReturn } from "react-hook-form";
import Svg from "../icon/svg";
import { JSX, ReactNode, useImperativeHandle, useRef, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { Button } from "antd";
import { fileToBlob, MediaProps } from "shared/utilities/file";
import { FileIcon } from "../icon/file-icon";
import useIsomorphicLayoutEffect from "shared/hooks/useIsomorphicLayoutEffect";
import ModalSelectImage from "../modal/modal-image";
import { uploadImage } from "shared/services/file";

type Props = {
  // media?: MediaProps | null;
  desc?: string;
  label?: ReactNode;
  inputProps?: UseFormRegisterReturn;
  /**
   * Use component to select image
   * @requires `<ModalSelectImage/>` registed
   *
   * @example
   * ```tsx
   * function Page() {
   *  return (
   *    <div>
   *      <ModalSelectImage />
   *      <InputImage modal onChange={(e) => console.log(e.target.value)} />
   *    </div>
   *  );
   * }
   * ```
   */
  modal?: boolean;
  del?: boolean;
  role?: string;
  accept?: string;
  preview?: boolean;
  invalid?: string | boolean;
} & Pick<JSX.IntrinsicElements["label"], "onClick" | "onContextMenu" | "className">;

const InputMedia = ({
  inputProps,
  label = "Tải lên",
  desc,
  modal,
  accept = "image/*",
  preview = true,
  invalid,
  del,
  ...rest
}: Props) => {
  const { ref, ...other } = inputProps || {};
  const inputRef = useRef<HTMLInputElement>(null);
  const objectRef = useRef<any>(null);
  const [instance, setInstance] = useState<MediaProps | null>(null);
  useIsomorphicLayoutEffect(() => {
    if (!inputRef.current) return;
    const { files, ...other } = inputRef.current;
    objectRef.current = {
      ...other,
      set value(s: null | string | File | FileList) {
        if (!s) {
          inputRef.current && (inputRef.current.value = "");
          setInstance(null);
          return;
        }
        const media = fileToBlob(s);
        setInstance(media[0]);
      },
      get value() {
        if (!inputRef.current) return null;
        return inputRef.current.files?.length
          ? inputRef.current.files
          : inputRef.current.value || null;
      },
      get files() {
        return inputRef.current?.files;
      },
      set files(files) {},
    };
  }, [instance?.file]);
  useImperativeHandle(ref, () => objectRef.current);
  const onChange = async (file: string | FileList | null) => {
    if (!file) return inputProps?.onChange({ target: { value: "", name: inputProps.name } });

    if (typeof file === "string") {
      inputProps?.onChange({ target: { value: file, name: inputProps.name } });
      return;
    }

    const targetFile = file instanceof FileList ? file.item(0) : file;
    if (!targetFile) return;

    try {
      const url = await uploadImage(targetFile);
      inputProps?.onChange({ target: { value: url, name: inputProps.name } });
      setInstance({
        src: url,
        type: "image",
        name: targetFile.name,
        extention: targetFile.name.split(".").pop() || "",
        file: targetFile,
        lastModified: targetFile.lastModified,
      });
    } catch (e) {
      console.error(e);
    }
  };
  if (modal) {
    rest.onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      ModalSelectImage.open(accept, onChange);
    };
  }
  function propsChange(e: React.ChangeEvent<HTMLInputElement>) {
    inputProps?.onChange(e);
    const media = fileToBlob(e.target.files!);
    setInstance(media[0]);
  }

  return (
    <label {...rest} aria-invalid={!!invalid}>
      <input
        type="file"
        className="peer hidden"
        {...other}
        onChange={propsChange}
        accept={accept}
        ref={inputRef}
      />
      {instance ? (
        <div className="w-full h-full relative">
          {preview ? (
            instance.type === "image" ? (
              <img
                src={instance.src}
                alt={instance.name}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            ) : (
              <embed
                src={instance.src}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            )
          ) : (
            <div aria-invalid={!!invalid}>
              <div className="w-16">
                <FileIcon type={instance.type} color="aliceblue" extension={instance.extention} />
                {/* {instance.type === "map" && <GpxFile file={instance.file} />} */}
              </div>
            </div>
          )}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {del && (
              <Button
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange("");
                }}
                className="btn w-8 h-8 btn-icon shadow"
              >
                <TbTrash size={20} />
              </Button>
            )}
            <div className="btn btn-gray btn-square w-8 h-8 btn-icon shadow">
              <Svg src="/icons/pencil.svg" width={24} height={24} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="btn btn-outline btn-sm bg-transparent font-bold cursor-pointer">
            {label}
          </div>
          <p className="text-xs mt-2 mx-auto">{desc}</p>
        </div>
      )}
    </label>
  );
};

export default InputMedia;
