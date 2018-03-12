class User {
    /**
     * ユーザID
     */
    id: string;

    /**
     * ユーザ名
     */
    name: string;

    /**
     * 登録日 (UNIX time x 1000)
     */
    registerDate: number;

    /**
     * 秘匿情報
     */
    secret?: any;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.registerDate = new Date().getTime();
    }
}

export { User }
