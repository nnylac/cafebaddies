import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

import { auth, db } from "@/lib/firebase"
import { ALLOWED_USERS_COLLECTION } from "@/shared/constants"

const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: "select_account",
})

function normaliseEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function isAllowedEmail(email: string) {
  const emailKey = normaliseEmail(email)
  const allowedUserRef = doc(db, ALLOWED_USERS_COLLECTION, emailKey)
  const snapshot = await getDoc(allowedUserRef)

  return snapshot.exists()
}

export async function loginWithGoogle() {
  await setPersistence(auth, browserLocalPersistence)

  const credential = await signInWithPopup(auth, googleProvider)
  const user = credential.user

  if (!user.email) {
    await signOut(auth)
    throw new Error("No email was found for this Google account.")
  }

  const allowed = await isAllowedEmail(user.email)

  if (!allowed) {
    await signOut(auth)
    throw new Error("This Google account is not invited to this trip.")
  }

  return user
}

export async function logout() {
  await signOut(auth)
}