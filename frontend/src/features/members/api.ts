import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"
import { MAIN_TRIP_ID } from "@/shared/constants"

export async function createOrUpdateMemberFromGoogleUser(input: {
  userId: string
  email: string
  displayName: string
  photoURL?: string
}) {
  const memberRef = doc(db, "trips", MAIN_TRIP_ID, "members", input.userId)
  const existingMember = await getDoc(memberRef)

  if (existingMember.exists()) {
    await setDoc(
      memberRef,
      {
        email: input.email.toLowerCase(),
        displayName: input.displayName,
        photoURL: input.photoURL ?? "",
        lastSeenAt: serverTimestamp(),
      },
      { merge: true }
    )

    return input.userId
  }

  await setDoc(memberRef, {
    userId: input.userId,
    email: input.email.toLowerCase(),
    displayName: input.displayName,
    photoURL: input.photoURL ?? "",
    color: "#F9A8D4",
    role: "member",
    joinedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
  })

  return input.userId
}