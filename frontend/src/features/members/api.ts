import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"

const TRIP_ID = "korea-2026"

type CreateOrUpdateMemberInput = {
  userId: string
  email: string
  displayName: string
  photoURL: string
}

export async function createOrUpdateMemberFromGoogleUser({
  userId,
  email,
  displayName,
  photoURL,
}: CreateOrUpdateMemberInput) {
  if (!email) {
    throw new Error("Unable to sign in because this Google account has no email.")
  }

  const normalizedEmail = email.toLowerCase()

  const allowedUserRef = doc(db, "allowedUsers", normalizedEmail)
  const allowedUserSnap = await getDoc(allowedUserRef)

  if (!allowedUserSnap.exists()) {
    throw new Error("This Google account is not invited to this trip.")
  }

  const allowedUserData = allowedUserSnap.data()

  const memberRef = doc(
    db,
    "trips",
    TRIP_ID,
    "members",
    normalizedEmail,
  )

  const memberSnap = await getDoc(memberRef)

  await setDoc(
    memberRef,
    {
      email: normalizedEmail,
      displayName,
      role: allowedUserData.role ?? "member",
      color: allowedUserData.color ?? "#0f766e",
      photoURL,
      userId,
      lastSeenAt: serverTimestamp(),

      /**
       * Only set createdAt when the member is first created.
       * This prevents overwriting createdAt every time they log in.
       */
      ...(memberSnap.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  )
}