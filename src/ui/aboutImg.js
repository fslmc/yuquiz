// @/app/ui/aboutImg.js
import Image from 'next/image';

export default function ImageModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose} // Close modal when clicking outside the image
    >
      <div
        className="bg-gray-900 rounded-lg p-4 max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold"
        >
          &times;
        </button>
        <Image
          src="/renkyun.png" // Replace with the actual path to your image
          alt="Kisaragi Ren"
          width={500}
          height={500}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}