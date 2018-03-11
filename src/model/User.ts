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
     * 秘匿情報
     */
    secret?: any;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export { User }
