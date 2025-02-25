import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
import * as FileSystem from 'expo-file-system';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'com.dcnolie.aers',
    projectId: '67766a4d002a66df4038',
    databaseId: '677673cd0024e2b733a9',
    userCollectionId:'67767427000827d546ae',
    videoCollectionId: '67767469002a1b3429d9',
    classCollectionId: '6788e8630018c8251328',
    reportCollectonId:'6788f2e3001dbc0f7244',
    responderCollectionId:'6788f1e80021e8e1aba8',
    storageId:'6777baa3000d500c3519',
     messageCollectionId: '678e22870025c397abf1',
     endpointRealtime: 'wss://cloud.appwrite.io/v1/realtime',
     videosBucketId: '6794f17e002ac67b43f5',
     apiKey:'standard_d3196e0a67d92f2666e592e7cfb2152b853abc35452cfcf776d146553e6c2e184494843fc3f8b609b474acd9605fc80342fc0d0e32be4ea7956e168b1139e5c69b1847270108018fbfb97c85d540ca7a31d5d039eac4d2f180d9483c41d6f35f30222bd6d5042deb5c422fb41cba4663aff4b722d63eb89d7f19bf1e367dd18e',
}


// Init your React Native SDK
export const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
    .setEndpointRealtime(config.endpointRealtime)
;

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const createUser = async (username, fullName, email, password) => {
  try {
      const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
      if (!isValidEmail(email)) {
          throw new Error('Please enter a valid email address.');
      }

      console.log('Creating user with email:', email);

      const newAccount = await account.create(
          ID.unique(),
          email,       // Correct order: Email
          password,    // Password
           fullName  // Optional Name
      );

      if (!newAccount) throw new Error('Failed to create account');

      const avatarUrl = avatars.getInitials(username);

      const newUser = await databases.createDocument(
          config.databaseId,
          config.userCollectionId,
          ID.unique(),
          {
              accountId: newAccount.$id,
              email,
              username,
              fullName,
              avatar: avatarUrl
          }
      );

      await signIn(email, password);
      // Fetch the current user and update the global context state
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return newUser;
  } catch (error) {
      console.error('Error in createUser:', error.message || error);
      throw new Error(error.message || 'Something went wrong.');
  }
};

// Register User
export const signIn= async (email, password) => {
    try {
      // Check if there is an active session before attempting to delete it
      try {
        await account.deleteSession('current'); // This will log out the current user
      } catch (error) {
        if (error.code !== 401) {
          console.error('Error clearing session:', error.message || error);
        }
      }
  
      // Now attempt to create a new session with the provided credentials
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Sign-in failed:', error.message || error);
      throw error; // Re-throw the error for further handling
    }
  }

  export const getCurrentUser = async () => {
    try {
      const currentAccount = await account.get();

      if(!currentAccount) throw Error;
      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      )
      if (!currentUser) throw Error;    
      
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
    }
  }

  export const sendMessage = async (messageBody, urlUserId, urlResponderId) =>{
    
    try {
      const newMessage = await databases.createDocument(
        config.databaseId,
        config.messageCollectionId,
        ID.unique(),{
          messageBody,
          userId:urlUserId,
          created: new Date().toISOString(),
          responderId: urlResponderId,
          isResponderSender: false
        }
      );
      console.log('new message created',messageBody);

     return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
  export const uploadVideos = async (videoUris, urlUserId) => {
    try {
      if (!videoUris.back || !videoUris.front) {
        throw new Error("Missing video files.");
      }
  
      console.log("Uploading videos...");
  
      // Convert URIs to file objects
      const backVideoFile = {
        name: `back_${Date.now()}.mp4`,
        uri: videoUris.back,
        type: 'video/mp4',
      };
  
      const frontVideoFile = {
        name: `front_${Date.now()}.mp4`,
        uri: videoUris.front,
        type: 'video/mp4',
      };
  
      // Upload videos to Appwrite Storage
      const backUpload = await storage.createFile(config.videosBucketId, ID.unique(), backVideoFile);
      const frontUpload = await storage.createFile(config.videosBucketId, ID.unique(), frontVideoFile);
  
      console.log("Videos uploaded:", backUpload, frontUpload);
  
      // Get public URLs for the uploaded videos
      const backVideoUrl = storage.getFileView(config.videosBucketId, backUpload.$id);
      const frontVideoUrl = storage.getFileView(config.videosBucketId, frontUpload.$id);
  
      // Store metadata in the database collection
      const videoData = await databases.createDocument(config.databaseId, config.videoCollectionId, ID.unique(), {
        title: `User ${userId} - Video Report`,
        backvideo: backVideoUrl,
        frontvideo: frontVideoUrl,
        reporter: urlUserId, // Assuming this is the reference to the reporter user
      });
  
      console.log("Video metadata saved:", videoData);
      return videoData;
    } catch (error) {
      console.error("Error uploading videos:", error);
      throw error;
    }
  };

