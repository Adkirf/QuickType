import { doc, getDoc, } from 'firebase/firestore';
import { auth, db } from './config';
import { signOut, deleteUser, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { createUserProfile } from './firestore';
import { UserProfile } from '../projectTypes';


export const signInWithGoogle = async (): Promise<UserProfile> => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;
        if (!googleUser.email) {
            throw new Error('No user found');
        }

        const userProfile = await ensureUserProfile(googleUser);
        return userProfile;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export async function ensureUserProfile(user: User): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        const newUserProfile: UserProfile = {
            id: user.uid,
            email: user.email!,
            // Add any other default fields you want for new users
        };
        await createUserProfile(user.uid, newUserProfile);
        return newUserProfile;
    } else {
        return userDoc.data() as UserProfile;
    }
}


export const logout = async () => {
    return await signOut(auth);
};

export const deleteUserAccount = async () => {
    const user = auth.currentUser;
    if (user) {
        await deleteUser(user);
    }
};
