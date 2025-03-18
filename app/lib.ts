export const decimal = (n: string | null) => parseInt(n as string, 10)

export const randWait = () => Math.ceil(Math.random() * 3000)

export const delay = (delayInMs?: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delayInMs ?? randWait())
  })
}

export const fakeProcessResult = () => Math.random() > 0.7 ? false : true
