class NotAuthError {
  constructor(message) {
    this.message = message;
    this.status = 401; // 인증 실패를 나타내는 HTTP 상태 코드
  }
}

exports.NotAuthError = NotAuthError;
