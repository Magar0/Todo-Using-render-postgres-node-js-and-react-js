import React, { FormEvent, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: any) => void;
  title?: string;
  description?: string;
};

const Modal = ({
  isOpen,
  onClose,
  onSave,
  title: defaultTitle,
  description: defaultDescription,
}: ModalProps) => {
  const [title, setTitle] = useState<string | undefined>(defaultTitle);
  const [description, setDescription] = useState<string | undefined>(
    defaultDescription,
  );
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ title, description });
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        // onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="inline-block w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-5 shadow-xl transition-all">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title</label>
              <input
                className="w-full"
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                rows={5}
                className="w-full"
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 border-t bg-gray-50 px-4 py-3 sm:px-6">
              <button
                className="btn custom-btn"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
              <button className="btn custom-btn" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
