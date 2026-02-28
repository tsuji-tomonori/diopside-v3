import { importJWK, SignJWT } from 'jose';

const kid = 'e2e-test-key-1';
const privateJwk = {
  kty: 'RSA',
  n: 'lCdPDb7XH71dakR7P1VzWrATodc9-G_LvslY-70fEG2YHgN-QdP2wUHsSOseAXC8t9EepKbQyuAL7jHzVy82TUhKWo7FumwgzIrRsQmLgDw-S14nU8NDqT_sFB9vMUlTFdNWQYgNJXOa2ZY-1ZWaC5Rgv7_MKe4yznyshRRRrgQEr8WzNSES3TRJUtG436BT-UFc1O051xffNMmlEJR94Q6SKiwBu02pEhO3VKc-mtBJ0Lj0i9cMj3_twZE2LkCYfzqVSc0sb4iJOdVoRoJBSijuoAErwZ5OVC-9LkwEhAb7yaCXXX_9VZQ3s7M97AtAV7upeTlf3pnnIug3hlAqOw',
  e: 'AQAB',
  d: 'BqOwVkRcLa711cJV56OztLe5WYJk45JXBijN1RJHpxvSOl4btWWDZGvI5AetY5Ei0_YKMoTLTJw3zKfuaNTT0SjRNDe7wrv_yErcVNvBpbCNdiE1D_rrOFWGBezWtdW8ZHkBH5SySiBhKykhjb7TlXtDzrQQuTxUiI5ryNb9RhgUinEtxrVoyyR_5Tjf2bvkeBPIQGYFtTnp8tG2AaoO_Xap9YnyTbTI-7R3-_lXjxHsKuRKSsklu0WcwD4ZLeN3bw-yd90JXcLNqXwnJ583EpxTn9y_-Q9C0AXF0Ng1wgG1nInVKpSGcf8JLj9VOKWyV1DtXTvA6sk8pG50RoWgCQ',
  p: 'yZZJdcGS3jQ09f7wGnjKpYe8z4N1wXLj95GOYJc4Dt_A6k5PAcCBq1MiNHQ3_HIFdLCijLUt7c39S1yxDUCC0OUbxTDpEUxcFCZ-2fd-B9XNcxoQCkQYyPxxkxTNE-7NtbLiAL1KJbP9Xzd1dJ54vupHZiG82k79ZQ5oaPxDQSc',
  q: 'vCTA_kR4i5n6yif4iVeaesIJAyXcZYrZaeIxhTQ8Ce_QRwCRRLHrklFAgjpb8uQ9WFKwlRHkyEC9SyffxkKrcnvzRaHeVUsUc06gJ0z6wAzyQV5WQVJa6K9KmXDrO1m8wAJliGHT9IYtiVDgTlEQ5OFbzEMUb1_VCkJAdtrF0s0',
  dp: 'x2NE6Zo7YFkXATHV3vkWxz9I-5-1e0_eN-LahqNLqTqbn6Uw9DSqjQC_Vk6VibZluxNy0-XotcwG-uGFpevm-COEojhMbvWuJagl1AW9vJY2jeB7eQv9z94RoD700QBkq5FxhPW1PzGWLPW30U9lcsBbOqOoHe3_KFNl5mGNTAU',
  dq: 'Ymzj3eEaIwYZ0hoZBlijAydxKYlsBF8gIClp-KJ76kLf9dURKhvd_jytf7NiGO5YPVV89W9X_X8IyEGC6qhEIu8_NCVbN8nAWBZA6G54G3JqZdIhU6ju0B2r7BvLo8_tU5GtZiyvgpOTTOvXfIEiUmqm6HQLQ7yhqe1A5izLIt0',
  qi: 'o7F-dm55tlvydgEQO9adl-ei7PJfjU58TPxKBK1O4LCRs88A7nQxPi9boz5_6oQlq6gZdZxc_VprQ1v-vxuah7DxmUrKHmT5QNOJJhtB8Cc33JAdUikBwJvJTQAN9-DT8NdigEPHFnlbrrn0Rrw0ZlSMc7d9zsiYOB24Pfd9mKI',
} as const;

let cachedToken: string | null = null;

export async function getE2EAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const key = await importJWK(privateJwk, 'RS256');
  const issuer = process.env.PW_E2E_ISSUER || 'http://api:3000/e2e-issuer';
  const audience = process.env.PW_E2E_AUDIENCE || 'diopside-e2e';

  cachedToken = await new SignJWT({ scope: 'e2e' })
    .setProtectedHeader({ alg: 'RS256', kid })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject('e2e-tester')
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(key);

  return cachedToken;
}
