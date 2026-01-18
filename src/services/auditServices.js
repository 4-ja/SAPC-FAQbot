import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export const logAction = async (actionType, targetTitle, targetId) => {
  try {
    await addDoc(collection(db, "auditLogs"), {
      action: actionType, // "CREATED", "UPDATED", or "DELETED"
      targetTitle: targetTitle,
      targetId: targetId,
      userEmail: auth.currentUser?.email,
      userName: auth.currentUser?.displayName || "System",
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Audit Log Error:", error);
  }
};