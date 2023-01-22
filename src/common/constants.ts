export class Constants {
  static readonly DEFAULT_PORT = 4000;
  static readonly DEV_ENV = 'dev';
  static readonly PROD_ENV = 'prod';
  static readonly SALT_ROUNDS = 10;
  static readonly DEFAULT_PAGESIZE = 10;
  static readonly MAXIMUM_PAGESIZE = 100;
  static readonly DEFAULT_PAGENUM = 1;
  static readonly VALID_SORT_KEYS = ['_id', 'created_at', 'updated_at'];
  static readonly DEFAULT_ORDER = 'ASC';
  static readonly USERTYPES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
  };
}
