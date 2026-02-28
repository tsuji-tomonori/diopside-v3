export type AppEnv = {
  Variables: {
    trace_id: string;
    auth_sub?: string;
    auth_scope?: string[];
    auth_groups?: string[];
  }
};
