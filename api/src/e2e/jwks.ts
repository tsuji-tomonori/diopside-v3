export const E2E_JWT_KID = "e2e-test-key-1";

export const E2E_JWT_PUBLIC_JWK = {
  kty: "RSA",
  kid: E2E_JWT_KID,
  use: "sig",
  alg: "RS256",
  n: "lCdPDb7XH71dakR7P1VzWrATodc9-G_LvslY-70fEG2YHgN-QdP2wUHsSOseAXC8t9EepKbQyuAL7jHzVy82TUhKWo7FumwgzIrRsQmLgDw-S14nU8NDqT_sFB9vMUlTFdNWQYgNJXOa2ZY-1ZWaC5Rgv7_MKe4yznyshRRRrgQEr8WzNSES3TRJUtG436BT-UFc1O051xffNMmlEJR94Q6SKiwBu02pEhO3VKc-mtBJ0Lj0i9cMj3_twZE2LkCYfzqVSc0sb4iJOdVoRoJBSijuoAErwZ5OVC-9LkwEhAb7yaCXXX_9VZQ3s7M97AtAV7upeTlf3pnnIug3hlAqOw",
  e: "AQAB",
} as const;

export const e2eJwks = {
  keys: [E2E_JWT_PUBLIC_JWK],
} as const;
