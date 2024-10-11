import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const upload = (file) => {

  return new Promise((resolve, reject) => {

    const storage = getStorage();
    const storageRef = ref(storage, `images/${Date.now() + file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {

        console.log("Error during upload:", error.code, error.message);
        switch (error.code) {
          case 'storage/unauthorized':
            reject('Unauthorized access to storage.');
            break;
          case 'storage/canceled':
            reject('Upload canceled.');
            break;
          case 'storage/unknown':
            reject('Unknown error occurred.');
            break;
          default:
            reject(error.message);
        }
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);  
        } catch (error) {
          reject('Error getting download URL: ' + error.message);
        }
      }
    );
  });
};

export default upload;
