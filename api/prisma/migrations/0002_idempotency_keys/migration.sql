CREATE TABLE idempotency_keys (
  id uuid PRIMARY KEY,
  idem_key varchar(255) NOT NULL,
  operator varchar(64) NOT NULL,
  endpoint varchar(255) NOT NULL,
  payload_hash varchar(255) NOT NULL,
  run_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  CONSTRAINT uq_idempotency_keys_scope UNIQUE (idem_key, operator, endpoint, payload_hash)
);

CREATE INDEX idx_idempotency_keys_run_id ON idempotency_keys (run_id);
CREATE INDEX idx_idempotency_keys_expires_at ON idempotency_keys (expires_at);
