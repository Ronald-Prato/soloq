export const alertError = (errorName: string) => {
  const errorMap: { [key: string]: () => void } = {
    UserAlreadyExists: () => alert('User already exists'),
  }

  errorName.length && errorMap[errorName]()
}
