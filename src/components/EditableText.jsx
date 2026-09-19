import React from 'react';

/**
 * Live Visual Inline Editable Text Wrapper
 * When isEditMode is TRUE, text can be clicked and edited directly on the page!
 */
export default function EditableText({
  id,
  value,
  fallback,
  isEditMode,
  onChange,
  className = '',
  as: Tag = 'span',
  multiline = false,
  ...props
}) {
  const currentText = value !== undefined && value !== null && value !== '' ? value : fallback;

  if (!isEditMode) {
    return <Tag className={className} {...props}>{currentText}</Tag>;
  }

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const textContent = e.currentTarget.innerText;
        if (onChange) onChange(id, textContent);
      }}
      className={`${className} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-50/90 hover:outline-2 hover:outline-dashed hover:outline-amber-400 hover:bg-amber-50/50 rounded px-1 -mx-1 transition-all cursor-text relative`}
      title="Click to edit text directly"
      {...props}
    >
      {currentText}
    </Tag>
  );
}
