import { Posts } from "./posts.model";

export class PaginatedPosts {
  current_page: number = 0;
  data: Posts[] = [];
  first_page_url: string = '';
  from: number = 0;
  last_page: number = 0;
  last_page_url: number = 0;
  links: any;
  next_page_url: string = '';
  path: string = '';
  per_page: number = 0;
  prev_page_url: string = '';
  to: number = 0;
  total: number = 0;
}
