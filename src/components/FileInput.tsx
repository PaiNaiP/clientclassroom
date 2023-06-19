import React, { useState } from 'react';
import '../style/FileInput.scss';

type Props = {
  multiple?: boolean;
  accept?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (index: number) => void;
};

const FileInput: React.FC<Props> = ({
  multiple,
  accept,
  onChange,
  onDelete,
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFileNames = [...fileNames];
    for (let i = 0; i < event.target.files!.length; i++) {
      newFileNames.push(event.target.files![i].name);
    }
    setFileNames(newFileNames);
    onChange(event);
  };

  const handleFileDelete = (index: number) => {
    const newFileNames = [...fileNames];
    newFileNames.splice(index, 1);
    setFileNames(newFileNames);
    if (onDelete) {
      onDelete(index);
    }
  };

  return (
    <div className="file-input">
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
      />
      <ul className="file-list">
        {fileNames.map((fileName, index) => (
          <li key={index} className="file-item">
            {fileName}
            {onDelete && (
              <button
                className="file-delete"
                onClick={() => handleFileDelete(index)}
              >
                X
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileInput;
