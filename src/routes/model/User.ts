class User {
    id: String; // ID（公開情報）
    name: String; // ユーザ名（公開情報）
    token?: String; // セッションの取得に必要なトークン（秘匿情報）
 
    constructor(id: string, name: String) {
        this.id = id;
        this.name = name;
    }
}

export { User }
