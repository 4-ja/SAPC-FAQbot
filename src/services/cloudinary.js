// src/services/cloudinary.js

export const uploadToCloudinary = async (file) => {
  const cloudName = "dbmtnium7"; 
  const uploadPreset = "sapc-wiki"; 

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    if (!response.ok) throw new Error("Cloudinary upload failed");

    const data = await response.json();
    
    // This returns the URL and the type to your Wiki page
    return {
      url: data.secure_url,
      type: data.resource_type === 'video' ? 'video' : (data.format === 'pdf' ? 'pdf' : 'image')
    };
  } catch (error) {
    console.error("Cloudinary Error:", error);
    throw error;
  }
};