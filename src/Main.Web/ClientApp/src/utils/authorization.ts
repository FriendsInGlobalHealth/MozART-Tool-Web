export function setAuthorization(authorization: string): void {
  if (authorization) {
    localStorage.setItem('em-authorization', authorization);
  }
}

export function getAuthorization(): string | null {
  return localStorage.getItem('em-authorization');
}

export function setEnabled(enabled: any): void {
  localStorage.setItem('em-user-enabled', ''.concat(enabled));
}

export function getEnabled(): any {
  return localStorage.getItem('em-user-enabled');
}

export function cleanStorage(): void {
  localStorage.removeItem('em-authorization');
  localStorage.removeItem('em-authority');
  localStorage.removeItem('em-user-enabled');
}

export function hasAuthInfo() {
  return localStorage.getItem('em-authorization') && localStorage.getItem('em-authority');
}
