export interface CourseSubCategory {
  id: string;
  name: string;
  code: string;
}

export interface CreateCourseSubCategoryPayload {
  name: string;
  category: { id: string };
  description?: string;
  keywords?: string[];
}
