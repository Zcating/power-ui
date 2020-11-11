export default class Utils {
  static token() {
    return (
      "token-" + ~~(Math.random() * 10000).toString() + Date.now().toString()
    );
  }
}
