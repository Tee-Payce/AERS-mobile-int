import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';


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
     messageCollectionId: '678e22870025c397abf1'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);

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
  