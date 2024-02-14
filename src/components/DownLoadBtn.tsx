"use client"

const downloadImage = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image.jpg";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

const DownLoadBtn = ({ downloadUrl }: { downloadUrl: string }) => {
  return (
    <button
      className="inline-flex text-blue-600 hover:underline underline-offset-2"
      onClick={() => downloadImage(downloadUrl)}
    >
      Download asset
    </button>
  );
};

export default DownLoadBtn;
