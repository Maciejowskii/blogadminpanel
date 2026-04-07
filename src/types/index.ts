export interface ActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface GeneratePostResponse {
  title: string;
  content: string;
  imageUrl: string | null;
  keyword: string;
}

export interface ExternalPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
