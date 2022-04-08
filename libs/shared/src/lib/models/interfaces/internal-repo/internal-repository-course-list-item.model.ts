import {ConfigDto} from "../common/config-dto.model";

export interface InternalRepositoryCourseListItem {
    id: string;
    name: string;
    subcategoryCode: string;
    subcategoryName: string;
    type: ConfigDto
}
