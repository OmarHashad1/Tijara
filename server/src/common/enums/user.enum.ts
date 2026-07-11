export enum ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

export enum USER_STATUS {
  ACTIVE = 'active',
  DEACTIVATED = 'deativated',
  BANNED = 'BANNED',
}

export const USER_STATUS_TRANSITIONS = {
  ban: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED],
  unban: [USER_STATUS.BANNED],
} as const;


export enum PAYMENT_METHOD {
  CARD = 'card',
  POD = 'POD',
}
