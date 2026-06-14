export type TripMemberRole = "owner" | "member"

export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "utilities"
  | "groceries"
  | "accommodation"
  | "other"

export type MainTrip = {
  id: string
  name: string
  startDate?: Date
  endDate?: Date
  currency: "KRW"
  createdAt: Date
}

export type TripMember = {
  id: string
  userId?: string
  displayName: string
  email?: string
  color: string
  role: TripMemberRole
  joinedAt?: Date
}

export type SubTrip = {
  id: string
  name: string
  type: "area" | "day" | "theme"
  date?: Date
  color?: string
  order: number
  createdAt: Date
}

export type Expense = {
  id: string
  title: string
  amountKrw: number
  estimatedSgd?: number
  paidByMemberId: string
  splitWithMemberIds: string[]
  category: ExpenseCategory
  subTripId?: string
  spentAt: Date
  notes?: string
  createdAt: Date
  createdByUserId?: string
}

export type MapPin = {
  id: string
  title: string
  address?: string
  naverUrl?: string
  lat?: number
  lng?: number
  color: string
  memberId?: string
  subTripId?: string
  category?: string
  notes?: string
  isAccommodation: boolean
  createdAt: Date
}

export type CalendarEvent = {
  id: string
  title: string
  startTime: Date
  endTime?: Date
  category?: string
  color?: string
  sticker?: string
  linkedPinId?: string
  subTripId?: string
  notes?: string
  createdAt: Date
}

export type TripNote = {
  id: string
  title: string
  content: string
  area?: string
  subTripId?: string
  day?: number
  checklistItems?: {
    text: string
    completed: boolean
  }[]
  createdAt: Date
  updatedAt: Date
}