import { UserProfile } from '../projectTypes';
import { db } from './config';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, addDoc } from 'firebase/firestore';

export const createDocument = async (collectionName: string, docId: string, data: any) => {
    await setDoc(doc(db, collectionName, docId), data);
};

export const readDocument = async (collectionName: string, docId: string) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
    await updateDoc(doc(db, collectionName, docId), data);
};

export const deleteDocument = async (collectionName: string, docId: string) => {
    await deleteDoc(doc(db, collectionName, docId));
};

export const queryDocuments = async (collectionName: string, field: string, operator: any, value: any) => {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createUserProfile = async (userId: string, userProfile: UserProfile) => {
    await createDocument('userProfiles', userId, userProfile);
};

export const getUserProfile = async (userId: string) => {
    return await readDocument('userProfiles', userId);
};

export const updateUserProfile = async (userId: string, userProfile: UserProfile) => {
    await updateDocument('userProfiles', userId, userProfile);
};

export const deleteUserProfile = async (userId: string) => {
    await deleteDocument('userProfiles', userId);
};


export const createGame = async (gameData: any) => {
    const docRef = await addDoc(collection(db, 'games'), gameData);
    return docRef.id;
};

export const getGame = async (gameId: string) => {
    return await readDocument('games', gameId);
};

export const updateGame = async (gameId: string, gameData: any) => {
    await updateDocument('games', gameId, gameData);
};

export const deleteGame = async (gameId: string) => {
    await deleteDocument('games', gameId);
};

export const getUserGames = async (userId: string) => {
    return await queryDocuments('games', 'userId', '==', userId);
};