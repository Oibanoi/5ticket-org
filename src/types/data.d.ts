/**
 * Data namespace chứa các interface core của ứng dụng
 * Được sử dụng để extend NextAuth types và maintain consistency
 */
export namespace Data {
  export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }
}
