/**
 * System roles for the `users` collection (Super Admin / Affiliate).
 * Event Organizers and Collection Executives are separate authenticated
 * entities (their own collections) and are represented by ActorType, not Role.
 */
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AFFILIATE = 'AFFILIATE',
}

/**
 * Identifies which collection an authenticated principal belongs to.
 * Used in the JWT payload so authorization middleware knows which
 * repository to check hierarchy/ownership against.
 */
export enum ActorType {
  USER = 'USER',
  EVENT_ORGANIZER = 'EVENT_ORGANIZER',
  COLLECTION_EXECUTIVE = 'COLLECTION_EXECUTIVE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
