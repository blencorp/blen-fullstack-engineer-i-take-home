export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  open: ["in_progress"],
  in_progress: ["in_review", "open"],
  in_review: ["completed", "in_progress"],
  completed: ["in_progress"],
};

export interface ApiError {
  error: string;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
