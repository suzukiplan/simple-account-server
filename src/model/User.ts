class User {
    /**
     * ユーザID (公開情報)
     */
    id: String;

    /**
     * ユーザ名 (公開情報)
     */
    name: String; // ユーザ名（公開情報）

    /**
     * トークン (秘匿情報)
     */
    token?: String;

    constructor(id: string, name: String) {
        this.id = id;
        this.name = name;
    }
}

export { User }
