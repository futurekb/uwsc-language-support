# UWSC Language Support for VS Code

UWSC（Umiumi Windows Script）向けの VS Code 拡張機能です。

## できること

- `.uws` ファイルを `uwsc` 言語として認識
- シンタックスハイライト（キーワード / 組込み定数 / 組込み変数）
- キーワード / 関数 / 定数 / OPTION項目 の補完（IntelliSense）
- 関数と定数のホバー説明表示
- 関数呼び出し時のシグネチャヘルプ
- よく使う構文スニペット（IF / FOR / PROCEDURE）

## 定義データについて

関数・キーワード・定数・OPTION項目の定義は、リポジトリ内の `rule/*.txt`（UWSC仕様メモ）をベースに整備しています。

公式サイト閉鎖により、コミュニティで流通している仕様情報（紹介記事・派生実装のドキュメント）を前提に、今後も定義を拡充していく方針です。

## 開発

```bash
npm install
npm run compile
```

`F5` で Extension Development Host を起動して動作確認できます。
