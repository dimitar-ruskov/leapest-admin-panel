import { ConfigDto } from 'src/app/admin-panel/models/config-dto.model';

export interface InternalRepositoryCourseListItem {
    id: string;
    name: string;
    subcategoryCode: string;
    subcategoryName: string;
    type: ConfigDto
}