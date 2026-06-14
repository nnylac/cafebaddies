import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { MAIN_TRIP_ID } from "@/shared/constants"

export async function seedMainTrip() {
  await setDoc(
    doc(db, "trips", MAIN_TRIP_ID),
    {
      name: "Korea Trip 2026",
      currency: "KRW",
      createdAt: serverTimestamp(),
    },
    { merge: true }
  )
}