# UWSC Language Support for VS Code

**UWSC**（UMI Windows Script Controller）スクリプト向けの VS Code 拡張機能です。  
シンタックスハイライト・補完・ホバー説明・シグネチャヘルプをサポートします。

> **English summary:** Full language support for UWSC scripting language in VS Code — syntax highlighting, IntelliSense, hover docs, signature help, and snippets.

---

## ✨ 機能一覧 / Features

| 機能 | 説明 |
|------|------|
| 🎨 **シンタックスハイライト** | キーワード・組込み定数・組込み変数をカラー表示 |
| 💡 **IntelliSense 補完** | キーワード／関数／定数／OPTION 項目を補完 |
| 📖 **ホバー説明** | 関数・定数にカーソルを当てると説明を表示 |
| ✍️ **シグネチャヘルプ** | 関数呼び出し時に引数の説明をリアルタイム表示 |
| 📝 **スニペット** | `IF` / `FOR` / `WHILE` / `PROCEDURE` / `FUNCTION` など頻出構文を即挿入 |
| 🗂️ **ファイル認識** | `.uws` ファイルを自動で UWSC 言語として認識 |

---

## 🚀 インストール / Installation

VS Code の拡張機能マーケットプレイスで **"UWSC"** と検索してインストール。

または、コマンドパレット（`Ctrl+Shift+P`）から：

```
ext install futurekb.uwsc-language-support
```

---

## 📖 使い方 / Usage

1. `.uws` ファイルを VS Code で開く
2. 自動的に UWSC 言語として認識され、ハイライト・補完が有効になる
3. スニペットは `if` / `for` / `proc` などのプレフィックスを入力して `Tab` で展開

### スニペット一覧

| プレフィックス | 展開内容 |
|--------------|---------|
| `if` | IF ～ THEN ～ ENDIF |
| `ife` | IF ～ THEN ～ ELSE ～ ENDIF |
| `for` | FOR ～ TO ～ NEXT |
| `while` | WHILE ～ WEND |
| `proc` | PROCEDURE 定義 |
| `func` | FUNCTION 定義 |

---

## 📌 UWSC について / About UWSC

UWSC は Windows 向けの GUI 自動化スクリプト言語です。  
公式サイトはすでに閉鎖されていますが、日本国内の業務自動化・RPA 用途で現在も広く使われています。

本拡張機能は、コミュニティで流通している仕様情報をもとに定義データを整備・拡充しています。

---

## 🛠️ 開発者向け / For Developers

```bash
git clone https://github.com/futurekb/uwsc-language-support.git
cd uwsc-language-support
npm install
npm run compile
# F5 で Extension Development Host を起動
```

---

## 🤝 コントリビューション / Contributing

- バグ報告・機能要望は [Issues](https://github.com/futurekb/uwsc-language-support/issues) へ
- 定義データの誤り・追加は PR 歓迎です
- UWSC の関数定義情報をお持ちの方、ぜひ共有してください

---

## 📄 ライセンス / License

[MIT License](LICENSE)

---

## ☕ サポート / Support

もし役に立ったら、[GitHub でスターをつけてください](https://github.com/futurekb/uwsc-language-support) ⭐  
開発継続の励みになります。
