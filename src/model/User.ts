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
     * 登録日 (UNIX time)
     */
    registerDate: number;

    /**
     * 秘匿情報
     */
    secret?: any;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.registerDate = Math.floor(new Date().getTime() / 1000);
    }
}

export { User }
