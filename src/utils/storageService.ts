import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/storage';

/**
 * Upload profile photo to Firebase Storage
 */
export const uploadProfilePhoto = async (
  userId: string,
  imageUri: string
): Promise<string> => {
  try {
    // Read the file as a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create a reference to the file location
    const storageRef = ref(storage, `profilePhotos/${userId}/${Date.now()}.jpg`);

    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Wait for upload to complete
    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress tracking (optional)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading profile photo:', error);
    throw new Error(error.message || 'Failed to upload profile photo');
  }
};

/**
 * Get profile photo download URL
 * Note: This assumes you store the URL in the user profile
 * Use getUserProfile from firestore.ts to get the URL
 */
export const getProfilePhotoUrl = async (userId: string): Promise<string | null> => {
  // This function is mainly for reference
  // The actual URL should be stored in the user profile in Firestore
  // Use getUserProfile from firestore.ts instead
  try {
    // Try to get the most recent profile photo
    // Note: This is a simplified approach - you may want to store the path in user profile
    const storageRef = ref(storage, `profilePhotos/${userId}`);
    // In practice, you'd list files or use the URL stored in user profile
    return null;
  } catch (error) {
    console.error('Error getting profile photo URL:', error);
    return null;
  }
};

/**
 * Delete profile photo from Firebase Storage
 */
export const deleteProfilePhoto = async (userId: string, photoUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    // Firebase Storage URLs have the format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const url = new URL(photoUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch) {
      throw new Error('Invalid photo URL');
    }

    // Decode the path (it's URL encoded)
    const decodedPath = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, decodedPath);

    await deleteObject(storageRef);
  } catch (error: any) {
    console.error('Error deleting profile photo:', error);
    throw new Error(error.message || 'Failed to delete profile photo');
  }
};


